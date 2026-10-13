# Agent Note: Community header presentation groups

Status: implemented

English | [中文](2026-10-13-community-header-groups.zh.md)

## Problem

The Community browser header separates native Session tools from third-party extensions while the packaged Desktop retains its original presentation. A shared action slot contains both categories, and its public registration metadata does not establish trusted package ownership. Reading React internals or moving DOM nodes makes presentation depend on private renderer details.

## Decision

List registrations carry an optional parent-defined presentation `group`. The authorized parent filters its own outlets through `group` or `excludeGroups`. The Community header renders the disjoint native and extension selections once each and omits read-only mode status; the Desktop header remains unfiltered. This additive API does not change registration permissions, priority election, Session scope, or teardown.

The native action packages declare their own group. Unknown, ungrouped action registrations remain discoverable in Plugins. A group is a presentation agreement, not proof that an extension is official. Future native entries need an explicit group declaration; the renderer does not guess from names or icons.

## Alternatives considered

**Private React inspection and DOM relocation.** These reproduce the previous injected adaptation's coupling to renderer internals and can separate nodes from their owning component lifecycle.

**A second native action registry.** This duplicates registration and moves Session tools onto a separate state and lifetime path. Filtering the existing list keeps the original data sources and component handlers.

**Unmounting collapsed extensions.** This discards component-local state whenever Plugins closes. The disclosure keeps registered extension entries mounted once while its content is hidden.

## Consequences

The renderer's real SlotCore integration tests cover filtered ordering, ungrouped entries, fallback, disposal, and unchanged unfiltered rendering. Component tests preserve native count semantics and exercise the extension disclosure. Browser layout and packaged Desktop behavior still require their respective visual checks; these component tests are not device acceptance.

Parents rendering multiple filtered outlets must keep their selections disjoint. Group metadata is optional for existing registrations, so unknown future official actions are not automatically classified as native.
