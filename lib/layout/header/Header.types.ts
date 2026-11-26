import type { Icon } from '../../common/Icon';

type MenuAction = {
    icon: Icon;
    label: string;
    active?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};

/** A navigation action or a dropdown containing navigation actions. */
export type MenuItem = Omit<MenuAction, 'onClick'> &
    (
        | {
              onClick: MenuAction['onClick'];
              menu?: never;
          }
        | {
              onClick?: never;
              menu: MenuAction[];
          }
    );

/**
 * Header props containing menu items, logout and profile callbacks
 */
export type HeaderProps = {
    menu?: MenuItem[];
    onLogout?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    onProfile?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    /** Optional attribute for Playwright testing */
    'data-testid'?: string;
};
