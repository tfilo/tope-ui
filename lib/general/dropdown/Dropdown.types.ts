import type { ButtonProps } from '../button/Button.types';
import type { Option } from '../../common/Option';
import type { Icon } from '../../common/Icon';

type OptionWithIcon = Option & { icon?: Icon };

export type DropdownProps = React.PropsWithChildren<{
    buttonProps?: Omit<ButtonProps<'button'>, 'as' | 'ref' | 'children'>;
    options: OptionWithIcon[];
}>;
