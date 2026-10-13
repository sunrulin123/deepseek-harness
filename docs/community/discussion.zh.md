# 社区 Discussion 草稿

[English](discussion.md) | 中文

## 摘要

本文尚未发布。发帖前，项目链接、截图和测试声明必须与实际公开版本一致。[官方社区规则](https://github.com/deepseek-ai/deepseek-harness/discussions/1797)和 [Show Your Plugins 指南](https://github.com/deepseek-ai/deepseek-harness/discussions/2004)约束最终帖子，包括标题格式和每个项目只发一帖。

## 建议标题

DSH | Community Web UI | Built-in responsive Web client with separate Desktop visuals

## 项目介绍

DSH Community Web UI 是基于 DeepSeek Harness 的非官方社区源码版，将响应式 Web 展示集成到默认客户端构建，并保留官方 Desktop 视觉。用户无需额外的 UI 美化插件、浏览器扩展或手动 DOM 补丁。

任务栏分离“对话”“轨迹”导航、原生会话工具和“插件”菜单。原生 subagent、团队和后台任务组件保留已有数据与交互。Web 布局还覆盖手机阅读、代码块和输入，不替换 agent（智能体）运行时或任务调度器。

## 集成与证据

本版使用原有客户端组件、设计 Token、图标和 Slots registry。展示分组为显式声明，不根据扩展名称分类，也不读取私有 React 内部结构。Desktop 选择依据应用启动路径，不依赖 User-Agent 检测。

详见项目 [README](../../README.zh.md)、[安装指南](install.zh.md)、[使用指南](use.zh.md)和[验证记录](verification.zh.md)。最终 Discussion 必须链接实际公开 fork 中的这些页面，且仅嵌入已审查的运行截图。移动仿真、Android 真机、受控提供方测试和真实外部模型执行必须保留各自标记。

## 致谢与反馈

感谢 [DeepSeek AI](https://github.com/deepseek-ai) 提供 DeepSeek Harness，感谢 [dsh-web](https://github.com/zhu1090093659/dsh-web) 贡献者提供原始远程 Web UI 与移动适配工作，也感谢 [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) 提供早期移动布局参考。[致谢](../../ACKNOWLEDGEMENTS.md)说明历史关系与代码复用区别。

本项目由个人独立维护，不代表 DeepSeek AI 或所引用作者的认可或背书。欢迎通过社区仓库的 [Issues](https://github.com/sunrulin123/deepseek-harness/issues) 反馈易用性和集成问题。

邮箱：2466441707@qq.com

QQ：2466441707

## 开发备注

发帖前，确认已登录的 GitHub 身份、公开 fork 和 Release URL、分类规则，以及本项目是否已有帖子。将仓库相对链接替换为实际公开 URL，并加入已审查截图。本文不声称已发布 GitHub 帖子或 Release。
