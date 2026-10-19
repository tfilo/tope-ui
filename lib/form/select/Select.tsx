import { useEffect, useId, useRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';

import { Button, Tag } from '../../general';
import type { Option } from '../../common/Option';
import { localization } from '../../utils/constants';
import type { SelectProps } from './Select.types';
import { useFieldContext } from '../../hooks/form-context';
import { useSelector } from '@tanstack/react-form';
import { ElementWrapper } from '../wrapper/ElementWrapper';

const theme = {
    wrapper: 'w-full flex flex-col relative',
    control: 'flex flex-1 items-center',
    tags: 'flex flex-1 flex-wrap min-w-0',
    trigger: 'min-w-[30px] min-h-[30px] rounded-sm',
    optionsWrapper: 'absolute border rounded-sm p-sm tope-ui-autocomplete shadow-sm max-h-[188px] overflow-y-auto',
    options: 'flex flex-col',
    group: 'font-bold py-md px-sm',
    option: (disabled?: boolean) =>
        `${disabled ? 'text-disabled' : 'has-hover:bg-secondary-extra-light has-focus-within:outline-2'} outline-primary rounded-sm py-md px-sm wrap-anywhere focus:z-10`,
    optionButton: 'min-h-[20px] focus:outline-none cursor-pointer disabled:cursor-default w-full text-left flex flex-row justify-between',
    optionIcon: 'w-xl fill-primary shrink-0',
    empty: 'text-disabled py-md px-sm'
} as const;

/** Fixed options with a shared tag and popover presentation for single and multiple selection. */
export const Select: React.FC<SelectProps> = ({ id: providedId, label, error, options, multiple = false, ...props }) => {
    const generatedId = useId();
    const id = providedId || `select-${generatedId}`;
    const anchorId = `--select_${generatedId}`;
    const disabled = props.disabled;

    const field = useFieldContext<string | string[]>();
    const fieldValue = useSelector(field.store, (state) => state.value);
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const value = multiple
        ? Array.isArray(fieldValue)
            ? fieldValue
            : []
        : typeof fieldValue === 'string' && fieldValue !== ''
          ? [fieldValue]
          : [];

    const onChange = (values: string[]) => field.handleChange(multiple ? values : (values[0] ?? ''));

    const wrapperRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const flatOptions = options.flatMap((option) => ('options' in option ? option.options : [option]));
    const isSelected = (option: Option) => value.includes(option.value);
    const accessibleLabel = props['aria-label'] ?? label ?? props.title ?? localization.selectOptions;

    const close = (restoreFocus = false) => {
        popoverRef.current?.hidePopover();

        if (restoreFocus) triggerRef.current?.focus();
    };

    const open = (last = false) => {
        if (disabled) return;

        popoverRef.current?.showPopover();

        const buttons = popoverRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        (last ? buttons?.[buttons.length - 1] : buttons?.[0])?.focus();
    };

    useEffect(() => {
        if (disabled) popoverRef.current?.hidePopover();
    }, [disabled]);

    const toggleOption = (option: Option) => {
        if (disabled || option.disabled) return;

        onChange(
            value.includes(option.value) ? value.filter((v) => v !== option.value) : multiple ? [...value, option.value] : [option.value]
        );

        close(true);
    };

    // Handle key down events for open button, allows to navigate by arrows to options
    const handleKeyDownOnOpenButton = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            open();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            open(true);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        }
    };

    // Handle key down on options for navigation
    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, option: Option) => {
        const buttons = Array.from(popoverRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
        const index = buttons.indexOf(e.currentTarget);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextOption = buttons[index + 1];

            if (nextOption) {
                nextOption.focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const previousOption = buttons[index - 1];

            if (previousOption) {
                previousOption.focus();
            } else {
                // Focus open button and close dropdown when moving above the first option
                close(true);
            }
        } else if (e.key === 'Enter') {
            if (option.disabled) {
                return;
            }
            e.preventDefault();
            toggleOption(option);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close(true);
        } else if (e.key === 'Home') {
            e.preventDefault();
            buttons[0]?.focus();
        } else if (e.key === 'End') {
            e.preventDefault();
            buttons[buttons.length - 1]?.focus();
        } else if (e.key === 'Tab') {
            close(true);
        }
    };

    const renderOption = (option: Option) => (
        <li
            key={option.value}
            role='none'
            className={theme.option(option.disabled)}
        >
            <button
                type='button'
                role='option'
                aria-selected={isSelected(option)}
                tabIndex={-1}
                disabled={option.disabled}
                className={theme.optionButton}
                onClick={() => toggleOption(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
            >
                {option.label}

                {isSelected(option) && (
                    <CheckIcon
                        aria-hidden='true'
                        className={theme.optionIcon}
                    />
                )}
            </button>
        </li>
    );

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={props.required}
            disabled={disabled}
            elementId={`${id}-visual`}
        >
            <div
                ref={wrapperRef}
                className={`${theme.wrapper} ${props.className ?? ''}`.trim()}
                style={props.style}
                onBlur={(event) => {
                    if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
                        close();
                        field.handleBlur();
                    }
                }}
            >
                <div
                    className={theme.control}
                    style={{ anchorName: anchorId }}
                    onClick={(event) => {
                        if (event.target === event.currentTarget || event.target === event.currentTarget.firstElementChild) open();
                    }}
                >
                    <div className={theme.tags}>
                        {value.map((selectedValue) => {
                            const option = flatOptions.find((option) => option.value === selectedValue);

                            return option ? (
                                <Tag
                                    key={selectedValue}
                                    label={option.label}
                                    variant='outline'
                                    disabled={disabled || option.disabled}
                                    onRemove={() => toggleOption(option)}
                                />
                            ) : null;
                        })}
                    </div>

                    <Button
                        ref={triggerRef}
                        id={`${id}-visual`}
                        role='combobox'
                        aria-label={accessibleLabel}
                        aria-labelledby={props['aria-labelledby']}
                        aria-describedby={props['aria-describedby']}
                        aria-invalid={props['aria-invalid'] ?? (Boolean(error) || errors.length > 0 || undefined)}
                        aria-required={props.required}
                        aria-expanded={isOpen}
                        aria-controls={`${id}-options`}
                        aria-haspopup='listbox'
                        disabled={disabled}
                        autoFocus={props.autoFocus}
                        tabIndex={props.tabIndex}
                        variant='transparent'
                        showChildren={false}
                        icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                        additionalClassName={theme.trigger}
                        onClick={() => (isOpen ? close() : open())}
                        onKeyDown={handleKeyDownOnOpenButton}
                    >
                        {props.title ?? accessibleLabel}
                    </Button>
                </div>

                <div
                    popover='auto'
                    ref={popoverRef}
                    className={theme.optionsWrapper}
                    style={{ positionAnchor: anchorId, maxHeight: props.size ? `${Math.max(1, props.size) * 36 + 8}px` : undefined }}
                    onToggle={(event) => setIsOpen(event.newState === 'open')}
                    onMouseDown={(event) => event.preventDefault()}
                >
                    <ul
                        id={`${id}-options`}
                        role='listbox'
                        aria-label={accessibleLabel}
                        aria-multiselectable={multiple || undefined}
                        className={theme.options}
                    >
                        {flatOptions.length === 0 && (
                            <li
                                role='none'
                                className={theme.empty}
                            >
                                {localization.noOptions}
                            </li>
                        )}

                        {options.map((option) =>
                            'options' in option ? (
                                <li
                                    key={option.label}
                                    role='none'
                                >
                                    <ul
                                        role='group'
                                        aria-label={option.label}
                                        className={theme.options}
                                    >
                                        <li
                                            role='presentation'
                                            className={theme.group}
                                        >
                                            {option.label}
                                        </li>

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
