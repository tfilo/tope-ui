import { useId } from 'react';

import { localization } from '../../utils/constants';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { SelectProps } from './Select.types';
import { useFieldContext } from '../../hooks/form-context';
import { useSelector } from '@tanstack/react-form';

const theme = {
    base: 'flex-1 focus:outline-none px-md min-h-[30px]',
    multiselect: 'py-md',
    option: 'rounded-sm p-xs'
};

/**
 * Select component that renders as HTMLSelectElement element wrapped by parent div
 * containing optional label and error message.
 */
export const Select: React.FC<SelectProps> = ({ id, label, error, options, allowEmptyOption, multiple = false, ...props }) => {
    const _id = useId();
    const selectId = id || `select-${_id}`;

    const field = useFieldContext<string | string[]>();
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (multiple) {
            field.handleChange(Array.from(e.target.selectedOptions, (o) => o.value));
        } else {
            field.handleChange(e.target.value);
        }
    };

    const value = multiple ? (Array.isArray(field.state.value) ? field.state.value : []) : (field.state.value as string);

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={props.required}
            disabled={props.disabled}
            elementId={selectId}
        >
            <select
                className={`${theme.base} ${multiple ? theme.multiselect : ''}`.trim()}
                {...props}
                multiple={multiple}
                name={field.name}
                value={value}
                onChange={handleChange}
                onBlur={field.handleBlur}
                id={selectId}
            >
                {allowEmptyOption && !multiple && <option value=''>{localization.emptyOptionLabel}</option>}
                {options.map((option) => {
                    if ('options' in option) {
                        return (
                            <optgroup
                                key={option.label}
                                label={option.label}
                            >
                                {option.options.map((groupOption) => (
                                    <option
                                        key={groupOption.value}
                                        value={groupOption.value}
                                        disabled={groupOption.disabled}
                                    >
                                        {groupOption.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                    return (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className={theme.option}
                        >
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </ElementWrapper>
    );
};
