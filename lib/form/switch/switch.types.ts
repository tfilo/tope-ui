import type { InputHTMLAttributes } from 'react';

/** Properties for the Switch component. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    /** The currently selected value */
    value: boolean;

    /** Callback function triggered when value changes.
     * @param {boolean} value - The new boolean value.
     */
    onChange: (value: boolean) => Promise<void> | void;

    /** Optional label for Switch component */
    label?: string;

    /** Optional error message for Switch component, if not blank, Switch is in danger color */
    error?: string;
}
