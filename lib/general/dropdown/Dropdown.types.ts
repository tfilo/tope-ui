import type { ButtonProps } from '../button/Button.types';
import type { Icon } from '../../common/Icon';

type OptionWithIconAndAction = {
    label: string;
    disabled?: boolean;
    icon?: Icon;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};

export type DropdownProps = React.PropsWithChildren<{
    buttonProps?: Omit<ButtonProps<'button'>, 'as' | 'ref' | 'children'>;
    options: OptionWithIconAndAction[];
}>;
