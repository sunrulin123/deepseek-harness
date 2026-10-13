# DSH Community Web UI

[English](README.md) | 中文

本项目是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的非官方社区源码预览版；上游由 [DeepSeek AI](https://deepseek.com) 开发，由个人独立维护。项目将响应式 Web 界面纳入客户端源码，同时保留上游 Desktop 的视觉表现，不代表已获官方认可或已被上游合并。

## 概述

Web 设计将会话导航、原生会话工具和第三方扩展分组，改善手机阅读与输入，并继续使用 DSH 现有服务提供的任务状态。本次整合基于上游 `dsh-v0.2.0-rc.2` 源码。采用功能或平台支持结论前，请查看[验证记录](docs/community/verification.zh.md)。

## 目录

- [桌面端与 Web 端的界面区别](#desktop-and-web-ui-differences)
- [界面与功能](#interface-and-features)
- [界面截图](#screenshots)
- [安装与使用](#install-and-use)
- [参与开发](#contribute)
- [致谢与许可证](#acknowledgements-and-license)
- [联系与反馈](#contact-and-feedback)

<a id="desktop-and-web-ui-differences"></a>

## 桌面端与 Web 端的界面区别

| 客户端 | 目标视觉表现 | 分发方式 |
| --- | --- | --- |
| 官方 Windows Desktop | 上游图标、控件与布局 | 已安装的官方程序与本源码目录相互独立 |
| 社区 Web 桌面浏览器版 | 社区导航、任务栏与阅读布局 | 从本仓库 Web 客户端源码构建 |
| 社区 Web 移动浏览器版 | 同一套社区界面，控件按屏幕适配 | Web 服务向手机提供同一客户端 |

社区 Web 构建不要求额外安装 UI 美化插件、浏览器扩展或手动注入 CSS。DSH 原有 Cordis 模块和第三方插件支持仍是架构的一部分。仅安装官方 Desktop 程序并不会获得本社区 Web 版本。实现方式见[开发与隔离说明](docs/community/develop.zh.md)，实际验收范围见[验证记录](docs/community/verification.zh.md)。

<a id="interface-and-features"></a>

## 界面与功能

- 对话和轨迹导航与任务操作区分开。
- 子智能体、智能体团队和后台任务保留原有数据与操作；第三方任务栏扩展进入“插件”菜单。
- 自动化任务与后台任务保持区分，审批、计划、目标和工作流界面继续由原模块负责。
- 移动布局涵盖触摸控件、输入区、Markdown、代码块及视口变化；Memory 悬浮控件不属于本次改版。

[使用教程](docs/community/use.zh.md)说明各入口和计数语义。运行截图及其准确测试条件统一记录在[验证记录](docs/community/verification.zh.md)中；移动浏览器仿真不等于 Android 真机测试。

<a id="screenshots"></a>

## 界面截图

以下为隔离原生运行时中的社区 Web 实际界面，使用可公开的演示数据和受控 LLM adapter，没有发起外部模型请求。[验证图库](docs/community/verification.zh.md#screenshots)还包括暗色主题、运行中的任务、Subagent 和插件菜单。

![社区 Web 桌面浏览器，1440 × 900](docs/community/images/web-1440x900-light.png)

<details>
<summary>移动浏览器仿真 — 393 × 852</summary>

![社区 Web 移动浏览器仿真](docs/community/images/web-393x852-light.png)

</details>

这些图片不代表 Android 真机或已安装 Windows Desktop 已完成验收。

<a id="run"></a>

<a id="run-from-source"></a>

<a id="install-and-use"></a>

## 安装与使用

请按[社区版本安装教程](docs/community/install.zh.md)操作。该教程使用本仓库源码构建，不是另行发布的官方 npm 包。连接模型或让其他设备访问服务前，请阅读[安全说明](SAFETY.zh.md)。

上游资料仍可从[官方文档站](https://deepseek-harness.github.io/deepseek-harness/)查阅。[上游源码 README](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/README.md)介绍未经修改的项目。

<a id="contribute"></a>

## 参与开发

请先阅读[社区开发者文档](docs/community/develop.zh.md)，再查阅[上游架构](docs/architecture.zh.md)和[开发指南](docs/development.zh.md)。[上游整合提案](UPSTREAM_PROPOSAL.md)用于未来讨论，不代表官方维护者已经同意合并。[当前上游贡献政策](CONTRIBUTING.zh.md)暂不接受外部 pull request。

<a id="acknowledgements-and-license"></a>

## 致谢与许可证

感谢 DeepSeek AI 提供上游基础架构。[dsh-web](https://github.com/zhu1090093659/dsh-web) 和 [dsh-LAN](https://github.com/MrMu666/dsh-LAN) 的早期移动适配工作为本项目提供了设计参考。[致谢文件](ACKNOWLEDGEMENTS.md)区分这段开发来源与本源码版本实际包含的代码。

上游 [MIT 许可证](LICENSE)、原始版权声明及[第三方声明](THIRD_PARTY_NOTICES.md)继续适用。致谢不能替代许可证声明。官方品牌素材不表示官方认可本社区版本。

<a id="contact-and-feedback"></a>

## 联系与反馈

本项目由个人独立维护。公开技术问题请通过 [Issues](https://github.com/sunrulin123/deepseek-harness/issues) 反馈，并附上版本、视口、复现步骤和已脱敏截图。

邮箱：2466441707@qq.com

QQ：2466441707

## 开发备注

[社区仓库](https://github.com/sunrulin123/deepseek-harness) 使用 `community/default-web-ui` 维护源码预览版。本预览不含 `.exe` 安装包，也不宣称已完成 Android 真机或已安装 Desktop 验收。各平台结果和发布状态以验证记录为准。
