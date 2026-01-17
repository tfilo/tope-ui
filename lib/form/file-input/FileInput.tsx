import React, { useCallback, useId, useMemo } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { FileInputProps } from './FileInput.types';
import { Button } from '../button/Button';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/16/solid';

const theme = {
    action: {
        button: 'min-w-[30px] min-h-[30px]',
        clearButton: 'min-w-[30px] min-h-[30px] border-transparent! rounded-none! outline-none! focus:bg-danger-dark!',
        iconWrapper: 'min-w-[30px] min-h-[30px] flex justify-center',
        icon: 'w-xl',
        rightWrapper: 'flex flex-row border-l'
    },
    input: 'flex-1 focus:outline-none px-md min-h-[30px]'
} as const;

/**
 * FileInput component that renders as HTMLFileElement element wrapped by parent div
 * containing optional label and error message.
 */
export const FileInput: React.FC<FileInputProps> = ({ id, label, error, name, value, accept, multiple, disabled, required, onChange }) => {
    const _id = useId();
    const hiddenFileInputRef = React.useRef<HTMLInputElement | null>(null);
    const inputId = id || `input-${_id}`;

    const handleSelect = useCallback(() => {
        hiddenFileInputRef.current?.click();
    }, []);

    const handleClear = useCallback(() => {
        if (onChange && hiddenFileInputRef.current) {
            hiddenFileInputRef.current.value = '';
            hiddenFileInputRef.current.files = null;
            if (multiple) {
                onChange([]);
            } else {
                onChange(null);
            }
        }
    }, [multiple, onChange]);

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
        if (multiple && Array.isArray(value)) {
            return value.map((file) => file.name).join(', ');
        } else if (!multiple && value instanceof File) {
            return value.name;
        }
        return '';
    }, [value, multiple]);

    const hasFile = useMemo(() => {
        if (multiple && Array.isArray(value)) {
            return value.length > 0;
        } else if (!multiple && value instanceof File) {
            return true;
        }
        return false;
    }, [value, multiple]);

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={required}
            disabled={disabled}
            elementId={inputId}
        >
            <input
                className={theme.input}
                id={inputId}
                type='text'
                value={inputValue}
            />
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
                {hasFile && !disabled && (
                    <Button
                        variant='danger'
                        icon={XMarkIcon}
                        onClick={handleClear}
                        disabled={disabled}
                        additionalClassName={theme.action.clearButton}
                    >
                        Clear{/* TODO localize */}
                    </Button>
                )}
                <Button
                    variant='transparent'
                    icon={ArrowUpTrayIcon}
                    onClick={handleSelect}
                    disabled={disabled}
                    additionalClassName={theme.action.button}
                >
                    Select file{/* TODO localize */}
                </Button>
            </div>
        </ElementWrapper>
    );
};
