/** Source-rendered extension disclosure for the Community Web header. */
import { useId, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  IconChevronDownOutlineRegular, IconPluginPinwheelOutlineRegular, MenuSurface, useDismissOnOutsidePointer,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { ConversationSessionHeaderSlotProps } from '../contract/slots.ts'
import css from './ConversationRoot.module.css'

/**
 * Keeps extension entries mounted once while their menu is collapsed.
 * @param props - Authorized header slot renderer and localized copy.
 * @returns The extension disclosure; CSS removes it when every entry renders null.
 */
export function HeaderPlugins({ renderSlot, t }: Pick<ConversationSessionHeaderSlotProps, 'renderSlot' | 't'>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  useDismissOnOutsidePointer(rootRef, open, setOpen)
  return (
    <div
      className={css.communityPlugins}
      ref={rootRef}
      data-community-plugins=""
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || event.defaultPrevented || !open) return
        setOpen(false)
        event.preventDefault()
        triggerRef.current?.focus()
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        className={css.communityPluginTrigger}
        aria-label={t('header.plugins')}
        title={t('header.plugins')}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => { setOpen(value => !value) }}
      >
        <IconPluginPinwheelOutlineRegular size={20} className={css.communityPluginIcon} />
        <span className={css.communityPluginLabel}>{t('header.plugins')}</span>
        <IconChevronDownOutlineRegular size={14} className={clsx(css.communityPluginChevron, open && css.communityChevronOpen)} />
      </button>
      <MenuSurface id={id} className={css.communityPluginMenu} hidden={!open} aria-label={t('header.plugins')}>
        {renderSlot('conversation.session.header.actions', {}, { excludeGroups: ['native', 'status'] })}
      </MenuSurface>
    </div>
  )
}
