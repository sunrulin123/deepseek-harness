# 致谢

[English](ACKNOWLEDGEMENTS.md) | 中文

## 上游项目

[DeepSeek AI](https://github.com/deepseek-ai) 开发了 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)，包括智能体运行时、原生 UI、Client Modules、Slots 和官方图标。本版本保留上游 [MIT 许可证](LICENSE)、作者历史与[第三方声明](THIRD_PARTY_NOTICES.md)。社区维护者不将上游代码标记为个人原创。

## 特别感谢与原始设计参考

特别感谢 GitHub 账号 [zhu1090093659](https://github.com/zhu1090093659) 维护的 [dsh-web](https://github.com/zhu1090093659/dsh-web) 项目及其贡献者。早期本地补丁项目使用了其中 `@linxin666/dsh-remote-web-ui` 包提供的远程 Web 界面与移动适配实现。其 npm 维护账号为 `linxin666`，包中未另列个人作者姓名。相关移动代码历史还包含 [Aa728848](https://github.com/Aa728848) 的贡献。

该插件注明 [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) 是其移动布局的早期参考。dsh-LAN 包声明采用 MIT 许可，其竖屏适配、触摸控件、安全区处理和侧栏入口为后续插件工作提供了参考。感谢 [MrMu666](https://github.com/MrMu666) 及参与这些工作的社区贡献者。

## 代码与素材署名

早期本地补丁修改了完整的 `dsh-remote-web-ui@0.4.5` 客户端 bundle，属于 Apache-2.0 代码的派生作品，而非仅参考设计。该补丁与本源码版相互独立。本 checkout 修改已有上游 React 组件及 CSS Modules，增加列表 slot 展示分组，并导入已有上游图标，不包含旧完整客户端 bundle、移动适配 DOM 补丁及其内联 QR 实现。

官方图标仍属于上游素材，不作为本社区原创标志。若贡献引入复制的插件实现，相关文件必须保留适用的 Apache 许可证及修改声明；保留的内联依赖仍须保留各自许可证。一般致谢不能替代这些要求。

## 社区贡献者

感谢反馈窄屏布局问题并参与 Android 浏览器验收的用户。报告区分此前已安装插件的测试结果与本源码版本的测试。本项目为非官方项目，不代表 DeepSeek AI 或所引用项目作者的认可。

## 开发备注

公开发布前仍须依据最终源码差异复核代码复用和随附声明。已审查的 dsh-LAN 版本声明 MIT，但未包含独立许可证文件或具名版权声明；在署名问题解决前，不向发行版复制来源声明不完整的历史代码片段。
