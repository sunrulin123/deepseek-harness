# 社区 Discussion 与概览参考

[English](discussion.md) | 中文

## 摘要

[社区展示帖](https://github.com/deepseek-ai/deepseek-harness/discussions/9584)已由 sunrulin123 发布在官方仓库的 Show Your Plugins 分类。本文保留可复用的概览素材，并非该帖逐字副本，实际已发布文字以链接中的 Discussion 为准。[官方社区规则](https://github.com/deepseek-ai/deepseek-harness/discussions/1797)和 [Show Your Plugins 指南](https://github.com/deepseek-ai/deepseek-harness/discussions/2004)仍适用，包括每个项目只发一帖。

## 展示帖标题

DSH | Community Web UI | Built-in responsive Web client with separate Desktop visuals

## 项目介绍

DSH Community Web UI 是基于 DeepSeek Harness 的非官方社区源码版，将响应式 Web 展示集成到默认客户端构建，并保留官方 Desktop 视觉。用户无需额外的 UI 美化插件、浏览器扩展或手动 DOM 补丁。

任务栏分离“对话”“轨迹”导航、原生会话工具和“插件”菜单。原生 subagent、团队和后台任务组件保留已有数据与交互。Web 布局还覆盖手机阅读、代码块和输入，不替换 agent（智能体）运行时或任务调度器。

## 集成与证据

本版使用原有客户端组件、设计 Token、图标和 Slots registry。展示分组为显式声明，不根据扩展名称分类，也不读取私有 React 内部结构。Desktop 选择依据应用启动路径，不依赖 User-Agent 检测。

最新使用说明与证据见项目 [README](../../README.zh.md)、[安装指南](install.zh.md)、[使用指南](use.zh.md)和[验证记录](verification.zh.md)。复用介绍时，移动仿真、Android 真机、受控提供方测试和真实外部模型执行必须保留各自标记，截图也须对应实际测试环境。

## 致谢与反馈

感谢 [DeepSeek AI](https://github.com/deepseek-ai) 提供 DeepSeek Harness，感谢 [dsh-web](https://github.com/zhu1090093659/dsh-web) 贡献者提供原始远程 Web UI 与移动适配工作，也感谢 [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) 提供早期移动布局参考。[致谢](../../ACKNOWLEDGEMENTS.md)说明历史关系与代码复用区别。

本项目由个人独立维护，不代表 DeepSeek AI 或所引用作者的认可或背书。欢迎通过社区仓库的 [Issues](https://github.com/sunrulin123/deepseek-harness/issues) 反馈易用性和集成问题。

邮箱：2466441707@qq.com

QQ：2466441707

## 文案复用

已发布的源码预览为 [community-web-ui-v0.1.0-preview.1](https://github.com/sunrulin123/deepseek-harness/releases/tag/community-web-ui-v0.1.0-preview.1)。项目更新应沿用现有 Discussion，不另建重复展示帖。复用这些概览段落时，应保留当前链接和验证限制；发布不代表官方认可。
