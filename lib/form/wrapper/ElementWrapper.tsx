import { isNotBlank } from '../../utils/string-utils';
import type { ElementWrapperProps } from './ElementWrapper.types';

const theme = {
    wrapper: 'flex-1 flex flex-col gap-sm',
    base: 'border rounded-sm flex flex-row',
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
export const ElementWrapper: React.FC<ElementWrapperProps> = ({ label, error, required, disabled, elementId, children }) => {
    const hasLabel = isNotBlank(label);
    const hasError = isNotBlank(error);
    const state = hasError ? 'error' : 'default';

    return (
        <div className={theme.wrapper}>
            {hasLabel && (
                <label htmlFor={elementId} className={theme.label(disabled)}>
                    {label}
                    {required && <span className={theme.star(disabled)}>*</span>}
                </label>
            )}
            <div className={`${theme.component} ${theme.state[state](disabled)} ${theme.base}`}>{children}</div>
            {hasError && (
                <label htmlFor={elementId} className={theme.error(disabled)}>
                    {error}
                </label>
            )}
        </div>
    );
};
