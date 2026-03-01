import { useId } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { SelectProps } from './Select.types';

const theme = {
    base: 'flex-1 focus:outline-none px-md min-h-[30px]',
    multiselect: 'py-md'
};

/**
 * Select component that renders as HTMLSelectElement element wrapped by parent div
 * containing optional label and error message.
 */
export const Select: React.FC<SelectProps> = ({
    id,
    label,
    error,
    ref,
    options,
    allowEmptyOption,
    emptyOptionLabel = '--Please choose an option--',
    ...props
}) => {
    const _id = useId();
    const selectId = id || `select-${_id}`;

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={props.required}
            disabled={props.disabled}
            elementId={selectId}
        >
            <select
                className={`${theme.base} ${props.multiple ? theme.multiselect : ''}`.trim()}
                {...props}
                id={selectId}
                ref={ref}
            >
                {allowEmptyOption && <option value=''>{emptyOptionLabel}</option>}
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
                            className='p-xs rounded-sm'
                        >
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </ElementWrapper>
    );
};
