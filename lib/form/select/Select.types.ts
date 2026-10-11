import type { SelectHTMLAttributes, RefObject } from 'react';

import type { Option } from '../../common/Option';
import type { OptionGroup } from '../../common/OptionGroup';

interface BaseProps {
    /** Optional label for select component */
    label?: string;
    /** Optional error message for select component, if not blank, all input is in danger color */
    error?: string;
    /** Ref to select */
    ref?: RefObject<HTMLSelectElement | null>;
    /** Options for the select component */
    options: (Option | OptionGroup)[];
    /** Allow select empty option */
    allowEmptyOption?: boolean;
}

export interface SelectProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
