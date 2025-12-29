import type { InputHTMLAttributes, RefObject } from 'react';

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    /** Optional label for textarea component */
    label?: string;
    /** Optional error message for textarea component, if not blank, all input is in danger color */
    error?: string;
    /** Ref to textarea */
    ref?: RefObject<HTMLTextAreaElement | null>;
}
