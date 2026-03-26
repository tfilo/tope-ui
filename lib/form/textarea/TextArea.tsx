import React, { useEffect, useEffectEvent, useId, useState, type ChangeEvent } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import { isNotBlank } from '../../utils/string-utils';
import type { TextAreaProps } from './TextArea.types';

const theme = {
    base: 'flex-1 focus:outline-0 px-md py-sm',
    counter: 'absolute -bottom-[16px] right-[0px] text-sm text-secondary text-right',
    wrapper: 'w-full flex flex-col relative'
} as const;

/**
 * TextArea component that renders as HTMLTextAreaElement element wrapped by parent div
 * containing optional label and error message.
 */
export const TextArea: React.FC<TextAreaProps> = ({ id, label, error, ref, onChange, value, ...props }) => {
    const _id = useId();
    const [count, setCount] = useState(0);
    const textareaId = id || `textarea-${_id}`;
    const hasMaxLenght = props.maxLength !== undefined;
    const hasError = isNotBlank(error);

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange !== undefined && typeof onChange === 'function') {
            onChange(e);
        }
        setCount(e.currentTarget.value.length);
    };

    const onUpdateCount = useEffectEvent((length: number) => {
        setCount(length);
    });

    useEffect(() => {
        if (value !== undefined || value !== null) {
            if (typeof value === 'number') {
                onUpdateCount(String(value).length);
            }
            if (typeof value === 'string') {
                onUpdateCount(value.length);
            }
        }
    }, [value]);

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={props.required}
            disabled={props.disabled}
            elementId={textareaId}
        >
            <div className={theme.wrapper}>
                <textarea
                    className={theme.base}
                    rows={4}
                    {...props}
                    id={textareaId}
                    value={value}
                    onChange={handleOnChange}
                    ref={ref}
                />
                {hasMaxLenght && !hasError && (
                    <span className={theme.counter}>
                        {count}/{props.maxLength}
                    </span>
                )}
            </div>
        </ElementWrapper>
    );
};
