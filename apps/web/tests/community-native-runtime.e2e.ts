// Real profile, Host services and browser transport with a controlled model
// adapter. No production profile, credentials, remote plugin or DOM mock.
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type Page } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { createUserMessage, LlmAdapter, type GenerateOptions, type StreamChunk } from '@deepseek-ai/dsh-llm'
import type { JobId, JobOutcome } from '@deepseek-ai/dsh-jobs'
import type { SubagentRun } from '@deepseek-ai/dsh-subagent'
import type {} from '@deepseek-ai/dsh-experimental-agent-team'
import type {} from '@deepseek-ai/dsh-agent-default-model'
import {
  acknowledgeReloadConnectionLoss, launchWebScaffold, readPersistedEvents, watchConsole, webSnapshotMode, type WebScaffold,
} from './scaffold.ts'
import { connectFreshWorkspace, newEnglishPage, REPO_ROOT } from './support.ts'

declare module '@deepseek-ai/dsh-jobs/view' {
  interface JobKindMap { 'community-check': 'community-check' }
}

const TEAM_OVERLAY = fileURLToPath(new URL('./agent-team-panel.overlay.yml', import.meta.url))
const TEAM_ANCHOR = fileURLToPath(new URL('../../../packages/experimental/agent-team-profile/package.json', import.meta.url))
const EXTENSION = fileURLToPath(new URL('./fixtures/plugins/fixture-community-header', import.meta.url))
const PROVIDER = 'community-controlled-test'
const MODEL = 'controlled-response'
const ANSWER = 'The isolated community runtime check completed successfully.'
const PARENT_ANSWER = 'The background output check completed and its output is available in Background jobs.'
const DEMO_TEXT = '## Native session tools\n\n这是独立测试环境中的公开示例，验证长中文段落、行内代码 `community/example/very-long-path/without-breaking-navigation.ts` 与原生任务状态可以共同展示。\n\n```ts\nconst result = await runCommunityCheck({ message: "A long unwrapped code line remains inside its own horizontally scrollable container." });\nconsole.log(result);\n```\n\nNo personal conversations or credentials are included.'
const PHONE_SIZES = [[360, 800], [393, 852], [412, 915], [430, 932]] as const

/** Holds a real Agent stream at a barrier until the browser proves overlap. */
class ControlledAdapter extends LlmAdapter {
  calls = 0
  parentCalls = 0
  parentId: string | undefined
  private release!: () => void
  private markReady!: () => void
  readonly ready = new Promise<void>((resolve) => { this.markReady = resolve })
  private readonly completion = new Promise<void>((resolve) => { this.release = resolve })

  finish(): void { this.release() }

  override async listModels(provider: string) {
    return [{ provider, id: MODEL, name: 'Controlled community test' }]
  }

  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (options.sessionId === this.parentId) {
      if (++this.parentCalls > 2) throw new Error('unexpected additional parent notification request')
      const text = this.parentCalls === 1 ? DEMO_TEXT : PARENT_ANSWER
      yield { type: 'block-start', index: 0, blockType: 'text' }
      yield { type: 'text-delta', index: 0, text }
      yield { type: 'block-end', index: 0, block: { type: 'text', text } }
      yield { type: 'finish', reason: { kind: 'stop' } }
      return
    }
    if (++this.calls !== 1) throw new Error('unexpected additional controlled model request')
    const signal = options.signal
    if (signal === undefined) throw new Error('controlled model requires a turn signal')
    let abort!: () => void
    const aborted = new Promise<never>((_resolve, reject) => {
      abort = () => { reject(signal.reason instanceof Error ? signal.reason : new Error('controlled model aborted')) }
      if (signal.aborted) abort()
      else signal.addEventListener('abort', abort, { once: true })
    })
    try {
      yield { type: 'block-start', index: 0, blockType: 'text' }
      this.markReady()
      await Promise.race([this.completion, aborted])
      if (signal.aborted) throw signal.reason
      yield { type: 'text-delta', index: 0, text: ANSWER }
      yield { type: 'block-end', index: 0, block: { type: 'text', text: ANSWER } }
      yield { type: 'finish', reason: { kind: 'stop' } }
    } finally {
      signal.removeEventListener('abort', abort)
    }
  }
}

/** Test-authored model response consumed through the ordinary Agent loop. */
async function addDemoTurn(scaffold: WebScaffold, agent: Agent): Promise<void> {
  agent.followup(createUserMessage({
    content: [{ type: 'text', text: 'DSH Community Web UI demonstration' }], source: { kind: 'user' },
  }))
  await agent.whenIdle()
  agent.session.append('session/title', {
    title: '社区 Web 整合版：原生任务栏与长中文项目标题响应式验证', messageSeqs: [], source: { kind: 'user' },
  })
  await scaffold.ctx.sessions.flush(agent.session)
}

describe.skipIf(webSnapshotMode() === 'record')('community Web: native runtime and presentation', () => {
  let scaffold: WebScaffold
  let browser: Browser
  let page: Page
  let shots: string
  let parent: Agent
  let child: SubagentRun | undefined
  let producer: ChildProcessWithoutNullStreams | undefined
  let producerDone: Promise<JobOutcome> | undefined
  let tripwire: ReturnType<typeof watchConsole>
  let jobId: JobId
  const adapter = new ControlledAdapter()

  beforeAll(async () => {
    await mkdir(join(REPO_ROOT, '.artifacts'), { recursive: true })
    shots = await mkdtemp(join(REPO_ROOT, '.artifacts/community-native-runtime-'))
    scaffold = await launchWebScaffold({
      profile: { packages: [{ dir: EXTENSION, enabled: true }] },
      extraOverlayPath: TEAM_OVERLAY,
      extraInstallAnchors: [TEAM_ANCHOR],
    })
    scaffold.ctx.effect(() => scaffold.ctx.llm.registerAdapter([PROVIDER], adapter), 'community controlled model')
    await scaffold.ctx.agentDefaultModel.saveSelection({ provider: PROVIDER, model: MODEL })
    const executablePath = process.env.DSH_PLAYWRIGHT_EXECUTABLE_PATH
    browser = await chromium.launch(executablePath === undefined ? {} : { executablePath })
    page = await newEnglishPage(browser)
    tripwire = watchConsole(page)
    await page.goto(scaffold.authenticatedUrl, { waitUntil: 'load' })
    await page.waitForSelector('[class*="frame"]', { timeout: 30_000 })
    await connectFreshWorkspace(page, scaffold.workspaceCwd, 'community-demo')
    const root = scaffold.ctx.agents.roots()[0]
    if (root === undefined) throw new Error('native workspace did not create its Agent')
    parent = root
    adapter.parentId = parent.id
    await addDemoTurn(scaffold, parent)
    await page.getByRole('heading', { name: 'Native session tools' }).waitFor()
  })

  it('keeps the mobile navigation modal focused and restores its original invoker', async () => {
    // Regression reproduced before the AppFrame fix: focus fell to BODY,
    // Tab entered the covered composer, and Escape did not close the drawer.
    const mobile = await browser.newContext({
      viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true,
      locale: 'en-US', storageState: await page.context().storageState(),
    })
    try {
      const probe = await mobile.newPage()
      await probe.goto(scaffold.baseUrl, { waitUntil: 'load' })
      await probe.getByRole('heading', { name: 'Native session tools' }).waitFor()
      const invoker = probe.locator('[data-shell-leading] button').first()
      await invoker.click()
      await probe.locator('[class*="sidebarCol"][role="dialog"][aria-modal="true"]').waitFor()
      const focus = () => probe.evaluate(() => {
        const element = document.activeElement
        return {
          tag: element?.tagName, label: element?.getAttribute('aria-label'),
          inSidebar: Boolean(element?.closest('[class*="sidebarCol"]')),
          inBackground: Boolean(element?.closest('[class*="centerCol"]')),
        }
      })
      await expect.poll(async () => (await focus()).inSidebar).toBe(true)
      const afterOpen = await focus()
      const tabSequence = []
      for (let index = 0; index < 30; index++) {
        await probe.keyboard.press('Tab')
        tabSequence.push(await focus())
      }
      await probe.screenshot({ path: join(shots, 'sidebar-focus-probe.png') })
      await probe.keyboard.press('Escape')
      await expect.poll(() => probe.locator('[data-mobile-web="true"]').getAttribute('data-sidebar-collapsed')).toBe('true')
      await expect.poll(() => invoker.evaluate(element => element === document.activeElement)).toBe(true)
      const closedByEscape = await probe.locator('[data-mobile-web="true"]').getAttribute('data-sidebar-collapsed') === 'true'
      await writeFile(join(shots, 'sidebar-focus-probe.json'), JSON.stringify({
        afterOpen, tabSequence, closedByEscape, afterEscape: await focus(),
      }, null, 2) + '\n')
      expect(tabSequence.every(entry => entry.inSidebar && !entry.inBackground)).toBe(true)
    } finally {
      await mobile.close()
    }
  })

  afterAll(async () => {
    const failures: unknown[] = []
    adapter.finish()
    if (producer?.exitCode === null) producer.kill()
    await producerDone?.catch((error: unknown) => failures.push(error))
    await child?.dispose().catch((error: unknown) => failures.push(error))
    await browser?.close().catch((error: unknown) => failures.push(error))
    await scaffold?.close().catch((error: unknown) => failures.push(error))
    if (failures.length) throw new AggregateError(failures, 'community runtime cleanup failed')
  })

  it('keeps native job and child identities through browser refresh and returns their real results', async () => {
    expect(await page.locator('html').getAttribute('data-community-web-ui')).toBe('true')
    expect(scaffold.harnessHome.startsWith(scaffold.workspaceCwd)).toBe(true)
    expect(scaffold.ctx.jobs.list(parent.id)).toHaveLength(0)
    jobId = scaffold.ctx.jobs.start({
      kind: 'community-check', label: 'Community output check', owner: parent.id,
      run(job) {
        // A portable real subprocess emits output, then awaits an explicit
        // completion request. A bounded timeout prevents an orphaned process.
        producer = spawn(process.execPath, ['-e', `
          console.log('community-job-started');
          const timeout = setTimeout(() => process.exit(3), 300000);
          process.stdin.once('data', () => {
            clearTimeout(timeout);
            console.log('community-job-completed');
            process.exit(0);
          });
        `], { cwd: scaffold.workspaceCwd, env: {}, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
        producer.stdout.on('data', (data: Buffer) => { job.append(data.toString(), { channel: 'stdout' }) })
        producer.stderr.on('data', (data: Buffer) => { job.append(data.toString(), { channel: 'stderr' }) })
        const processHandle = producer
        producerDone = new Promise<JobOutcome>((resolve) => {
          processHandle.once('error', () => { resolve({ status: 'failed', detail: 'Test producer could not start' }) })
          processHandle.once('close', (code) => { resolve({
            status: code === 0 ? 'completed' : 'failed', detail: `exit code: ${String(code)}`,
          }) })
        })
        return { cancel: () => { processHandle.kill() }, done: producerDone }
      },
    })
    const liveJob = page.getByRole('button', { name: '1 background job running', exact: true })
    await liveJob.waitFor()
    await liveJob.click()
    await page.getByRole('button', { name: 'Show live output of Community output check' }).click()
    await page.getByText('community-job-started', { exact: true }).waitFor()
    await page.screenshot({ path: join(shots, 'background-job-running.png') })
    await page.keyboard.press('Escape')

    child = await scaffold.ctx.subagents.start('spawn', {
      label: 'Community reviewer', parent, signal: new AbortController().signal,
      prompt: [{ type: 'text', text: 'Return the controlled test response without using tools.' }],
      agentOptions: { provider: PROVIDER, model: MODEL },
    })
    await adapter.ready
    const childId = child.id
    expect(child.localAgent?.id).toBe(childId)
    const children = page.getByRole('button', { name: /1 subagent/ })
    await children.waitFor()
    await children.press('ArrowDown')
    await page.getByRole('treeitem', { name: /Community reviewer/ }).waitFor()
    await page.screenshot({ path: join(shots, 'subagent-running.png') })
    await page.keyboard.press('Escape')
    expect(scaffold.ctx.jobs.get(jobId, parent.id).status).toBe('running')
    expect(child.localAgent?.status).toBe('running')
    await page.screenshot({ path: join(shots, 'parallel-native-tools.png') })

    const warningStart = tripwire.warnings.length
    await page.reload({ waitUntil: 'load' })
    await liveJob.waitFor({ timeout: 30_000 })
    await children.waitFor({ timeout: 15_000 })
    acknowledgeReloadConnectionLoss(tripwire, warningStart)
    expect(scaffold.ctx.jobs.list(parent.id).map(job => job.id)).toEqual([jobId])
    expect((await scaffold.ctx.subagents.listChildren(parent.id)).map(row => row.id)).toEqual([childId])
    adapter.finish()
    const result = await child.result
    expect(result.stopReason).toBe('completed')
    expect(result.output).toEqual([{ type: 'text', text: ANSWER }])
    expect(adapter.calls).toBe(1)
    await child.dispose()
    const recorded = await readPersistedEvents(scaffold, childId)
    expect(recorded.some(event => event.type === 'turn/end' && event.data.reason.kind === 'completed')).toBe(true)

    producer?.stdin.end('complete\n')
    expect((await producerDone)?.status).toBe('completed')
    expect(producer?.signalCode).toBeNull()
    expect(producer?.exitCode).toBe(0)
    await expect.poll(() => scaffold.ctx.jobs.get(jobId, parent.id).status).toBe('completed')
    await page.getByText(PARENT_ANSWER, { exact: true }).waitFor()
    await parent.whenIdle()
    expect(adapter.parentCalls).toBe(2)
    await scaffold.ctx.sessions.flush(parent.session)
    const parentEvents = await readPersistedEvents(scaffold, parent.id)
    const parentTurns = parentEvents.filter(event => event.type === 'turn/end')
    expect(parentTurns).toHaveLength(2)
    expect(parentTurns.every(event => event.data.reason.kind === 'completed')).toBe(true)
    const idleJob = page.getByRole('button', { name: '1 background job', exact: true })
    await idleJob.waitFor()
    await idleJob.click()
    await page.getByRole('button', { name: 'Show live output of Community output check' }).click()
    await page.getByText(/community-job-completed/).waitFor()
    await page.screenshot({ path: join(shots, 'background-job-completed.png') })
    await page.keyboard.press('Escape')
    await writeFile(join(shots, 'native-identities.json'), JSON.stringify({
      type: 'real-native-profile-with-controlled-model-adapter', externalModelRequests: 0,
      parentId: parent.id, childId, jobId, childResult: result.stopReason, jobStatus: 'completed',
      childModelCalls: adapter.calls, parentModelCalls: adapter.parentCalls,
      refreshPreservedIdentities: true, duplicateRecords: 0,
    }, null, 2) + '\n')
  })

  it('uses the original Team board and keeps seven viewport layouts inside the screen', async () => {
    const task = await scaffold.ctx.agentTeams.createTask(parent, {
      subject: 'Review responsive navigation', description: 'A task created through the native Team service.', writeScopes: [],
    })
    await scaffold.ctx.agentTeams.updateTask(parent, { taskId: task.id, expectedRevision: task.revision, action: 'claim' })
    await page.locator('[data-team-action]').getByRole('button', { name: /Agent Team/ }).click()
    const panel = page.getByRole('dialog', { name: 'Agent Team', exact: true })
    await panel.getByText('Review responsive navigation', { exact: true }).waitFor()
    await panel.getByText('In progress', { exact: true }).waitFor()
    await page.screenshot({ path: join(shots, 'native-team-board.png') })
    await page.keyboard.press('Escape')
    const savedState = await page.context().storageState()
    for (const [width, height] of [...PHONE_SIZES, [768, 1024] as const, [1280, 800] as const, [1440, 900] as const]) {
      const context = await browser.newContext({
        viewport: { width, height }, storageState: savedState, locale: 'en-US',
        isMobile: width <= 430, hasTouch: width <= 768,
      })
      try {
        const viewportPage = await context.newPage()
        const viewportErrors = watchConsole(viewportPage)
        await viewportPage.goto(scaffold.baseUrl, { waitUntil: 'load' })
        await viewportPage.getByRole('heading', { name: 'Native session tools' }).waitFor()
        if (width <= 430) {
          const tabs = await viewportPage.locator('[data-conversation-tabs]').boundingBox()
          if (tabs === null) throw new Error('mobile page navigation is not visible')
          const controls = viewportPage.locator('[data-community-header-control], [data-community-plugins] > button')
          expect(await controls.count()).toBe(4)
          for (const control of await controls.all()) {
            const box = await control.boundingBox()
            if (box === null) throw new Error('mobile session control is not visible')
            expect(Math.abs(box.y + box.height / 2 - tabs.y - tabs.height / 2)).toBeLessThanOrEqual(4)
            expect(box.width).toBeGreaterThanOrEqual(44)
            expect(box.height).toBeGreaterThanOrEqual(44)
          }
          await viewportPage.locator('[class*="headerUtilities"]').getByRole('button', { name: 'More actions', exact: true }).click()
          await viewportPage.getByRole('menu').waitFor()
          await viewportPage.screenshot({ path: join(shots, `native-utilities-${width}x${height}.png`) })
          await viewportPage.keyboard.press('Escape')
        }
        for (const colorScheme of ['light', 'dark'] as const) {
          await viewportPage.emulateMedia({ colorScheme })
          await expect.poll(() => viewportPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          await viewportPage.screenshot({ path: join(shots, `web-${width}x${height}-${colorScheme}.png`) })
        }
        const extensions = viewportPage.locator('[data-community-plugins]')
        const extensionTrigger = extensions.getByRole('button', { name: 'Plugins', exact: true })
        await extensionTrigger.click()
        await extensions.getByRole('button', { name: 'Extension details', exact: true }).waitFor()
        const menuId = await extensionTrigger.getAttribute('aria-controls')
        expect(menuId).not.toBeNull()
        await expect.poll(() => viewportPage.locator(`[id="${menuId}"]`).evaluate((element) => {
          const box = element.getBoundingClientRect()
          return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight
        })).toBe(true)
        await viewportPage.screenshot({ path: join(shots, `plugins-${width}x${height}.png`) })
        await viewportPage.keyboard.press('Escape')
        const input = viewportPage.locator('[data-composer-input][contenteditable="true"]').first()
        await input.fill('第一行未发送草稿\n第二行输入\n第三行验证')
        const permissions = viewportPage.getByRole('button', { name: /^Access mode, current:/ })
        await permissions.click()
        await viewportPage.getByRole('menuitem', { name: 'Workspace Write', exact: true }).waitFor()
        await viewportPage.screenshot({ path: join(shots, `permissions-${width}x${height}.png`) })
        await viewportPage.keyboard.press('Escape')
        await viewportPage.getByRole('button', { name: /^Select model, current/ }).click()
        await viewportPage.getByRole('menu', { name: 'Model and reasoning effort', exact: true }).waitFor()
        await viewportPage.screenshot({ path: join(shots, `models-${width}x${height}.png`) })
        await viewportPage.keyboard.press('Escape')
        expect(await input.innerText()).toContain('第三行验证')
        await input.fill('')
        expect(viewportErrors.pageErrors).toEqual([])
        expect(viewportErrors.warnings).toEqual([])
      } finally {
        await context.close()
      }
    }
    expect(tripwire.pageErrors).toEqual([])
    expect(tripwire.warnings).toEqual([])
  })

  it('keeps real extension registrations separate and removes them when their bundle is disabled', async () => {
    const group = page.locator('[data-community-plugins]')
    const trigger = group.getByRole('button', { name: 'Plugins', exact: true })
    await trigger.click()
    const counter = group.getByRole('button', { name: 'Extension counter', exact: true })
    await counter.waitFor()
    await counter.click()
    await expect.poll(() => counter.innerText()).toBe('Extension counter 1')
    await page.screenshot({ path: join(shots, 'plugins-expanded.png') })
    await page.keyboard.press('Escape')
    await scaffold.ctx.pluginManager.setBundleEnabled('@fixture/community-header', false)
    await group.locator('[data-community-demo-extension]').first().waitFor({ state: 'detached' })
    await expect.poll(() => trigger.isVisible()).toBe(false)
    await scaffold.ctx.pluginManager.setBundleEnabled('@fixture/community-header', true)
    await trigger.waitFor()
    await trigger.click()
    await counter.waitFor()
    expect(await group.locator('[data-community-demo-extension]').count()).toBe(2)
    expect(await page.locator('[data-community-header-control="subagents"]').count()).toBe(1)
    expect(tripwire.pageErrors).toEqual([])
    expect(tripwire.warnings).toEqual([])
  })
})
