import type { Icon } from '../../common/Icon';

/**
 * Menu item can be clickable item or it can be dropdown with clicable menu items
 *
 */
type MenuItem = {
    icon: Icon;
    label: string;
} & (
    | {
          onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
          menu?: never;
      }
    | {
          onClick?: never;
          menu: Required<Omit<MenuItem, 'menu'>>[];
      }
);

/**
 * Header props containing menu items, logout and profile callbacks
 */
export type HeaderProps = {
    menu?: MenuItem[];
    onLogout?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    onProfile?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};
