# 安装社区 Web 版本

[English](install.md) | 中文

## 概述

本教程面向准备使用独立源码目录的 Windows 用户，不替换已安装的 Desktop 程序，也不导入其私人配置。[验证记录](verification.zh.md)列明本社区构建实际执行过的命令和平台。

## 目录

- [环境准备](#prepare)
- [构建与启动](#build-and-start)
- [其他设备访问](#use-another-device)
- [更新与返回上游](#update-and-return-to-upstream)
- [故障排查](#troubleshooting)

<a id="prepare"></a>

## 环境准备

根目录 [package.json](../../package.json) 声明 Node.js `^22.19.0 || >=24.0.0` 和 `pnpm@11.7.0`。请从各工具官方渠道安装 Git 与兼容版本。[上游开发指南](../development.zh.md)负责说明其他构建条件。实际请求模型需要模型账号，单纯查看界面不需要发起模型请求。

[sunrulin123/deepseek-harness](https://github.com/sunrulin123/deepseek-harness) 的社区源码分支为 `community/default-web-ui`，`master` 跟随上游。在尚无 `DSH-Community-Web-UI` 文件夹的上级目录中执行以下指定分支的克隆命令。源码目录应与已安装 DSH 分开，并保留配置备份。

```powershell
git clone --branch community/default-web-ui https://github.com/sunrulin123/deepseek-harness.git DSH-Community-Web-UI
Set-Location DSH-Community-Web-UI
```

此命令要求 GitHub 上已存在社区分支，其发布状态见[验证记录](verification.zh.md)。若 Git 找不到该分支，应核对仓库，不要改用 `master` 后假定其中已有 UI 修改。本项目提供源码预览，不是 `.exe` 安装包。

<a id="build-and-start"></a>

## 构建与启动

在专用 PowerShell 窗口中，进入本社区源码目录后执行以下步骤。依赖安装、构建和这条源码启动路径均已在本机执行。运行官方 `npx @deepseek-ai/dsh web` 包不会启动社区源码版本。

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

随仓库提供的覆盖配置选用现有浏览器内目录选择器，以便重复执行浏览器验收；它不注入 UI 主题。`--patch` 必须位于 `--no-open` 和 `--port` 之前，后两项由 Web 应用参数解析器处理。端口 0 让系统选择空闲本地端口，避免访问另行运行的 Desktop 服务。

在同一台电脑上打开控制台 `dsh web:` 后的鉴权地址。该地址含进程凭据，不要公开到日志或截图中。已验证流程返回 303 跳转，设置现有鉴权 Cookie，并进入不带凭据参数、显示 New session 的页面；刷新后仍可访问。该检查没有选择工作区、调用模型或导入已有会话。

独立数据目录将首次验收与私人数据分开。保留此 PowerShell 窗口运行测试服务；Ctrl+C 停止该进程，关闭窗口会结束临时环境覆盖。不要把凭据、会话存储或配对设备文件复制到公开仓库。

<a id="use-another-device"></a>

## 其他设备访问

已验证的源码启动方式绑定 `127.0.0.1`；当前 [Web 启动实现](../../packages/bundle/web-app/src/startup.ts)拒绝 `--host 0.0.0.0`。手机打开控制台回环地址时访问的是手机自身，把地址换成电脑局域网 IP 也不会改变服务绑定。本版因此没有已经验证的一键局域网启动方式。

手机需要单独配置的鉴权转发或网络部署；应先阅读 [Web 应用网络说明](../../packages/bundle/web-app/README.zh.md)及[安全说明](../../SAFETY.zh.md)。内置社区 UI 不承诺包含公网中继、自动配对或跨域凭据转移。此前远程访问插件的固定域名服务属于独立基础设施，其旧版手机测试结果不能证明本次干净 Web 构建包含该服务。

Android 验收时，在 Chrome 打开配置好的地址，检查任务栏，展开并关闭菜单，输入未发送的多行草稿，旋转屏幕、收起键盘，再刷新页面。反馈时同时记录浏览器和设备实际版本。

<a id="update-and-return-to-upstream"></a>

## 更新与返回上游

更新前保留本地工作和配置。阅读社区版本的上游基准和数据格式说明；接入已有数据前，先用独立数据目录测试新源码目录。不要通过硬重置或覆盖其他分支来更新。

返回官方 Desktop 程序不需要将 Web 资源复制进它的安装目录。仅停止自己启动的测试 Web 进程，然后打开官方程序。源码或包降级不意味着旧运行时能够读取新版会话格式，请查阅[会话格式说明](../session-format-status.zh.md)。

<a id="troubleshooting"></a>

## 故障排查

| 现象 | 检查内容 |
| --- | --- |
| 界面没有变化 | 核对源码目录、构建结果、服务端口和浏览器资源地址 |
| 手机无法连接 | 核对网络连通性、监听地址、防火墙策略和实际鉴权地址 |
| 鉴权失败 | 使用服务已有鉴权流程，不通过关闭鉴权让测试通过 |
| 某入口未出现 | 按[使用教程](use.zh.md)核对该功能原有出现条件 |
| 命令失败 | 保存完整脱敏错误，并核对声明的工具版本 |

## 反馈

邮箱：2466441707@qq.com。QQ：2466441707。公开问题请通过仓库可用的 Issues 或 Discussions 反馈，日志中移除凭据、私人路径和聊天内容。

## 开发备注

验证记录分别说明发布、源码构建、独立配置启动和设备验收。本机构建与启动成功不代表局域网、Android 真机或公网链路已通过。
