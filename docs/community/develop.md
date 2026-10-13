# Develop the community Web client

English | [中文](develop.zh.md)

## Summary

This reference describes the community presentation code and its separation from Windows Desktop. Start with the [installation guide](install.md), then read the upstream [architecture](../architecture.md), [Web client](../subsystems/web-client.md), and [Client Slots](../subsystems/slots.md) references before changing a component. The [verification record](verification.md) identifies exercised behavior and remaining release checks.

## Contents

- [Source baseline and scope](#source-baseline-and-scope)
- [Desktop and browser selection](#desktop-and-browser-selection)
- [Header registration](#header-registration)
- [Visual components](#visual-components)
- [Build and verify](#build-and-verify)
- [Track upstream changes](#track-upstream-changes)
- [Contribute safely](#contribute-safely)

<a id="source-baseline-and-scope"></a>

## Source baseline and scope

The source baseline is the upstream `dsh-v0.2.0-rc.2` tag. A separately installed Desktop application can share that version label without having identical source or bundle contents. Review the source tag, local diff, and built resource hashes separately; a version label alone does not identify a community build.

This checkout changes presentation in the existing Web client. It retains the Cordis composition, session stores, authentication, model requests, job lifecycle, and subagent execution. It does not distribute the earlier complete remote-plugin bundle as the default client. See [Acknowledgements](../../ACKNOWLEDGEMENTS.md) for the source and licensing distinction.

<a id="desktop-and-browser-selection"></a>

## Desktop and browser selection

The Web entry in [apps/web/src/main.ts](../../apps/web/src/main.ts) already receives the Desktop boot bridge from the official preload. The community presentation uses a document marker, `data-community-web-ui`, selected at that entry. Browser presentation must not activate on the Desktop boot path. This marker controls presentation only; it grants no permission and does not participate in authentication.

Community CSS uses that marker or explicitly supplied presentation props. Preserve the unmarked Desktop render path when changing a shared component. Do not infer Desktop from User-Agent, an origin string, or the broad client platform name `web`. Do not replace signed application resources to change a Web component.

The installed remote plugin is a separate deployment. Its Desktop visual opt-out is not part of this native source build, and building this checkout does not install that opt-out into an existing Desktop application.

<a id="header-registration"></a>

## Header registration

[ConversationSession](../../packages/client/ui-conversation/src/client/skeleton/ConversationSession.tsx) owns one header. It renders native session tools separately from [HeaderPlugins](../../packages/client/ui-conversation/src/client/skeleton/HeaderPlugins.tsx). Entries keep their original component, state source, scope, and interactions.

The shared [Slots registry](../../packages/client/ui-slots/src/index.ts) supports a parent-defined presentation `group` on list entries. Its [renderer](../../packages/client/ui-renderer/src/client/scoped-slots.tsx) filters that metadata before rendering. A caller that supplies no filter retains the existing list behavior. The header groups are presentation categories, not package ownership or authorization claims.

| Contribution | Community treatment |
| --- | --- |
| `conversation.session.header.actions`, `group: 'native'` | Native tools beside the page tabs |
| The same slot, `group: 'status'` | Omitted from the community header; the existing mode configuration remains available |
| Other entries in the actions slot | Plugins disclosure, preserving registration order and native entry behavior |
| `conversation.session.header.utilities` | Existing utility behavior, including the distinct Schedule catalog |
| Header corner and leading slots | Existing navigation owners and their actions |

New official tools must explicitly register the appropriate presentation group. The header cannot infer that an unknown entry is official. It does not inspect private React Fiber fields, classify a RAM label, move DOM nodes, or create duplicate task records. Registration disposal remains the registering module's responsibility through the existing Slots lifecycle.

The [user guide](use.md#native-session-tools) owns count semantics. Keep the original Jobs, subagent catalog, team, and Schedule sources; a visual regrouping must not substitute one count for another.

<a id="visual-components"></a>

## Visual components

Use the existing semantic `--dsw-*` tokens in [ui-theme](../../packages/client/ui-theme/src/styles/base.css) and the existing [ui-primitives](../../packages/client/ui-primitives/README.md) icons. A new component must retain accessible names, focus behavior, menus, and native error states. Desktop and mobile browser layouts share these components; responsive CSS controls their available space.

| Area | Source owner |
| --- | --- |
| Frame, sidebars, and viewport | [AppFrame](../../packages/client/ui-layout/src/client/AppFrame.tsx) |
| Header and conversation spacing | [ui-conversation skeleton](../../packages/client/ui-conversation/src/client/skeleton/ConversationRoot.module.css) |
| Editor and primary controls | [InputBar](../../packages/client/ui-conversation/src/client/skeleton/InputBar.tsx) |
| Permission selector | [ui-permission-presets](../../packages/client/ui-permission-presets/src/client/PermissionSelect.tsx) |
| Model selector | [ui-model-selection ModelSelect](../../packages/client/ui-model-selection/src/client/ModelSelect.tsx) |
| Message rendering | [AssistantMarkdown](../../packages/client/ui-chat/src/client/chat/AssistantMarkdown.module.css) |
| Code blocks | [ui-primitives CodeBlock](../../packages/client/ui-primitives/src/markdown/CodeBlock.module.css) |

Keep code formatting and independent horizontal scrolling. Preserve sidebars and terminal access on narrow screens. Keyboard adaptation must clean up its own listeners and retain drafts; it must not intercept unrelated focus methods. The third-party Memory widget remains outside this work.

<a id="build-and-verify"></a>

## Build and verify

The [installation guide](install.md#build-and-start) owns the verified startup sequence. The upstream [testing guide](../testing.md) explains unit, GUI, recorded-session, and real-API test layers. Use the owning component tests for a local change and the assembled Web application for cross-component behavior. Public screenshots must come from a running build with safe demonstration data.

Compare both boot paths after changing shared code. Check a desktop browser, mobile browser emulation at 360, 393, 412, and 430 CSS pixels, tablet and desktop widths, light and dark themes, menu input, and long content. Separately record actual Windows Desktop and Android-device results; bridge simulation and browser emulation cannot establish those results.

Do not describe a controlled provider as an external model. For runtime recovery, compare the original session and job identifiers and output before and after reconnection; do not create a replacement task to obtain a passing screen. Use an isolated home and stop only processes and tasks created by your test.

<a id="track-upstream-changes"></a>

## Track upstream changes

Compare the selected upstream release with this edition in a separate branch or checkout before integrating it. Review Desktop boot, Slots registration and rendering, the affected UI components, and data-format compatibility together. Keep local configuration and credentials outside Git, and preserve the current worktree before resolving conflicts.

A conflict in a Slot type requires reviewing its providers, consumers, tests, and owning subsystem documentation. A successful text merge does not establish compatibility. The community [upstream proposal](../../UPSTREAM_PROPOSAL.md) describes the intended review scope; the official contribution policy determines whether an upstream submission is allowed.

<a id="contribute-safely"></a>

## Contribute safely

Report a reproducible defect with the source baseline, viewport, theme, and redacted evidence. Keep a contribution focused on presentation unless a separate change explicitly authorizes runtime behavior. Preserve upstream licenses and document any copied code at its actual source location. Run the repository checks required by [AGENTS.md](../../AGENTS.md) and report only executed results.

## Dev Note

Publication depends on the completed verification record, reviewed screenshots, confirmed GitHub identity, and final attribution review. Do not infer release readiness from this architectural reference.
