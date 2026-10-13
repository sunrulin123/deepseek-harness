# 社区版验证记录

[English](verification.md) | 中文

## 摘要

本文区分原生源码版与早期已安装插件部署。先前插件测试不能验证新源码构建。下表记录本版实际执行过的检查，并保留各项结论的限制。

## 环境与结果标记

源码基于公开 `dsh-v0.2.0-rc.2` 标签。本地依赖准备使用 Windows 和 Node.js `24.21.0`。首次冻结安装没有改动锁文件；后续侧栏无障碍修复新增 ui-layout 对现有工作区 ui-primitives 的依赖及对应锁文件链接，没有新增外部包或变更版本。根 manifest（元数据清单）指定 `pnpm@11.7.0`；依赖准备最初使用已安装的 `pnpm@11.25.0`。单独安装的 Desktop 应用报告相同 DSH 版本但不同构建版本，不能作为源码相同的证据。

`PASS` 表示实际执行并通过所述检查；`FAIL` 表示执行后失败；`BLOCKED` 表示缺少前置条件；`NOT TESTED` 表示尚未记录结果；`N/A` 表示实现不提供该行为。源码检查、单元或 Mock 测试、组装后的运行时测试、浏览器仿真和真机测试属于不同证据类型。

## 验证矩阵

| 检查 | 证据类型 | 结果 | 范围 |
| --- | --- | --- | --- |
| 冻结依赖安装 | 本地命令 | PASS | 首次冻结安装通过；后续内部工作区链接已使用 pnpm 11.7.0 通过 `pnpm install --frozen-lockfile --offline --ignore-scripts` |
| 最终 Web 构建 | 本地构建命令 | PASS | `node node_modules/pnpm/bin/pnpm.cjs run build` 已在侧栏焦点修复及生成目录同步后完成；打包器报告了大体积 chunk 警告 |
| 源码 CLI 启动、鉴权与实际资源 | 构建后应用与本机浏览器 | PASS | 独立空数据目录；原生 303 与 Cookie 流程；鉴权后刷新；4 项 Vite 资源和 4 个原生客户端模块与测试构建一致；未请求模型 |
| Web/Desktop 展示隔离 | 浏览器与 Windows Desktop | NOT TESTED | 源码与组件检查不代表已安装 Desktop 验收；用户已要求暂不重启 DSH |
| 启动、框架与代码块回归 | 单元与组件测试 | PASS | 专项套件已通过，包括侧栏焦点修复后的 49 项 AppFrame 测试；不代表完整 GUI 或真机验收通过 |
| 变更源码 lint | 静态分析 | PASS | 变更及新增源码通过现有 lint 检查 |
| 官方包 hygiene | 仓库检查 | FAIL | 15/18 通过；剩余为未改动上游 fixture 的旧名称、Windows checkout 符号链接表示及 NodeNext 符号链接权限错误 |
| 使用等价 Windows junction 的 NodeNext | 隔离诊断变体 | PASS | 325 个工作区声明 API 全部编译通过，326 个链接已验证并移除；不代表官方符号链接检查通过 |
| 完整文档检查 | 文档与生成目录 | FAIL | 首次聚合检查 40/43 通过；两项过期目录已重新生成并通过单项复测；Windows 符号链接测试仍受权限阻塞（EPERM） |
| 完整 GUI 套件 | 组件测试 | FAIL | 本次记录为 9,522 项通过、2 项失败；焦点环和后续 Header 修正已通过最新 39 项专项复测，交付物符号链接检查仍受 Windows EPERM 阻塞 |
| Header 分组及原有交互 | 使用真实 SlotCore 的组件测试 | PASS | 6 个文件的专项执行共 132 项测试通过；不代表模型执行或构建后浏览器验收通过 |
| 后台任务创建、运行、输出与完成 | 真实原生运行时与浏览器 | PASS | 原生任务产生输出、完成，并在刷新后保留相同标识 |
| Subagent 执行及结果返回 | 使用受控 LLM adapter 的真实原生运行时 | PASS | 原生子会话执行并返回结果；外部模型请求为 0 次 |
| 并行任务与子会话、刷新及计数 | 真实原生运行时与浏览器 | PASS | 两者均保留原有标识，完成结果已返回，重复记录为 0 |
| 团队成员及共享任务板 | 隔离测试配置中的原生面板 | PASS | 原面板可打开；不代表完成多模型团队执行 |
| Schedule 提醒及审批 | 原生执行 | NOT TESTED | 本次检查没有创建提醒或审批执行 |
| 多个扩展入口及禁用、重新启用 | 真实测试插件注册与浏览器 | PASS | 原注册及交互与原生入口分开，禁用 bundle 后入口移除 |
| 第三方 RAM 插件 | 已安装插件联调 | NOT TESTED | 源码测试没有加载早期远程或 RAM 插件 |
| 七种视口布局与菜单 | 桌面浏览器及移动仿真 | PASS | 360、393、412、430、768、1280、1440 px；亮暗主题、菜单边界、模型与权限控件，页面无横向溢出 |
| 移动侧栏键盘焦点 | 浏览器仿真 | PASS | Tab 保持在侧栏内，Escape 关闭后焦点回到原打开控件 |
| Android Chrome | 真机 | NOT TESTED | 先前插件验收不能验证本源码版 |
| 公网 Gateway 或移动网络切换 | 部署链路 | NOT TESTED | 本 UI 集成不提供公网中继 |
| 公开 fork | GitHub UI 与公开 API | PASS | [sunrulin123/deepseek-harness](https://github.com/sunrulin123/deepseek-harness) 已作为官方仓库的公开 fork 创建 |
| 社区源码分支 | GitHub 发布 | PASS | `community/default-web-ui` 已公开并设为默认分支，发布源码树与已审阅的本地源码树一致 |
| 源码预览 Release | GitHub 公开 API | PASS | [community-web-ui-v0.1.0-preview.1](https://github.com/sunrulin123/deepseek-harness/releases/tag/community-web-ui-v0.1.0-preview.1) 已发布为 prerelease，不是草稿 |
| 上游社区展示帖 | 已发布 GitHub Discussion | PASS | [Discussion #9584](https://github.com/deepseek-ai/deepseek-harness/discussions/9584) 已由 sunrulin123 发布在 Show Your Plugins 分类 |

[Discussion 概览参考](discussion.zh.md)链接已发布展示帖，并保留可复用的介绍素材。发布不改变上文记录的平台和执行限制。

## 已执行检查

上述构建命令以退出码 0 完成。完整 GUI 测试使用 `pnpm run test:gui --maxWorkers=2`，记录为 593 个文件通过、2 个文件失败、3 个文件跳过；其中跳过的 6 项测试未计为通过。焦点环失败和后续 Header 调整已通过单独的 4 文件、39 项复测，尚未记录完整 GUI 重新执行结果。

`node node_modules/pnpm/bin/pnpm.cjs run doc-sync` 已完成，43 项中 40 项通过。文档类型检查、文档网站构建、相对链接、段落换行和双语配对均通过。`verify-cordis-inspect-catalog` 与 `verify-client-catalog` 最初报告生成文件过期，重新生成后两项均通过。网站测试组记录为 150 项通过、1 项符号链接权限失败。没有为获取通过结果而调整检查阈值。加入八张截图后，`pnpm run docs:build` 再次通过，验证了 4,984 项内部锚点引用；现有 esbuild target 警告未导致失败。

源码 CLI 还使用[安装指南中的独立数据目录步骤](install.zh.md#build-and-start)完成启动。浏览器进入 New session，存在社区标记、不存在 Desktop bridge，且没有记录到页面异常。4 项 Vite 资源哈希与本地文件相同；对话、Subagent、Jobs 和 renderer 模块的可执行内容与官方合并响应一致，比较时区分了官方重写的 source-map 尾注。测试只停止了自身服务。

官方 hygiene 有三项失败。Vendor rescope 命中了三个未改动上游 fixture 中的旧事件域名称。Git 中模式为 120000 的符号链接因 `core.symlinks=false` 被检出为路径文本，其 Loader 文件不能解析为 YAML。官方 NodeNext 检查在 Windows 上创建目录符号链接时出现 EPERM，编译器尚未启动。另用自有临时 consumer、等价 junction 和未改动的编译选项，成功编译了 325 个声明 API；全部 326 个 junction 目标已核对并清理。这项诊断不把官方 hygiene 结果改为 PASS。

## 原生运行时验收

[community-native-runtime.e2e.ts](../../apps/web/tests/community-native-runtime.e2e.ts) 的四个用例已通过，使用真实配置、Host 服务、浏览器传输、原生进程任务和受控 LLM adapter。父会话为 `session-460878b8-b749-486d-8e3e-29e717fd654f`，子会话为 `23d39a24-f619-40dd-bf99-fe0abe355f62`，任务为 `community-check-1`。刷新后这些标识保持不变，两项执行均完成，没有出现重复记录。adapter 处理了 1 次子会话调用和 2 次父会话调用，没有发起外部模型请求。

同一浏览器验收还检查了原有团队面板与共享任务板、多个测试扩展注册、移动侧栏焦点及七种视口尺寸。它不代表完成付费模型调用、多模型团队运行、真实 RAM 遥测、Android 硬件或公网 Gateway 验收。

<a id="screenshots"></a>

## 截图

以下已审阅图片来自运行中的原生测试配置，使用可公开的演示文字和受控模型响应，不含私人对话或凭据。手机图片为浏览器仿真，不是 Android 真机截图；宽屏图片为 Web，不是已安装的 Windows Desktop 应用。

<details>
<summary>桌面浏览器 — 1440 × 900，亮色与暗色</summary>

![社区 Web 桌面浏览器，亮色](images/web-1440x900-light.png)

![社区 Web 桌面浏览器，暗色](images/web-1440x900-dark.png)

</details>

<details>
<summary>移动浏览器仿真 — 393 × 852，亮色与暗色</summary>

![社区 Web 移动仿真，亮色](images/web-393x852-light.png)

![社区 Web 移动仿真，暗色](images/web-393x852-dark.png)

</details>

<details>
<summary>原生控件与扩展菜单 — 1680 × 1000，亮色</summary>

插件面板包含两个测试扩展，并非 RAM 监控器。

![两个已注册的插件扩展](images/plugins-expanded.png)

子会话与任务图片展示真实原生执行，使用上文说明的受控 adapter。

![原生 Subagent 运行中](images/subagent-running.png)

![原生后台任务运行中及输出](images/background-job-running.png)

![原生任务与 Subagent 同时运行](images/parallel-native-tools.png)

</details>

## 已知限制

- 原生 Jobs 属于进程内存状态；浏览器重连不承诺 Host 重启后恢复。
- 源码版本与已安装版本标签一致，不代表 bundle 内容相同。
- 新官方 Header 入口需要显式展示分组；未知入口不会自动被识别为官方。
- UI 标记不改变授权、配对、网络或模型配置。
- 组件测试不意味着已完成外部模型测试、真机验证或公网部署。
