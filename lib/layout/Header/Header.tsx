import { ArrowLeftStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/16/solid';
import { Button, Dropdown } from '../../general';
import type { HeaderProps } from './Header.types';
import useWindowSize from '../../hooks/useWindowSize';
import { useMemo } from 'react';

const theme = {
    base: 'border-b border-default flex flex-row gap-xl shadow',
    menu: 'flex-1 flex flex-row gap-lg overflow-y-auto p-lg',
    actions: 'flex flex-row gap-lg p-lg'
} as const;

/**
 * Header component renders as HTMLHeaderElement element with optional menu, profile and logout buttons
 */
export const Header: React.FC<HeaderProps> = ({ menu = [], onLogout = null, onProfile = null }) => {
    const hasProfileOrLogout = onProfile !== null || onLogout !== null;

    const size = useWindowSize();

    const isMobile = useMemo(() => {
        return size === 'mobile';
    }, [size]);

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
                                    showChildren: !isMobile
                                }}
                                options={m.menu.map((mm) => {
                                    return {
                                        label: mm.label,
                                        icon: mm.icon,
                                        onClick: mm.onClick
                                    };
                                })}
                            >
                                {m.label}
                            </Dropdown>
                        );
                    }

                    return (
                        <Button
                            key={m.label}
                            icon={m.icon}
                            onClick={m.onClick}
                            variant='outline'
                            showChildren={!isMobile}
                        >
                            {m.label}
                        </Button>
                    );
                })}
            </nav>
            {hasProfileOrLogout && (
                <div className={theme.actions}>
                    {onProfile !== null && (
                        <Button
                            icon={UserCircleIcon}
                            showChildren={!isMobile}
                            variant='outline'
                            onClick={onProfile}
                        >
                            Profile
                        </Button>
                    )}
                    {onLogout !== null && (
                        <Button
                            icon={ArrowLeftStartOnRectangleIcon}
                            showChildren={!isMobile}
                            variant='outline'
                            onClick={onLogout}
                        >
                            Logout
                        </Button>
                    )}
                </div>
            )}
        </header>
    );
};
