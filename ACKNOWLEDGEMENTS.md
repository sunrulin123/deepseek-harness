# Acknowledgements

English | [中文](ACKNOWLEDGEMENTS.zh.md)

## Upstream project

[DeepSeek AI](https://github.com/deepseek-ai) develops [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), including its agent runtime, native UI, Client Modules, Slots, and official icons. This edition retains the upstream [MIT License](LICENSE), author history, and [third-party notices](THIRD_PARTY_NOTICES.md). The community maintainer does not claim authorship of the upstream code.

## Special thanks and original inspiration

Special thanks to the contributors to [dsh-web](https://github.com/zhu1090093659/dsh-web), maintained at the GitHub account [zhu1090093659](https://github.com/zhu1090093659). Its `@linxin666/dsh-remote-web-ui` package provided the remote Web interface and mobile-adaptation implementation used by the earlier local patch project. The npm maintainer is `linxin666`; the package does not name a separate personal author. Relevant mobile-code history also includes contributions by [Aa728848](https://github.com/Aa728848).

That plugin identifies [MrMu666/dsh-LAN](https://github.com/MrMu666/dsh-LAN) as the earlier reference for its mobile layout. The dsh-LAN package declares MIT licensing. Its portrait adaptation, touch controls, safe-area treatment, and sidebar access informed the later plugin work. Thank you to [MrMu666](https://github.com/MrMu666) and the community contributors involved.

## Code and asset attribution

The earlier local patch modified the complete `dsh-remote-web-ui@0.4.5` client bundle and was a derivative of Apache-2.0 code, not merely an inspired design. That patch is separate from this source edition. This checkout modifies the existing upstream React components and CSS Modules, adds list-slot presentation grouping, and imports existing upstream icons. It does not include the old complete client bundle, mobile-adaptation DOM patch, or its bundled QR implementation.

Official icons remain upstream artwork. No official mark is claimed as an original community logo. If a contribution introduces copied plugin implementation, its files must retain the applicable Apache license and modification notices; retained bundled dependencies keep their own licenses. General thanks cannot substitute for those requirements.

## Community contributors

Thanks to users who reported narrow-screen layout problems and tested Android browser behavior. Reports distinguish previous installed-plugin results from tests of this source edition. This project is unofficial and is not endorsed by DeepSeek AI or the authors of the referenced projects.

## Dev Note

The final source diff and accompanying notices require a final reuse check before publication. The dsh-LAN repository declares MIT but did not include a standalone license or named copyright notice at the reviewed revision; do not copy uncertain historical excerpts into the release without resolving their attribution.
