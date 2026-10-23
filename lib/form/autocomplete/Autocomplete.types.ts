import type { InputHTMLAttributes } from 'react';

import type { Option } from '../../common/Option';

export type OnSearchResult = {
    hasNextPage: boolean;
    page: number;
    options: Option[];
};

interface BaseProps {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** onSearch callback to handle autocomplete input */
    onSearch: (query: string, page: number, pageSize: number, abortSignal: AbortSignal) => Promise<OnSearchResult>;
    /** onFetch to fetch single option by value */
    onFetch: (value: string, abortSignal?: AbortSignal) => Promise<Option | null>;
    /** pageSize specify how many options to fetch per page, default is 10 */
    pageSize?: number;
}

export interface AutocompleteProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'ref' | 'value' | 'onChange'>, BaseProps {}
