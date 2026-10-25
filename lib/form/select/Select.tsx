import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@tanstack/react-form';

import type { Option } from '../../common/Option';
import { Button, Tag } from '../../general';
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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);

    // Options are local, so the popover can be shown and focused immediately.
    const handleOptionsOpen = () => {
        if (disabled) return;
        setIsOpen(true);
        popoverRef.current?.showPopover();
        optionsRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    };

    const handleOptionsClose = () => {
        setIsOpen(false);
        popoverRef.current?.hidePopover();
    };

    const handleOptionsToggle = () => {
        if (isOpen) {
            handleOptionsClose();
        } else {
            handleOptionsOpen();
        }
    };

    const handleRemoveOption = (option: Option) => {
        if (disabled || !canRemove) return;
        field.handleChange(multiple ? values.filter((v) => v !== option.value) : '');
        triggerRef.current?.focus();
        handleOptionsClose();
    };

    const handleSelect = (option: Option) => {
        if (disabled || option.disabled) return;
        if (values.includes(option.value)) {
            if (canRemove) field.handleChange(multiple ? values.filter((v) => v !== option.value) : '');
        } else {
            field.handleChange(multiple ? [...values, option.value] : option.value);
        }
        triggerRef.current?.focus();
        handleOptionsClose();
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (wrapperRef.current?.contains(e.relatedTarget)) return;
        handleOptionsClose();
        field.handleBlur();
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented) handleOptionsToggle();
    };

    const handleTagClick = () => {
        triggerRef.current?.focus();
        handleOptionsToggle();
    };

    const handleControlClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || (e.target as HTMLElement).closest('button')) return;
        handleTagClick();
    };

    // Match Autocomplete's open button: ArrowDown opens and focuses the first option.
    const handleKeyDownOnOpenButton = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleOptionsOpen();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleOptionsClose();
        }
    };

    // Traverse enabled options across groups; ArrowUp from the first closes the list.
    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, option: Option) => {
        const buttons = Array.from(optionsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
        const index = buttons.indexOf(e.currentTarget);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            buttons[Math.min(buttons.length - 1, index + 1)]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index > 0) {
                buttons[index - 1].focus();
            } else {
                triggerRef.current?.focus();
                handleOptionsClose();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSelect(option);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            triggerRef.current?.focus();
            handleOptionsClose();
        }
    };

    const handlePopoverMouseDown = (e: React.MouseEvent<HTMLDivElement>) => e.preventDefault();

    useEffect(() => {
        if (disabled) popoverRef.current?.hidePopover();
    }, [disabled]);

    const handlePointerDown = useEffectEvent((e: PointerEvent) => {
        if (!wrapperRef.current?.contains(e.target as Node)) handleOptionsClose();
    });

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isOpen]);

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
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
            >
                {option.label}
                {values.includes(option.value) && <CheckIcon className={theme.option.buttonIcon} />}
            </button>
        </li>
    );

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
                onBlur={handleBlur}
            >
                <div
                    className={`${theme.inputAndTagWrapper} ${disabled ? '' : 'cursor-pointer'}`}
                    style={{ anchorName: `--select_${generatedId}` }}
                    onClick={handleControlClick}
                >
                    {selectedOptions.map((option) => (
                        <Tag
                            key={option.value}
                            label={option.label}
                            disabled={disabled}
                            variant='outline'
                            onClick={handleTagClick}
                            onRemove={canRemove ? () => handleRemoveOption(option) : undefined}
                        />
                    ))}
                    <Button
                        {...props}
                        variant='transparent'
                        showChildren={false}
                        icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                        role='combobox'
                        id={selectId}
                        ref={triggerRef}
                        name={field.name}
                        disabled={disabled}
                        aria-expanded={isOpen}
                        aria-controls={`${selectId}-options`}
                        aria-haspopup='listbox'
                        aria-required={required}
                        additionalClassName={`${theme.button} flex-1 justify-end ${className ?? ''}`}
                        onClick={handleClick}
                        onKeyDown={handleKeyDownOnOpenButton}
                    >
                        {props.title}
                    </Button>
                </div>
                <div
                    popover='manual'
                    ref={popoverRef}
                    className={theme.optionsWrapper}
                    style={{ positionAnchor: `--select_${generatedId}`, maxHeight: '188px', overflowY: 'auto' }}
                    onMouseDown={handlePopoverMouseDown}
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
