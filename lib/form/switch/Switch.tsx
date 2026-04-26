import { useId, useMemo } from 'react';
import type { SwitchProps } from './switch.types';
import { isNotBlank, sb } from '../../utils/string-utils';
import { localization } from '../../utils/constants';

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

const Switch: React.FC<SwitchProps> = ({ id, label, error, required, disabled, value, onChange, ...props }) => {
    const _id = useId();
    const baseId = id || _id;
    const inputId = `input-${baseId}`;

    const hasLabel = isNotBlank(label);
    const hasError = isNotBlank(error);

    const borderColor = useMemo(() => {
        return theme.borderColor(hasError).disabled[sb(!!disabled)].checked[sb(value)];
    }, [disabled, hasError, value]);

    const circleColor = useMemo(() => {
        return theme.circle.color.disabled[sb(!!disabled)].checked[sb(value)];
    }, [disabled, value]);

    return (
        <>
            <div className={theme.wrapper}>
                <input
                    {...props}
                    type='checkbox'
                    id={inputId}
                    checked={value}
                    disabled={disabled}
                    className={theme.srOnly}
                    onChange={(e) => {
                        if (props.readOnly) return;
                        onChange(e.target.checked);
                    }}
                />
                <label
                    htmlFor={inputId}
                    id={`${inputId}-switch`}
                    className={`${theme.base(!(disabled || props.readOnly))} ${borderColor}`}
                >
                    <span className={theme.srOnly}>{localization.switch}</span>
                    <span className={`${theme.circle.base(value)} ${circleColor}`}></span>
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
                <label
                    htmlFor={inputId}
                    id={`${inputId}-error`}
                    className={theme.error(disabled)}
                >
                    {error}
                </label>
            )}
        </>
    );
};

export default Switch;
