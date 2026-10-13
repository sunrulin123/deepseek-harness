// @vitest-environment jsdom
import { useEffect } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { makeTranslate } from '@deepseek-ai/dsh-client-test-runtime'
import { HeaderPlugins } from '../src/client/skeleton/HeaderPlugins.tsx'
import { zh } from '../src/client/locales.ts'

afterEach(cleanup)

it('opens extension controls once, preserves their state, and dismisses by Escape and outside pointer', () => {
  const mounted = vi.fn()
  const stopped = vi.fn()
  function Extension() {
    useEffect(() => { mounted(); return stopped }, [])
    return <input aria-label="Extension value" defaultValue="10" />
  }
  const renderSlot = vi.fn(() => <div data-slot="conversation.session.header.actions"><Extension /></div>)
  const view = render(<HeaderPlugins renderSlot={renderSlot as never} t={makeTranslate(zh)} />)
  const trigger = view.getByRole('button', { name: '插件' })
  expect(trigger.getAttribute('title')).toBe('插件')
  expect(trigger.querySelector('svg[width="20"][aria-hidden="true"]')).not.toBeNull()
  expect(view.queryByRole('textbox')).toBeNull()
  expect(renderSlot).toHaveBeenLastCalledWith('conversation.session.header.actions', {}, { excludeGroups: ['native', 'status'] })
  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  const input = view.getByRole('textbox', { name: 'Extension value' })
  fireEvent.change(input, { target: { value: '20' } })
  fireEvent.keyDown(input, { key: 'Escape' })
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger)
  fireEvent.click(trigger)
  expect(view.getByRole('textbox', { name: 'Extension value' })).toBe(input)
  expect((input as HTMLInputElement).value).toBe('20')
  fireEvent.pointerDown(document.body)
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(mounted).toHaveBeenCalledTimes(1)
  view.unmount()
  expect(stopped).toHaveBeenCalledTimes(1)
})
