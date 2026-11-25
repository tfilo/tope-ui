import { localization } from '../../utils/constants';
import { isNotBlank } from '../../utils/string-utils';
import type { ElementWrapperProps } from './ElementWrapper.types';

const theme = {
    wrapper: 'flex-1 flex flex-col gap-sm',
    base: 'border rounded-sm bg-white flex flex-row',
    state: {
        default: (isDisabled: boolean = false) => {
            if (isDisabled) {
                return 'border-light text-disabled';
            }
            return 'has-hover:border-dark has-focus:border-dark';
        },
        error: (isDisabled: boolean = false) => {
            if (isDisabled) {
                return 'border-light text-disabled';
            }
            return 'border-danger has-hover:border-danger-dark has-focus:border-danger-dark';
        }
    },
    component: 'component has-focus:outline-2 outline-primary outline-offset-1',
    label: (isDisabled: boolean = false) => `${isDisabled ? 'text-disabled' : 'text-default'} flex flex-row gap-xs`,
    star: (isDisabled: boolean = false) => (isDisabled ? 'text-disabled' : 'text-danger'),
    error: (isDisabled: boolean = false) => (isDisabled ? 'text-disabled' : 'text-danger')
} as const;

/**
 * ElementWrapper component is internal wrapper component to construct form elements with label and error message
 */
export const ElementWrapper: React.FC<ElementWrapperProps> = ({
    label,
    error,
    additionalError,
    required,
    disabled,
    elementId,
    children,
    'data-testid': dataTestId
}) => {
    const hasLabel = isNotBlank(label);
    const hasError = Array.isArray(error) ? error.some(isNotBlank) : isNotBlank(error);
    const state = hasError || additionalError ? 'error' : 'default';

    return (
        <div className={theme.wrapper}>
            {hasLabel && (
                <label
                    htmlFor={elementId}
                    id={`${elementId}-label`}
                    className={theme.label(disabled)}
                    data-testid={dataTestId ? `${dataTestId}_label` : undefined}
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
            <div className={`${theme.component} ${theme.state[state](disabled)} ${theme.base}`}>{children}</div>
            {hasError &&
                (Array.isArray(error) ? (
                    <>
                        {error.map((err, idx) => {
                            return (
                                <label
                                    key={`${err}_${idx}`}
                                    htmlFor={elementId}
                                    id={`${elementId}-error-${idx}`}
                                    className={theme.error(disabled)}
                                    role='alert'
                                    data-testid={dataTestId ? `${dataTestId}_error_${idx}` : undefined}
                                >
                                    {err}
                                </label>
                            );
                        })}
                    </>
                ) : (
                    <label
                        htmlFor={elementId}
                        id={`${elementId}-error-0`}
                        className={theme.error(disabled)}
                        role='alert'
                        data-testid={dataTestId ? `${dataTestId}_error_0` : undefined}
                    >
                        {error}
                    </label>
                ))}
            {additionalError}
        </div>
    );
};
