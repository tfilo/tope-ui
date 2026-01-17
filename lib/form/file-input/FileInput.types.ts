interface SingleFileInput {
    /** multiple attribute for the underlying input element */
    multiple?: false;
    /** value */
    value: File | null;
    /** onChange callback to handle value changes */
    onChange: (files: File | null) => void;
}

interface MultiFileInput {
    /** multiple attribute for the underlying input element */
    multiple: true;
    /** value */
    value: File[];
    /** onChange callback to handle value changes */
    onChange: (files: File[]) => void;
}

interface BaseFileInputProps {
    /** Optional label for input component */
    label?: string;
    /** Optional error message for input component, if not blank, all input is in danger color */
    error?: string;
    /** ID attribute for the underlying input element */
    id?: string;
    /** Name attribute for the underlying input element */
    name?: string;
    /** Value attribute for the underlying input element */
    value: File | null;
    /** Disabled state of the input */
    disabled?: boolean;
    /** Required state of the input */
    required?: boolean;
    /** onChange event handler */
    onChange?: (files: File) => void;
    /** accept attribute for the underlying input element */
    accept?: string;
}

export type FileInputProps = BaseFileInputProps & (SingleFileInput | MultiFileInput);
