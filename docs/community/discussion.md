# Community Discussion draft

English | [中文](discussion.zh.md)

## Summary

This is an unpublished draft. Its project link, screenshots, and test claims must match the actual public release before posting. The [official community rules](https://github.com/deepseek-ai/deepseek-harness/discussions/1797) and [Show Your Plugins guidelines](https://github.com/deepseek-ai/deepseek-harness/discussions/2004) govern the final post, including the title format and one post per project.

## Suggested title

DSH | Community Web UI | Built-in responsive Web client with separate Desktop visuals

## Project introduction

DSH Community Web UI is an unofficial community source edition based on DeepSeek Harness. It integrates responsive Web presentation into the default client build while retaining the official Desktop presentation. Users do not need an additional UI beautification plugin, browser extension, or manual DOM patch.

The taskbar separates Conversation and Trajectory navigation, native session tools, and a Plugins menu. Native subagent, team, and background-job components keep their existing data and interactions. The Web layout also addresses mobile reading, code blocks, and composing. It does not replace the agent runtime or task scheduler.

## Integration and evidence

The edition uses the existing client components, design tokens, icons, and Slots registry. Presentation grouping is explicit; it does not classify extensions by their names or read private React internals. Desktop selection follows the application boot path, not User-Agent detection.

See the project's [README](../../README.md), [installation guide](install.md), [user guide](use.md), and [verification record](verification.md). The final Discussion must link those pages in the actual public fork and embed only the reviewed runtime screenshots. Mobile emulation, Android-device tests, controlled-provider tests, and real external-model execution must retain their separate labels.

## Thanks and feedback

Thank you to [DeepSeek AI](https://github.com/deepseek-ai) for DeepSeek Harness, to the [dsh-web](https://github.com/zhu1090093659/dsh-web) contributors for the original remote Web UI and mobile-adaptation work, and to [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) for the earlier mobile-layout reference. The [acknowledgements](../../ACKNOWLEDGEMENTS.md) explain the historical relationship and code-reuse distinction.

This project is independently maintained and does not imply endorsement by DeepSeek AI or the referenced authors. Feedback on usability and integration is welcome through the community repository's available Issues or Discussions.

Email: 2466441707@qq.com

QQ: 2466441707

## Dev Note

Before posting, confirm the signed-in GitHub identity, public fork and release URLs, category rules, and that no earlier post exists for this project. Replace relative repository links with the actual public URLs and add the reviewed screenshots. No GitHub post or Release is asserted by this draft.
