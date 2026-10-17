import type { InputHTMLAttributes } from 'react';

interface BaseProps {
    /** Optional label for Switch component */
    label?: string;
    /** Optional error message for Switch component, if not blank, Switch is in danger color */
    error?: string;
}

/** Properties for the Switch component. */
export interface SwitchProps
    extends
        Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'checked' | 'type' | 'value' | 'onChange' | 'onBlur' | 'name'>,
        BaseProps {}
