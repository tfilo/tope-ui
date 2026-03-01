import React, { useCallback, useEffect, useId, useMemo } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/16/solid';
import { isNotBlank } from '../../utils/string-utils';
import { Button, Tag } from '../../general';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { FileInputProps } from './FileInput.types';

const theme = {
    action: {
        button: 'min-w-[30px] min-h-[30px]',
        clearButton: 'min-w-[30px] min-h-[30px] border-transparent! rounded-none! outline-none! focus:bg-danger-dark!',
        iconWrapper: 'min-w-[30px] min-h-[30px] flex justify-center',
        icon: 'w-xl',
        rightWrapper: 'flex flex-row border-l'
    },
    input: 'flex-1 focus:outline-none min-h-[30px]'
} as const;

/**
 * FileInput component that renders as HTMLDivElement element wrapped by parent div
 * containing optional label and error message. Internally uses hidden file input to handle file selection and displays selected files as tags.
 * Supports both single and multiple file selection.
 */
export const FileInput: React.FC<FileInputProps> = ({
    id,
    label,
    error,
    name,
    value,
    accept,
    multiple,
    disabled,
    required,
    readOnly,
    onChange
}) => {
    const _id = useId();
    const hiddenFileInputRef = React.useRef<HTMLInputElement | null>(null);
    const inputId = id || `input-${_id}`;
    const hasLabel = isNotBlank(label);
    const hasError = isNotBlank(error);

    const handleSelect = useCallback(() => {
        hiddenFileInputRef.current?.click();
    }, []);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange && event.currentTarget.files) {
                if (multiple) {
                    const files = Array.from(event.currentTarget.files);
                    onChange(files);
                } else {
                    const files = Array.from(event.currentTarget.files);
                    onChange(files.find(() => true) ?? null);
                }
            }
        },
        [onChange, multiple]
    );

    const inputValue = useMemo(() => {
        if (Array.isArray(value)) {
            return value;
        } else if (value instanceof File) {
            return [value];
        }
        return [];
    }, [value]);

    const handleRemoveFile = useCallback(
        (fileToRemove: File) => {
            if (onChange) {
                if (multiple && Array.isArray(value)) {
                    const newValue = value.filter((file) => file !== fileToRemove);
                    onChange(newValue);
                } else if (!multiple && value instanceof File && value === fileToRemove) {
                    onChange(null);
                }
            }
        },
        [onChange, value, multiple]
    );

    useEffect(() => {
        // Simulate accesibility behavior of native file input where clicking on label or error message focuses the input element. This is needed as we are using div as main element instead of native input.
        const handleClick = () => {
            document.getElementById(inputId)?.focus();
        };
        document.getElementById(`${inputId}-label`)?.addEventListener('click', handleClick);
        if (hasError) {
            document.getElementById(`${inputId}-error`)?.addEventListener('click', handleClick);
        }
        return () => {
            document.getElementById(`${inputId}-label`)?.removeEventListener('click', handleClick);
            document.getElementById(`${inputId}-error`)?.removeEventListener('click', handleClick);
        };
    }, [inputId, hasError]);

    const labeledBy = useMemo(() => {
        const labeledBy = [];
        if (hasLabel) {
            labeledBy.push(`${inputId}-label`);
        }
        if (hasError) {
            labeledBy.push(`${inputId}-error`);
        }
        return labeledBy.length > 0 ? labeledBy.join(' ') : undefined;
    }, [hasError, hasLabel, inputId]);

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={required}
            disabled={disabled}
            elementId={inputId}
        >
            <div
                className={theme.input}
                id={inputId}
                role='textbox'
                aria-labelledby={labeledBy}
                tabIndex={0}
            >
                {inputValue.map((option) => (
                    <Tag
                        key={option.name}
                        label={option.name}
                        disabled={disabled}
                        onRemove={readOnly ? undefined : () => handleRemoveFile(option)}
                    />
                ))}
            </div>
            <input
                type='file'
                name={name}
                className='hidden'
                ref={hiddenFileInputRef}
                onChange={handleChange}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
            />
            <div className={theme.action.rightWrapper}>
                <Button
                    variant='transparent'
                    showChildren={false}
                    icon={ArrowUpTrayIcon}
                    onClick={handleSelect}
                    disabled={disabled || readOnly}
                    additionalClassName={theme.action.button}
                >
                    Select file{/* TODO localize */}
                </Button>
            </div>
        </ElementWrapper>
    );
};
