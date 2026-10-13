# 开发社区 Web 客户端

[English](develop.md) | 中文

## 摘要

本文说明社区展示代码及其与 Windows Desktop 的隔离方式。先阅读[安装指南](install.zh.md)，修改组件前再阅读上游[架构](../architecture.zh.md)、[Web 客户端](../subsystems/web-client.zh.md)和 [Client Slots](../subsystems/slots.zh.md)参考。[验证记录](verification.zh.md)标明已经验证的行为与剩余发布检查。

## 目录

- [源码基准与范围](#source-baseline-and-scope)
- [桌面与浏览器选择](#desktop-and-browser-selection)
- [任务栏注册](#header-registration)
- [视觉组件](#visual-components)
- [构建与验证](#build-and-verify)
- [跟进上游变化](#track-upstream-changes)
- [安全贡献](#contribute-safely)

<a id="source-baseline-and-scope"></a>

## 源码基准与范围

源码基于上游 `dsh-v0.2.0-rc.2` 标签。单独安装的 Desktop 应用即使具有相同版本标签，也不代表源码或 bundle 内容相同。应分别核对源码标签、本地 diff 和构建资源哈希；版本标签本身不能标识一个社区构建。

本 checkout 在现有 Web 客户端中修改展示方式，保留 Cordis 组合、会话存储、鉴权、模型请求、后台任务生命周期和 subagent 执行。本项目不把早期完整远程插件 bundle 作为默认客户端分发。源码及许可区别见[致谢](../../ACKNOWLEDGEMENTS.md)。

<a id="desktop-and-browser-selection"></a>

## 桌面与浏览器选择

[apps/web/src/main.ts](../../apps/web/src/main.ts) 中的 Web 入口已经接收官方 preload 提供的 Desktop 启动桥接。社区展示通过入口设置的文档标记 `data-community-web-ui` 选择。Desktop 启动路径不得启用浏览器展示。该标记只控制展示，不授予权限，也不参与鉴权。

社区 CSS 使用该标记或显式传入的展示属性。修改共享组件时，保留无此标记的 Desktop 渲染路径。不要根据 User-Agent、origin 字符串或宽泛的客户端平台名 `web` 推断 Desktop。不要为修改 Web 组件而替换已签名的应用资源。

已安装的远程插件属于另一项部署。其 Desktop 视觉退出逻辑不属于本原生源码构建；构建此 checkout 不会将该退出逻辑安装到已有 Desktop 应用中。

<a id="header-registration"></a>

## 任务栏注册

[ConversationSession](../../packages/client/ui-conversation/src/client/skeleton/ConversationSession.tsx) 拥有唯一的 Header，分别渲染原生会话工具和 [HeaderPlugins](../../packages/client/ui-conversation/src/client/skeleton/HeaderPlugins.tsx)。各入口保留原组件、状态来源、作用域和交互。

共享 [Slots registry](../../packages/client/ui-slots/src/index.ts) 支持在列表条目中声明由父级定义的展示 `group`。[渲染器](../../packages/client/ui-renderer/src/client/scoped-slots.tsx) 在渲染前过滤该元数据。不传过滤条件的调用方保留原列表行为。Header 的分组属于展示分类，不代表包归属或授权声明。

| 注册项 | 社区界面的处理 |
| --- | --- |
| `conversation.session.header.actions`，`group: 'native'` | 页面标签旁的原生工具 |
| 同一 slot，`group: 'status'` | 不在社区 Header 中显示；原有模式配置仍可访问 |
| actions slot 中的其他条目 | 插件折叠入口，保留注册顺序和原条目行为 |
| `conversation.session.header.utilities` | 原工具行为，包括独立的 Schedule 目录 |
| Header corner 和 leading slots | 原导航所属组件及其操作 |

新的官方工具必须显式注册合适的展示分组。Header 无法推断未知入口是否属于官方。它不读取私有 React Fiber 字段，不根据 RAM 标签分类，不搬移 DOM 节点，也不创建重复任务记录。注册模块仍通过原有 Slots 生命周期负责注销。

[使用指南](use.zh.md#native-session-tools)说明计数语义。保留原 Jobs、subagent 目录、团队和 Schedule 数据源；视觉重新分组不能用一种计数代替另一种。

<a id="visual-components"></a>

## 视觉组件

使用 [ui-theme](../../packages/client/ui-theme/src/styles/base.css) 中已有的语义 `--dsw-*` Token 和 [ui-primitives](../../packages/client/ui-primitives/README.zh.md) 图标。新组件必须保留无障碍名称、焦点行为、菜单和原生错误状态。桌面与移动浏览器共享组件，由响应式 CSS 分配可用空间。

| 区域 | 源码所属位置 |
| --- | --- |
| 框架、侧栏与视口 | [AppFrame](../../packages/client/ui-layout/src/client/AppFrame.tsx) |
| Header 与会话间距 | [ui-conversation skeleton](../../packages/client/ui-conversation/src/client/skeleton/ConversationRoot.module.css) |
| 编辑器与主要操作 | [InputBar](../../packages/client/ui-conversation/src/client/skeleton/InputBar.tsx) |
| 权限选择 | [ui-permission-presets](../../packages/client/ui-permission-presets/src/client/PermissionSelect.tsx) |
| 模型选择 | [ui-model-selection ModelSelect](../../packages/client/ui-model-selection/src/client/ModelSelect.tsx) |
| 消息渲染 | [AssistantMarkdown](../../packages/client/ui-chat/src/client/chat/AssistantMarkdown.module.css) |
| 代码块 | [ui-primitives CodeBlock](../../packages/client/ui-primitives/src/markdown/CodeBlock.module.css) |

保留代码格式与独立横向滚动，保留窄屏侧栏与终端访问。键盘适配必须清理自身监听并保留草稿，不得拦截无关焦点方法。第三方 Memory 控件不在本项工作范围内。

<a id="build-and-verify"></a>

## 构建与验证

[安装指南](install.zh.md#build-and-start)维护经过验证的启动步骤。上游[测试指南](../testing.zh.md)说明单元、GUI、会话记录回放和真实 API 测试层级。局部修改使用所属组件测试，跨组件行为使用组装后的 Web 应用。公开截图必须来自运行中的构建，且使用可公开演示数据。

修改共享代码后，对比两种启动路径。检查桌面浏览器、360、393、412、430 CSS 像素的移动浏览器仿真、平板和桌面宽度、明暗主题、菜单输入和长内容。单独记录 Windows Desktop 与 Android 真机结果；bridge 模拟和浏览器仿真不能证明真机结果。

不要将受控提供方描述为外部模型。验证运行恢复时，对比重连前后的原会话与 job 标识和输出；不要创建替代任务来获得通过界面。使用隔离数据目录，仅停止测试自行创建的进程和任务。

<a id="track-upstream-changes"></a>

## 跟进上游变化

整合上游版本前，在独立分支或 checkout 中与本版对比。共同复核 Desktop 启动、Slots 注册和渲染、相关 UI 组件与数据格式兼容性。本地配置和凭据留在 Git 外，解决冲突前保留当前 worktree。

Slot 类型冲突需要复核其提供方、消费方、测试和所属子系统文档。文本合并成功不代表兼容。社区[上游提案](../../UPSTREAM_PROPOSAL.md)说明拟议的审阅范围；上游是否接受提交，由官方贡献政策决定。

<a id="contribute-safely"></a>

## 安全贡献

报告可复现问题时，附上源码基准、视口、主题和脱敏证据。除非另一项变更明确授权运行时行为，否则贡献应集中于展示。保留上游许可，在实际复用位置说明复制代码。执行 [AGENTS.md](../../AGENTS.md) 要求的仓库检查，只报告已执行的结果。

## 开发备注

发布依赖完整验证记录、已审查截图、确认的 GitHub 身份和最终署名审查。不要根据本文架构说明推断版本已经可以发布。
