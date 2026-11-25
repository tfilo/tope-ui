import { ArrowLeftStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Button, Dropdown } from '../../general';
import type { HeaderProps } from './Header.types';

const theme = {
    base: 'border-b border-light bg-white flex flex-row items-center gap-xl',
    menu: 'min-w-0 flex flex-row gap-sm overflow-x-auto rounded-lg bg-secondary-extra-light mx-lg my-md p-sm empty:bg-transparent empty:m-none empty:p-none',
    actions: 'ml-auto shrink-0 flex flex-row gap-lg p-lg',
    button: (dropdown = false) =>
        `min-w-[32px] min-h-[32px] rounded-md! max-tablet:w-fit max-tablet:min-w-[32px] ${dropdown ? 'max-tablet:px-md' : 'max-tablet:px-none'}`,
    activeButton: 'shadow-sm',
    actionButton: 'text-secondary fill-secondary',
    label: 'hidden text-inherit tablet:inline'
} as const;

/**
 * Header component renders as HTMLHeaderElement element with optional menu, profile and logout buttons
 */
export const Header: React.FC<HeaderProps> = ({ menu = [], onLogout = null, onProfile = null }) => {
    const hasProfileOrLogout = onProfile !== null || onLogout !== null;

    if (menu.length === 0 && !hasProfileOrLogout) {
        return null;
    }

    return (
        <header className={theme.base}>
            <nav className={theme.menu}>
                {menu.map((m) => {
                    const active = m.active || m.menu?.some((item) => item.active);

                    if (m.menu !== undefined) {
                        return (
                            <Dropdown
                                key={m.label}
                                buttonProps={{
                                    variant: active ? 'primary' : 'transparent',
                                    icon: m.icon,
                                    additionalClassName: `${theme.button(true)} ${active ? theme.activeButton : ''}`,
                                    'aria-label': m.label,
                                    'aria-current': active ? 'page' : undefined,
                                    title: m.label
                                }}
                                options={m.menu.map((mm) => {
                                    return {
                                        label: mm.label,
                                        icon: mm.icon,
                                        active: mm.active,
                                        onClick: mm.onClick
                                    };
                                })}
                            >
                                <span className={theme.label}>{m.label}</span>
                            </Dropdown>
                        );
                    }

                    return (
                        <Button
                            key={m.label}
                            icon={m.icon}
                            onClick={m.onClick}
                            variant={active ? 'primary' : 'transparent'}
                            additionalClassName={`${theme.button()} ${active ? theme.activeButton : ''}`}
                            aria-label={m.label}
                            aria-current={active ? 'page' : undefined}
                            title={m.label}
                        >
                            <span className={theme.label}>{m.label}</span>
                        </Button>
                    );
                })}
            </nav>
            {hasProfileOrLogout && (
                <div className={theme.actions}>
                    {onProfile !== null && (
                        <Button
                            icon={UserCircleIcon}
                            additionalClassName={`${theme.button()} ${theme.actionButton}`}
                            aria-label={localization.profile}
                            title={localization.profile}
                            variant='transparent'
                            onClick={onProfile}
                        >
                            <span className={theme.label}>{localization.profile}</span>
                        </Button>
                    )}
                    {onLogout !== null && (
                        <Button
                            icon={ArrowLeftStartOnRectangleIcon}
                            additionalClassName={`${theme.button()} ${theme.actionButton}`}
                            aria-label={localization.logout}
                            title={localization.logout}
                            variant='transparent'
                            onClick={onLogout}
                        >
                            <span className={theme.label}>{localization.logout}</span>
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
};
