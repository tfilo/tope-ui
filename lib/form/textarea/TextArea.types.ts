import type { TextareaHTMLAttributes } from 'react';

interface BaseProps {
    /** Optional label for textarea component */
    label?: string;
    /** Optional error message for textarea component, if not blank, all input is in danger color */
    error?: string;
}

export interface TextAreaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
