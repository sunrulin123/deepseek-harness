# Community Web UI upstream proposal

English | [中文](UPSTREAM_PROPOSAL.zh.md)

## Summary

This is a community proposal for review, not an accepted upstream change or an open pull request. The official [contribution policy](CONTRIBUTING.md) currently does not accept external pull requests. Community publication must follow the current Discussion rules; any later code submission requires an applicable upstream contribution path.

## Motivation

Phone users need readable conversations, reachable controls, and a taskbar that distinguishes native execution tools from third-party extensions. Desktop users also need the existing official presentation to remain stable. This edition puts the Web presentation in the normal source build so users do not need a separate UI injection plugin.

## Proposed scope

- Select Web presentation from the supported application boot path while retaining Desktop rendering.
- Add optional presentation grouping to list Slots, preserving existing behavior for callers without filters.
- Render native session tools and extension entries through the same registry and their existing components.
- Scope responsive typography, composer, viewport, and code-block styling to the community Web presentation.
- Preserve the original task lifecycle, session data, model configuration, authentication, and plugin lifecycle.

The [developer reference](docs/community/develop.md) owns implementation details. The [verification record](docs/community/verification.md) owns evidence and limitations. Neither a screenshot nor a synthetic task count establishes that a real task executed.

## Review units

| Unit | Review focus |
| --- | --- |
| Boot presentation selection | Desktop isolation, browser activation, failure path |
| Slot grouping | Opt-in filtering, ordering, replacement, disposal, single mounting |
| Header composition | Native ownership, accessible menus, count semantics, responsive space |
| Reading and composing | Existing controls, code formatting, keyboard and sidebar access |
| Documentation | Reproducible setup, truthful test layers, bilingual consistency, attribution |

These units can be reviewed separately without introducing a second task manager or a parallel header. The proposal does not require upstream maintainers to accept the community visual style or the community project's distribution choices.

## Compatibility and limits

The source baseline is `dsh-v0.2.0-rc.2`. Later releases need source and behavior review; this proposal makes no compatibility promise for untested versions. Existing list-slot consumers remain unfiltered by default, while newly grouped header tools need an explicit classification.

The Web presentation marker is not a security control. In-memory Jobs do not gain process-restart persistence. The native build does not include a public relay or the old remote plugin's pairing service merely because its mobile design informed this work. Third-party Memory behavior is unchanged.

## Attribution and maintenance

Keep the upstream MIT license and author history. The [acknowledgements](ACKNOWLEDGEMENTS.md) distinguish earlier derivative plugin work from the files actually included in this source edition. Any copied implementation needs its own required license and modification notices before publication.

The community maintainer owns the fork's support and release claims. Contact: 2466441707@qq.com; QQ: 2466441707. Upstream review, merge, and official support remain decisions of the upstream maintainers.

## Dev Note

No upstream PR has been submitted. Publication, final screenshots, and the completed test report remain separate release actions; this proposal does not mark them complete.
