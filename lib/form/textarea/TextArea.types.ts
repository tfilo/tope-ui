import type { TextareaHTMLAttributes, RefObject } from 'react';

interface BaseProps {
    /** Optional label for textarea component */
    label?: string;
    /** Optional error message for textarea component, if not blank, all input is in danger color */
    error?: string;
    /** Ref to textarea */
    ref?: RefObject<HTMLTextAreaElement | null>;
}

export interface TextAreaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
