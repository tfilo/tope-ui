import type { ElementType, ReactNode, RefObject } from 'react';
import type { Icon } from '../../common/Icon';

interface ButtonBaseProps {
    /** Content displayed inside the button. If `showChildren` is false the children are not rendered. */
    children?: ReactNode | undefined;
    /** Visual variant of the button. One of: 'primary' | 'secondary' | 'danger' | 'outline' | 'transparent'. Defaults to 'primary'. */
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'transparent';
    /** Optional icon component (a React component conforming to Icon). When provided, the icon is rendered before the children. */
    icon?: Icon;
    /** Text decoration applied to children. One of: 'underline' | 'none'. Defaults to 'none'. */
    textDecoration?: 'underline' | 'none';
    /** When false, children will not be rendered. If children is a string and `showChildren` is false, that string will be used as the icon's accessible title. Defaults to true. */
    showChildren?: boolean;
    /** Additional Tailwind/CSS classes appended to the button base styles. Defaults to 'min-w-[32px] min-h-[32px]'. */
    additionalClassName?: string;
    /** Full CSS class string to apply to the rendered element. By default this is constructed from the theme (variant, textDecoration and base classes) but may be overridden. */
    className?: string | undefined;
}

export type ButtonProps<T extends ElementType> = ButtonBaseProps & {
    /** Optional element or component to render instead of the default 'button' (e.g. 'a', Link, custom component). */
    as?: T;
    /** Ref to button element */
    ref?: RefObject<unknown | null>;
} & Omit<React.ComponentPropsWithRef<T>, keyof ButtonBaseProps | 'as'>;
