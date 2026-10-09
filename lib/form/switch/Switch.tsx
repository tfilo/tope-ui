import { useId } from 'react';

import type { SwitchProps } from './Switch.types';
import { isNotBlank, sb } from '../../utils/string-utils';
import { localization } from '../../utils/constants';
import { useFieldContext } from '../../hooks/form-context';
import { useSelector } from '@tanstack/react-form';

const theme = {
    wrapper: 'flex flex-1  flex-row items-center gap-md',
    base: (cursorPointer: boolean = false) =>
        `${cursorPointer ? 'cursor-pointer' : ''} flex h-[28px] w-[48px] items-center rounded-full border-2 transition-colors duration-500`,
    borderColor: (hasError: boolean = false) => {
        return {
            disabled: {
                true: {
                    checked: {
                        true: `border-primary-extra-light`,
                        false: `border-secondary-extra-light`
                    }
                },
                false: {
                    checked: {
                        true: `${hasError ? 'border-danger' : 'border-primary'}`,
                        false: `${hasError ? 'border-danger' : 'border-secondary-light'}`
                    }
                }
            }
        };
    },
    circle: {
        base: (value: boolean = false) =>
            `h-[20px] w-[20px] rounded-full transition-all duration-500 ${value ? 'translate-x-[22px]' : 'translate-x-[2px]'}`,
        color: {
            disabled: {
                true: {
                    checked: {
                        true: `bg-primary-extra-light`,
                        false: `bg-secondary-extra-light`
                    }
                },
                false: {
                    checked: {
                        true: `bg-primary`,
                        false: `bg-secondary-light`
                    }
                }
            }
        }
    },
    srOnly: 'sr-only',
    label: (isDisabled: boolean = false) => `${isDisabled ? 'text-disabled' : 'text-default'} flex flex-row gap-xs`,
    star: (isDisabled: boolean = false) => (isDisabled ? 'text-disabled' : 'text-danger'),
    error: (isDisabled: boolean = false) => (isDisabled ? 'text-disabled' : 'text-danger')
} as const;

const Switch: React.FC<SwitchProps> = ({ id, label, error, required, disabled, ref, ...props }) => {
    const _id = useId();
    const baseId = id || _id;
    const inputId = `input-${baseId}`;

    const field = useFieldContext<boolean>();
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const hasError = errors.length > 0 || isNotBlank(error);

    const hasLabel = isNotBlank(label);

    const borderColor = theme.borderColor(hasError).disabled[sb(!!disabled)].checked[sb(field.state.value)];
    const circleColor = theme.circle.color.disabled[sb(!!disabled)].checked[sb(field.state.value)];

    return (
        <>
            <div className={theme.wrapper}>
                <input
                    className={theme.srOnly}
                    type='checkbox'
                    {...props}
                    name={field.name}
                    checked={field.state.value}
                    disabled={disabled}
                    onChange={(e) => {
                        if (props.readOnly) return;
                        field.handleChange(e.target.checked);
                    }}
                    id={inputId}
                    ref={ref}
                />
                <label
                    htmlFor={inputId}
                    id={`${inputId}-switch`}
                    className={`${theme.base(!(disabled || props.readOnly))} ${borderColor}`}
                >
                    <span className={theme.srOnly}>{localization.switch}</span>
                    <span className={`${theme.circle.base(field.state.value)} ${circleColor}`}></span>
                </label>

                {hasLabel && (
                    <label
                        htmlFor={inputId}
                        id={`${inputId}-label`}
                        className={theme.label(disabled)}
                    >
                        {label}
                        {required && (
                            <span
                                className={theme.star(disabled)}
                                aria-description={localization.requiredField}
                            >
                                *
                            </span>
                        )}
                    </label>
                )}
            </div>
            {hasError && (
                <>
                    {errors.length > 0 ? (
                        errors.map((err, idx) => {
                            return (
                                <label
                                    htmlFor={inputId}
                                    id={`${inputId}-error-${idx}`}
                                    className={theme.error(disabled)}
                                    role='alert'
                                >
                                    {err}
                                </label>
                            );
                        })
                    ) : (
                        <label
                            htmlFor={inputId}
                            id={`${inputId}-error`}
                            className={theme.error(disabled)}
                            role='alert'
                        >
                            {error}
                        </label>
                    )}
                </>
            )}
        </>
    );
};

export default Switch;
