# Install the community Web edition

English | [中文](install.zh.md)

## Summary

This tutorial is for Windows users starting a separate source checkout. It does not replace the installed Desktop application or import its private profile. The [verification record](verification.md) identifies the commands and platforms that have been exercised for this community build.

## Contents

- [Prepare](#prepare)
- [Build and start](#build-and-start)
- [Use another device](#use-another-device)
- [Update and return to upstream](#update-and-return-to-upstream)
- [Troubleshooting](#troubleshooting)

<a id="prepare"></a>

## Prepare

The root [package.json](../../package.json) declares Node.js `^22.19.0 || >=24.0.0` and `pnpm@11.7.0`. Install Git and those compatible tools from their official distributors. The [upstream development guide](../development.md) owns additional build requirements. A model account is needed for actual model requests, not for inspecting the interface.

The community source branch is `community/default-web-ui` in [sunrulin123/deepseek-harness](https://github.com/sunrulin123/deepseek-harness); `master` tracks upstream. From a parent directory without an existing `DSH-Community-Web-UI` folder, use the branch-specific clone command below. Keep it separate from your installed DSH and retain your configuration backup.

```powershell
git clone --branch community/default-web-ui https://github.com/sunrulin123/deepseek-harness.git DSH-Community-Web-UI
Set-Location DSH-Community-Web-UI
```

This command requires the community branch to be present on GitHub; the [verification record](verification.md) records its publication status. If Git cannot find that branch, check the repository instead of substituting `master` and assuming it contains the UI changes. This is a source preview, not an `.exe` installer.

<a id="build-and-start"></a>

## Build and start

Run the following from this community checkout in a dedicated PowerShell window. Dependency installation, build, and this source launcher were exercised locally. Running the official `npx @deepseek-ai/dsh web` package does not launch the community source edition.

```powershell
pnpm install --frozen-lockfile
node node_modules/pnpm/bin/pnpm.cjs run build
$testRoot = Join-Path $env:TEMP ('dsh-community-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $testRoot | Out-Null
$env:DSH_HOME = Join-Path $testRoot 'home'
$env:DSH_AGENTS_HOME = Join-Path $testRoot 'agents'
$env:DSH_TELEMETRY_DISABLED = '1'
node node_modules/pnpm/bin/pnpm.cjs dsh web --patch apps/web/tests/pin-browse-picker.overlay.yml --no-open --port 0
```

The supplied overlay selects the existing in-browser directory picker for repeatable browser acceptance; it does not inject a UI theme. Keep `--patch` before `--no-open` and `--port`: those later options are handled by the Web app's parser. Port 0 asks the OS for a free local port, avoiding a separately running Desktop server.

Open the authenticated URL printed after `dsh web:` on the same computer. It contains a process credential: do not publish it in logs or screenshots. The verified flow returns a 303 redirect, sets the existing authentication cookie, and opens a clean URL showing New session. Refreshing that page retained access. This check did not select a workspace, run a model, or import existing sessions.

The fresh home isolates initial acceptance from personal data. Keep this PowerShell window for the test server; Ctrl+C stops that process, and closing the window discards its temporary environment overrides. Do not copy credentials, session stores, or paired-device files into the public repository.

<a id="use-another-device"></a>

## Use another device

The verified source launcher binds to `127.0.0.1`; its current [Web startup](../../packages/bundle/web-app/src/startup.ts) rejects `--host 0.0.0.0`. Opening the printed loopback URL on a phone reaches the phone itself, and replacing it with the computer's LAN address does not change the server binding. This edition therefore does not provide a verified one-command LAN launch.

A phone needs a separately configured authenticated forwarding or network deployment; review the [Web application networking reference](../../packages/bundle/web-app/README.md) and [safety notice](../../SAFETY.md) first. The built-in community UI does not promise a public relay, automatic pairing, or cross-origin credential transfer. The previous remote-access plugin's fixed-domain service is separate infrastructure; its earlier phone test results do not establish that this clean Web build contains that service.

For Android acceptance, open the configured address in Chrome, check the taskbar, open and close its menus, type an unsent multiline draft, rotate the screen, dismiss the keyboard, then refresh. Report the actual browser and device versions with the outcome.

<a id="update-and-return-to-upstream"></a>

## Update and return to upstream

Preserve local work and configuration before updating. Review the community release's upstream baseline and data-format notes; test a new checkout with a separate home before using existing data. Do not use a hard reset or overwrite another branch to update.

Returning to the official Desktop application does not require copying Web assets into its installation. Stop only your own test Web process and open the official application. Source or package downgrades are not a promise that a newer session format can be read by an older runtime; consult the [session-format documentation](../session-format-status.md).

<a id="troubleshooting"></a>

## Troubleshooting

| Symptom | Check |
| --- | --- |
| The interface looks unchanged | Confirm the checkout, build result, server port, and browser resource URLs |
| A phone cannot connect | Check network reachability, binding, firewall policy, and the actual authenticated URL |
| Authentication fails | Use the server's existing authentication flow; never disable authentication to pass a test |
| A menu is absent | Check the feature's native activation conditions in the [user guide](use.md) |
| A command fails | Keep its complete redacted error and compare the declared tool versions |

## Feedback

Email: 2466441707@qq.com. QQ: 2466441707. For public reports, use the repository's available Issues or Discussions and remove credentials, private paths, and chat contents from logs.

## Dev Note

The verification record separates publication, source build, isolated-profile startup, and device acceptance. Successful local build and startup do not establish LAN, Android-device, or public-network acceptance.
