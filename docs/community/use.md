# Use the community Web interface

English | [中文](use.zh.md)

## Summary

This reference explains navigation and task counts. It does not introduce new task execution, approval, or retry controls. Platform-specific acceptance results are in the [verification record](verification.md).

## Contents

- [Navigate a session](#navigate-a-session)
- [Native session tools](#native-session-tools)
- [Plugins and modes](#plugins-and-modes)
- [Read and compose](#read-and-compose)
- [Connection and recovery](#connection-and-recovery)

<a id="navigate-a-session"></a>

## Navigate a session

Open an existing session from the sidebar. Conversation displays its messages; Trajectory displays its execution history. A mobile title occupies a separate row so a long title does not consume all taskbar space. Use the existing sidebar control to return to the session list.

<a id="native-session-tools"></a>

## Native session tools

| Entry | Meaning | What to inspect |
| --- | --- | --- |
| Subagents | Direct child sessions, including ended children; not a running-task total | Open the native directory, inspect state, and navigate to a child |
| Agent team | The enabled experimental team's native panel | Inspect members and the shared board without creating another board |
| Background jobs | Native jobs attached to the current session | Open the existing list and inspect output; active counts include running and stopping |
| Schedule | Scheduled follow-ups and reminders, separate from Jobs | Open the original catalog when its native condition makes it visible |

Completed, failed, and killed jobs are not active jobs. Empty directories follow the upstream feature's display policy. A changing count does not imply that the community UI has started, stopped, or recreated a task.

<details>
<summary>See the native subagent and background-job panels</summary>

These are actual native panels in the isolated runtime with controlled model responses, not an external-model test.

![Subagent directory while a child runs](images/subagent-running.png)

![Background-job output while the job runs](images/background-job-running.png)

</details>

Approvals remain in their original interaction UI. Read the requested action before deciding; the taskbar does not automatically approve it. Plan, goal, and workflow controls remain in their existing composer or conversation areas.

<a id="plugins-and-modes"></a>

## Plugins and modes

The Plugins menu groups third-party header contributions while native session tools retain their own entries. A RAM monitor appears only when its plugin is installed and registered; it is not required to obtain the community layout.

<details>
<summary>See the Plugins panel</summary>

The demonstration registers two test contributions. It does not show or validate RAM telemetry.

![Expanded Plugins panel with test contributions](images/plugins-expanded.png)

</details>

The selected mode is not a persistent taskbar label. Use the existing new-session or settings controls for mode configuration. Hiding a label does not change an existing session's composition.

<a id="read-and-compose"></a>

## Read and compose

Read paragraphs, lists, inline code, and code blocks in the conversation. Long code keeps its formatting and separate horizontal scrolling; a long path must not widen the whole page.

The composer keeps attachment, permission, model, and send controls. Permission and model menus retain their original effects. On phones, check multiline input and the send button after opening or closing the keyboard. A compact visual icon still needs a usable touch area.

<a id="connection-and-recovery"></a>

## Connection and recovery

Normal navigation and refresh use the existing DSH session and stream mechanisms. A recovered indicator alone does not prove that every output item was restored. Native Jobs are in-memory execution records; browser reconnection does not promise recovery after restarting the Host process.

If authentication expires, use the existing login or pairing flow for the server you are using. Do not resend a message merely to make a running task appear again. Record the session and task identifiers in a private diagnostic report when investigating duplication.

## Feedback

Email: 2466441707@qq.com. QQ: 2466441707. Submit public reports through [Issues](https://github.com/sunrulin123/deepseek-harness/issues) with the entry name, viewport, theme, and a redacted screenshot; do not post personal conversations or credentials.

## Dev Note

The described interaction model is inherited from the existing implementation and upstream feature owners. The new source edition's actual runtime verification remains recorded separately.
