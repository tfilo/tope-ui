import type { InputHTMLAttributes } from 'react';
import type { Option } from '../../common/Option';

type MultiAutocomplete = {
    /** Multiautocomplete */
    multiple: true;
    /** value */
    value: string[];
    /** onChange callback to handle value changes */
    onChange: (value: string[]) => void;
};
interface SingleAutocomplete {
    /** Multiautocomplete */
    multiple?: false;
    /** value */
    value: string | null;
    /** onChange callback to handle value changes */
    onChange: (value: string | null) => void;
}

interface BaseAutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'ref' | 'value' | 'onChange' | 'multiple'> {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** onSearch callback to handle autocomplete input */
    onSearch: (query: string, abortSignal: AbortSignal) => Promise<Option[]>;
    /** onFetch to fetch single option by value */
    onFetch: (value: string) => Promise<Option | null>;
}

export type AutocompleteProps = BaseAutocompleteProps & (SingleAutocomplete | MultiAutocomplete);
