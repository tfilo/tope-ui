import type { InputHTMLAttributes } from 'react';
import type { Option } from '../../common/Option';

export interface AutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'ref' | 'value' | 'onChange'> {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** value */
    value: string | null;
    /** onSearch callback to handle autocomplete input */
    onSearch: (query: string, abortSignal: AbortSignal) => Promise<Option[]>;
    /** onFetch to fetch single option by value */
    onFetch: (value: string) => Promise<Option | null>;
    /** onChange callback to handle value changes */
    onChange: (value: string | null) => void;
}
