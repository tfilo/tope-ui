import type { InputHTMLAttributes } from 'react';

export interface DateTimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** Type of input */
    type: 'date' | 'dateTime';
}

export interface CalendarProps {
    type: DateTimeInputProps['type'];
    baseId: string;
    popoverId: string;
}
