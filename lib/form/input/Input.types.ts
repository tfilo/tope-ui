import type { InputHTMLAttributes } from 'react';
import type { Icon } from '../../common/Icon';

export interface InputActionProps {
    /** Icon element */
    icon: Icon;
    /** Optional method to handle click on icon */
    onClick?: () => void | Promise<void>;
    /** Title for better accesibility */
    title: string;
    /** Allows to disable click action */
    disabled?: boolean;
}

interface BaseProps {
    /** Native input type. 'number' stores number | undefined (empty or invalid); other types store strings. */
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** Optional buttons or icons at start of input */
    startAction?: Array<InputActionProps> | InputActionProps;
    /** Optional buttons or icons at end of input */
    endAction?: Array<InputActionProps> | InputActionProps;
}

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
