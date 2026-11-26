import type { ButtonHTMLAttributes } from 'react';

import type { Option } from '../../common/Option';
import type { OptionGroup } from '../../common/OptionGroup';

interface BaseProps {
    /** Optional label for select component */
    label?: string;
    /** Compact single selection without wrapping tags. Existing selects keep their default presentation. */
    compact?: boolean;
    /** Label for selected values in regular and compact selects. Defaults to option.label; dropdown labels remain unchanged. */
    getSelectedLabel?: (option: Option) => string;
    /** Text shown when a compact select has no selected value. */
    placeholder?: string;
    /** Allow selecting multiple options */
    multiple?: boolean;
    /** Display the required indicator */
    required?: boolean;
    /** Optional error message for select component, if not blank, all input is in danger color */
    error?: string;
    /** Options for the select component */
    options: (Option | OptionGroup)[];
    /** Allow clearing the selection, including removing the last selected tag. No empty dropdown option is rendered. */
    allowEmptyOption?: boolean;
    /** Optional attribute for Playwright testing */
    'data-testid'?: string;
}

export interface SelectProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
