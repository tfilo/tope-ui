export interface FileInputProps {
    /** multiple attribute for the underlying input element */
    multiple?: boolean;
    /** Optional label for input component */
    label?: string;
    /** ID attribute for the underlying input element */
    id?: string;
    /** Disabled state of the input */
    disabled?: boolean;
    /** Required state of the input */
    required?: boolean;
    /** Readonly state of the input */
    readOnly?: boolean;
    /** accept attribute for the underlying input element */
    accept?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
}
