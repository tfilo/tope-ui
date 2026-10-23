import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@tanstack/react-form';

import type { Option } from '../../common/Option';
import { Tag } from '../../general';
import { useFieldContext } from '../../hooks/form-context';
import { localization } from '../../utils/constants';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import { selectionTheme as theme } from '../selection-theme';
import type { SelectProps } from './Select.types';

/** A button-like select with local options and Autocomplete's selected-value tags. */
export const Select: React.FC<SelectProps> = ({
    id,
    label,
    error,
    options,
    allowEmptyOption = false,
    multiple = false,
    disabled = false,
    required,
    className,
    onClick,
    onKeyDown,
    ...props
}) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const field = useFieldContext<string | string[]>();
    const value = useSelector(field.store, (state) => state.value);
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];
    const values = multiple ? (Array.isArray(value) ? value : []) : typeof value === 'string' && value !== '' ? [value] : [];
    const flatOptions = options.flatMap((option) => ('options' in option ? option.options : [option]));
    const selectedOptions = values.map((v) => flatOptions.find((option) => option.value === v) ?? { value: v, label: v });
    const canRemove = allowEmptyOption || values.length > 1;
    const [isOpen, setIsOpen] = useState(false);
    // Reset the popup when disabled so re-enabling starts with a closed control.
    if (disabled && isOpen) setIsOpen(false);
    const open = isOpen && !disabled;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);
    const focusOnOpen = useRef<'first' | 'last' | null>(null);

    const close = () => setIsOpen(false);
    const focusTrigger = () => triggerRef.current?.focus();
    const remove = (option: Option) => {
        if (disabled || !canRemove) return;
        field.handleChange(multiple ? values.filter((v) => v !== option.value) : '');
        close();
        focusTrigger();
    };
    const select = (option: Option) => {
        if (disabled || option.disabled) return;
        if (values.includes(option.value)) {
            if (canRemove) field.handleChange(multiple ? values.filter((v) => v !== option.value) : '');
        } else {
            field.handleChange(multiple ? [...values, option.value] : option.value);
        }
        close();
        focusTrigger();
    };

    useEffect(() => {
        if (open) {
            popoverRef.current?.showPopover();
            if (focusOnOpen.current) {
                const buttons = optionsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
                const target = focusOnOpen.current === 'last' ? buttons?.[buttons.length - 1] : buttons?.[0];
                target?.focus();
                focusOnOpen.current = null;
            }
        } else {
            popoverRef.current?.hidePopover();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) close();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const buttons = Array.from(optionsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
        const index = buttons.indexOf(event.currentTarget);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index + (event.key === 'ArrowDown' ? 1 : -1);
            buttons[Math.max(0, Math.min(buttons.length - 1, next))]?.focus();
        }
    };
    const renderOption = (option: Option) => (
        <li
            key={option.value}
            role='none'
            className={theme.option.interactive(option.disabled)}
        >
            <button
                type='button'
                role='option'
                aria-selected={values.includes(option.value)}
                disabled={disabled || option.disabled}
                className={theme.option.button}
                onClick={() => select(option)}
                onKeyDown={handleOptionKeyDown}
            >
                {option.label}
                {values.includes(option.value) && <CheckIcon className={theme.option.buttonIcon} />}
            </button>
        </li>
    );
    const Chevron = open ? ChevronUpIcon : ChevronDownIcon;

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={required}
            disabled={disabled}
            elementId={selectId}
        >
            <div
                className={theme.wrapper}
                ref={wrapperRef}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        close();
                        field.handleBlur();
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                        focusTrigger();
                    }
                }}
            >
                <div
                    className={`${theme.inputAndTagWrapper} ${disabled ? '' : 'cursor-pointer'}`}
                    style={{ anchorName: `--select_${generatedId}` }}
                    onClick={(event) => {
                        if (disabled || (event.target as HTMLElement).closest('button')) return;
                        focusTrigger();
                        setIsOpen(!open);
                    }}
                >
                    {selectedOptions.map((option) => (
                        <Tag
                            key={option.value}
                            label={option.label}
                            disabled={disabled}
                            variant='outline'
                            onClick={() => {
                                focusTrigger();
                                setIsOpen(!open);
                            }}
                            onRemove={canRemove ? () => remove(option) : undefined}
                        />
                    ))}
                    <button
                        {...props}
                        type='button'
                        role='combobox'
                        id={selectId}
                        ref={triggerRef}
                        name={field.name}
                        disabled={disabled}
                        aria-expanded={open}
                        aria-controls={`${selectId}-options`}
                        aria-haspopup='listbox'
                        aria-required={required}
                        className={`${theme.inputWrapper} min-h-[30px] cursor-pointer items-center justify-end focus:outline-none disabled:cursor-default ${className ?? ''}`}
                        onClick={(event) => {
                            onClick?.(event);
                            if (!event.defaultPrevented) setIsOpen(!open);
                        }}
                        onKeyDown={(event) => {
                            onKeyDown?.(event);
                            if (event.defaultPrevented) return;
                            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                                event.preventDefault();
                                focusOnOpen.current = event.key === 'ArrowUp' ? 'last' : 'first';
                                if (open) {
                                    const buttons = optionsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
                                    (event.key === 'ArrowUp' ? buttons?.[buttons.length - 1] : buttons?.[0])?.focus();
                                    focusOnOpen.current = null;
                                } else setIsOpen(true);
                            }
                        }}
                    >
                        <span className={`${theme.button} inline-flex items-center justify-center`}>
                            <Chevron className='size-xl' />
                        </span>
                    </button>
                </div>
                <div
                    popover='manual'
                    ref={popoverRef}
                    className={theme.optionsWrapper}
                    style={{ positionAnchor: `--select_${generatedId}`, maxHeight: '188px', overflowY: 'auto' }}
                    onMouseDown={(event) => event.preventDefault()}
                >
                    <ul
                        ref={optionsRef}
                        id={`${selectId}-options`}
                        role='listbox'
                        aria-multiselectable={multiple || undefined}
                        aria-label={label || props['aria-label']}
                        className={theme.options}
                    >
                        {flatOptions.length === 0 && (
                            <li
                                role='none'
                                className={theme.option.noninteractive}
                            >
                                {localization.noOptions}
                            </li>
                        )}
                        {options.map((option) =>
                            'options' in option ? (
                                <li
                                    key={option.label}
                                    role='group'
                                    aria-label={option.label}
                                >
                                    <div className={theme.option.noninteractive}>{option.label}</div>
                                    <ul
                                        role='none'
                                        className={theme.options}
                                    >
                                        {option.options.map(renderOption)}
                                    </ul>
                                </li>
                            ) : (
                                renderOption(option)
                            )
                        )}
                    </ul>
                </div>
            </div>
        </ElementWrapper>
    );
};
