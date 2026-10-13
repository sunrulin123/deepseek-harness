# Community Discussion and overview reference

English | [中文](discussion.zh.md)

## Summary

The [community showcase](https://github.com/deepseek-ai/deepseek-harness/discussions/9584) was published by sunrulin123 in the official repository's Show Your Plugins category. This page retains reusable overview material, not a verbatim copy of that post; the linked Discussion is the authoritative published text. The [official community rules](https://github.com/deepseek-ai/deepseek-harness/discussions/1797) and [Show Your Plugins guidelines](https://github.com/deepseek-ai/deepseek-harness/discussions/2004) apply, including one post per project.

## Announcement title

DSH | Community Web UI | Built-in responsive Web client with separate Desktop visuals

## Project introduction

DSH Community Web UI is an unofficial community source edition based on DeepSeek Harness. It integrates responsive Web presentation into the default client build while retaining the official Desktop presentation. Users do not need an additional UI beautification plugin, browser extension, or manual DOM patch.

The taskbar separates Conversation and Trajectory navigation, native session tools, and a Plugins menu. Native subagent, team, and background-job components keep their existing data and interactions. The Web layout also addresses mobile reading, code blocks, and composing. It does not replace the agent runtime or task scheduler.

## Integration and evidence

The edition uses the existing client components, design tokens, icons, and Slots registry. Presentation grouping is explicit; it does not classify extensions by their names or read private React internals. Desktop selection follows the application boot path, not User-Agent detection.

See the project's [README](../../README.md), [installation guide](install.md), [user guide](use.md), and [verification record](verification.md) for maintained instructions and evidence. Reused descriptions must keep mobile emulation, Android-device tests, controlled-provider tests, and real external-model execution separately labeled, with screenshots drawn from their actual test contexts.

## Thanks and feedback

Thank you to [DeepSeek AI](https://github.com/deepseek-ai) for DeepSeek Harness, to the [dsh-web](https://github.com/zhu1090093659/dsh-web) contributors for the original remote Web UI and mobile-adaptation work, and to [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) for the earlier mobile-layout reference. The [acknowledgements](../../ACKNOWLEDGEMENTS.md) explain the historical relationship and code-reuse distinction.

This project is independently maintained and does not imply endorsement by DeepSeek AI or the referenced authors. Feedback on usability and integration is welcome through the community repository's [Issues](https://github.com/sunrulin123/deepseek-harness/issues).

Email: 2466441707@qq.com

QQ: 2466441707

## Reuse

The published source preview is [community-web-ui-v0.1.0-preview.1](https://github.com/sunrulin123/deepseek-harness/releases/tag/community-web-ui-v0.1.0-preview.1). Use the existing Discussion for project updates rather than creating another showcase post. Reuse these overview paragraphs only with current links and verification limits; publication does not establish official endorsement.
