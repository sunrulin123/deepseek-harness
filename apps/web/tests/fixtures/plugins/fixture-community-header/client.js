/** Two real extension registrations, intentionally without native presentation metadata. */
window.__ModuleLoader__.load({
  id: '@fixture/community-header',
  factory(require) {
    const React = require('react')
    const { Button } = require('@deepseek-ai/dsh-client-ui-primitives')
    const h = React.createElement
    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register('fixtureCommunityHeader', {
          en: { counter: 'Extension counter', details: 'Extension details' },
          zh: { counter: '扩展示例计数', details: '扩展示例详情' },
        }))
        for (const key of ['counter', 'details']) {
          ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
            name: 'conversation.session.header.actions', id: `fixture-community-${key}`, locale: 'fixtureCommunityHeader',
          }, ({ t }) => {
            const [count, setCount] = React.useState(0)
            return h(Button, {
              'aria-label': t(key), onClick: () => setCount(value => value + 1),
              'data-community-demo-extension': key,
            }, t(key), ' ', String(count))
          }))
        }
      },
    }
  },
})
