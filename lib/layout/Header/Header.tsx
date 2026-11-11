import { ArrowLeftStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Button, Dropdown } from '../../general';
import type { HeaderProps } from './Header.types';

const theme = {
    base: 'border-b border-default flex flex-row gap-xl shadow',
    menu: 'min-w-0 flex-1 flex flex-row gap-lg overflow-y-auto p-lg',
    actions: 'shrink-0 flex flex-row gap-lg p-lg',
    button: 'min-w-[32px] min-h-[32px] max-tablet:w-fit max-tablet:min-w-[32px] max-tablet:px-[0px]',
    label: 'hidden tablet:inline'
} as const;

/**
 * Header component renders as HTMLHeaderElement element with optional menu, profile and logout buttons
 */
export const Header: React.FC<HeaderProps> = ({ menu = [], onLogout = null, onProfile = null }) => {
    const hasProfileOrLogout = onProfile !== null || onLogout !== null;

    return (
        <header className={theme.base}>
            <nav className={theme.menu}>
                {menu.map((m) => {
                    if (m.menu !== undefined) {
                        return (
                            <Dropdown
                                key={m.label}
                                buttonProps={{
                                    variant: 'outline',
                                    icon: m.icon,
                                    additionalClassName: theme.button,
                                    'aria-label': m.label,
                                    title: m.label
                                }}
                                options={m.menu.map((mm) => {
                                    return {
                                        label: mm.label,
                                        icon: mm.icon,
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
                            variant='outline'
                            additionalClassName={theme.button}
                            aria-label={m.label}
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
                            additionalClassName={theme.button}
                            aria-label={localization.profile}
                            title={localization.profile}
                            variant='outline'
                            onClick={onProfile}
                        >
                            <span className={theme.label}>{localization.profile}</span>
                        </Button>
                    )}
                    {onLogout !== null && (
                        <Button
                            icon={ArrowLeftStartOnRectangleIcon}
                            additionalClassName={theme.button}
                            aria-label={localization.logout}
                            title={localization.logout}
                            variant='outline'
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
