import React, { useId, useState } from 'react';
import { useSelector } from '@tanstack/react-form';

import { useFieldContext } from '../../hooks/form-context';
import { Button } from '../../general/button';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { InputActionProps, InputProps } from './Input.types';

const theme = {
    action: {
        button: 'min-w-[30px] min-h-[30px]',
        iconWrapper: 'min-w-[30px] min-h-[30px] flex justify-center',
        icon: 'w-xl',
        leftWrapper: 'flex flex-row border-r',
        rightWrapper: 'flex flex-row border-l'
    },
    input: 'flex-1 focus:outline-none px-md min-h-[30px]'
} as const;

const InputAction: React.FC<InputActionProps> = (props) => {
    const [processing, setProcessing] = useState(false);

    const handleClick = async () => {
        if (props.onClick) {
            setProcessing(true);
            try {
                await props.onClick();
            } finally {
                setProcessing(false);
            }
        }
    };

    if (!props.onClick) {
        const Icon = props.icon;
        return (
            <div className={theme.action.iconWrapper}>
                <Icon
                    className={theme.action.icon}
                    title={props.title}
                />
            </div>
        );
    }

    return (
        <Button
            key={props.title}
            variant='transparent'
            showChildren={false}
            icon={props.icon}
            onClick={handleClick}
            disabled={processing || props.disabled}
            additionalClassName={theme.action.button}
        >
            {props.title}
        </Button>
    );
};

/**
 * Input component that renders as HTMLInputElement element wrapped by parent div
 * containing optional label and error message.
 */
const Input: React.FC<InputProps> = ({ id, startAction, endAction, label, error, ref, ...props }) => {
    const _id = useId();
    const inputId = id || `input-${_id}`;

    const field = useFieldContext<string>();
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const startActionsArray = Array.isArray(startAction) ? startAction : startAction ? [startAction] : [];
    const endActionsArray = Array.isArray(endAction) ? endAction : endAction ? [endAction] : [];

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={props.required}
            disabled={props.disabled}
            elementId={inputId}
        >
            {startActionsArray.length > 0 && (
                <div className={theme.action.leftWrapper}>
                    {startActionsArray.map((action, idx) => (
                        <InputAction
                            {...action}
                            key={`${action.title}_${idx}`}
                            disabled={action.disabled || props.disabled}
                        />
                    ))}
                </div>
            )}
            <input
                className={theme.input}
                {...props}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                id={inputId}
                ref={ref}
            />
            {endActionsArray.length > 0 && (
                <div className={theme.action.rightWrapper}>
                    {endActionsArray.map((action, idx) => (
                        <InputAction
                            {...action}
                            key={`${action.title}_${idx}`}
                            disabled={action.disabled || props.disabled}
                        />
                    ))}
                </div>
            )}
        </ElementWrapper>
    );
};

export default Input;
