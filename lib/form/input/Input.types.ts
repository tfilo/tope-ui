import type { InputHTMLAttributes, RefObject } from 'react';
import type { IconType } from '../../common/IconType';

export interface InputActionProps {
    /** Icon element */
    icon: IconType;
    /** Optional method to handle click on icon */
    onClick?: () => void | Promise<void>;
    /** Title for better accesibility */
    title: string;
    /** Allows to disable click action */
    disabled?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** Optional buttons or icons at start of input */
    startAction?: Array<InputActionProps> | InputActionProps;
    /** Optional buttons or icons at end of input */
    endAction?: Array<InputActionProps> | InputActionProps;
    /** Ref to input */
    ref?: RefObject<HTMLInputElement | null>;
}
