import React, { useId } from 'react';
import { useSelector } from '@tanstack/react-form';

import { useFieldContext } from '../../hooks/form-context';
import { localization } from '../../utils/constants';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { TextAreaProps } from './TextArea.types';
import { isNotBlank } from '../../utils/string-utils';

const theme = {
    base: 'flex-1 focus:outline-0 px-md py-sm',
    counter: 'absolute -bottom-[16px] right-[0px] text-sm text-secondary text-right',
    wrapper: 'w-full flex flex-col relative'
} as const;

/**
 * TextArea component that renders as HTMLTextAreaElement element wrapped by parent div
 * containing optional label and error message.
 */
const TextArea: React.FC<TextAreaProps> = ({ id, label, error, ref, ...props }) => {
    const _id = useId();
    const textareaId = id || `textarea-${_id}`;
    const hasMaxLenght = props.maxLength !== undefined;

    const field = useFieldContext<string>();
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const hasError = errors.length > 0 || isNotBlank(error);

    const count = field.state.value ? String(field.state.value).length : 0;

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={props.required}
            disabled={props.disabled}
            elementId={textareaId}
        >
            <div className={theme.wrapper}>
                <textarea
                    className={theme.base}
                    rows={4}
                    {...props}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    id={textareaId}
                    ref={ref}
                />
                {hasMaxLenght && !hasError && (
                    <span
                        className={theme.counter}
                        aria-description={localization.textareaCounter}
                    >
                        {count}/{props.maxLength}
                    </span>
                )}
            </div>
        </ElementWrapper>
    );
};

export default TextArea;
