import type { ButtonProps } from '../button/Button.types';
import type { Option } from '../../common/Option';
import type { Icon } from '../../common/Icon';

type OptionWithIconAndAction = Option & {
    icon?: Icon;
    action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};

export type DropdownProps = React.PropsWithChildren<{
    buttonProps?: Omit<ButtonProps<'button'>, 'as' | 'ref' | 'children'>;
    options: OptionWithIconAndAction[];
}>;
