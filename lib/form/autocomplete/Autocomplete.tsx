import { useEffect, useEffectEvent, useId, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@heroicons/react/16/solid';

import { isBlank, isNotBlank } from '../../utils/string-utils';
import { localization } from '../../utils/constants';
import type { Option } from '../../common/Option';
import { Button, Tag } from '../../general';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { AutocompleteProps, OnSearchResult } from './Autocomplete.types';
import { useFieldContext } from '../../hooks/form-context';
import { useSelector } from '@tanstack/react-form';

const theme = {
    input: 'flex-1 focus:outline-none px-md min-h-[30px] w-full min-w-[100px]',
    inputAndTagWrapper: 'flex-1 flex flex-wrap',
    inputWrapper: 'flex flex-1',
    button: 'min-w-[30px] min-h-[30px] rounded-sm',
    wrapper: 'w-full flex flex-col relative',
    optionsWrapper: 'absolute border rounded-sm p-sm tope-ui-autocomplete shadow-sm',
    options: 'flex flex-col',
    option: {
        noninteractive: 'text-disabled py-md px-sm',
        interactive: (disabled: boolean = false) =>
            `${disabled ? 'text-disabled' : 'has-hover:bg-secondary-extra-light has-focus-within:outline-2'} outline-primary rounded-sm py-md px-sm wrap-anywhere focus:z-10`,
        button: 'focus:outline-none cursor-pointer disabled:cursor-default w-full text-left flex flex-row justify-between',
        buttonIcon: 'w-xl fill-primary'
    }
} as const;

/**
 * Autocomplete component with ability to search and fetch items
 */
export const Autocomplete: React.FC<AutocompleteProps> = ({
    id,
    label,
    error,
    onSearch,
    onFetch,
    multiple = false,
    disabled = false,
    pageSize = 10,
    ...props
}) => {
    const _id = useId();

    const field = useFieldContext<string | string[]>();
    const rawErrors = useSelector(field.store, (state) => state.meta.errors);
    const isTouched = useSelector(field.store, (state) => state.meta.isTouched);
    const errors = isTouched
        ? rawErrors.map((e) => (typeof e === 'string' ? e : e?.message)).filter((e): e is string => typeof e === 'string' && e.length > 0)
        : [];

    const value = useMemo(
        () => (multiple ? (Array.isArray(field.state.value) ? field.state.value : []) : (field.state.value as string)),
        [field.state.value, multiple]
    );

    const searchAbortController = useRef<AbortController | null>(null);
    const nextPageAbortController = useRef<AbortController | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteId = isNotBlank(id) ? `${id}-visual` : `autocomplete-${_id}`;
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [options, setOptions] = useState<OnSearchResult>({ hasNextPage: false, page: 0, options: [] });

    const [selectedOption, setSelectedOption] = useState<Option[]>([]);
    const [displayValue, setDisplayValue] = useState<string>('');

    const enabledOptions = options.options.filter((option) => !option.disabled);
    const activeOption = isOpen ? enabledOptions[activeIndex] : undefined;
    const optionId = (option: Option) => `${autocompleteId}-option-${options.options.indexOf(option)}`;

    // Only user actions write selections back to the form. Lookups update display state only.
    const updateSelection = (options: Option[]) => {
        setSelectedOption(options);
        field.handleChange(multiple ? options.map((option) => option.value) : (options[0]?.value ?? ''));
    };

    // Handle input value changes by user
    const handleDisplayValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsOpen(true);
        setActiveIndex(-1);
        setDisplayValue(e.currentTarget.value);
    };

    // Remove selected option and reset search state
    const handleRemoveOption = (option: Option) => {
        updateSelection(selectedOption.filter((o) => o.value !== option.value));
        setDisplayValue('');
        setOptions({ hasNextPage: false, page: 0, options: [] });
    };

    // Close dropdown and clear current option list
    const handleOptionsClose = () => {
        setIsOpen(false);
        setActiveIndex(-1);
        setOptions({ hasNextPage: false, page: 0, options: [] });
    };

    // Keep DOM focus in the input; aria-activedescendant tracks keyboard navigation.
    const handleOptionsOpen = async () => {
        inputRef.current?.focus();

        if (!isOpen) {
            setIsOpen(true);
            await handleSearch(displayValue, true);
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            if (!isOpen) {
                setActiveIndex(0);
                await handleOptionsOpen();
            } else {
                setActiveIndex((index) => {
                    if (e.key === 'ArrowDown') {
                        return Math.min(index + 1, enabledOptions.length - 1);
                    }

                    return index <= 0 ? -1 : index - 1;
                });
            }
        } else if (e.key === 'Enter' && isOpen) {
            e.preventDefault();
            handleSelect(activeOption ?? (isNotBlank(displayValue) ? enabledOptions[0] : null) ?? null);
        } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            e.stopPropagation();
            handleOptionsClose();
        }
    };

    useEffect(() => {
        if (activeOption) {
            document
                .getElementById(`${autocompleteId}-option-${options.options.indexOf(activeOption)}`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }, [activeOption, autocompleteId, options.options]);

    // Handle blur event to close dropdown
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Keep the list open when focus moves within the control.
        if (wrapperRef.current?.contains(e.relatedTarget as Node)) {
            return;
        }
        handleOptionsClose();
        setDisplayValue('');
        field.handleBlur();
    };

    // Handle option selection from dropdown
    const handleSelect = (option: Option | null) => {
        if (option?.disabled) {
            return;
        }
        handleOptionsClose();
        if (multiple) {
            if (option && selectedOption.some((o) => o.value === option.value)) {
                // unselect option
                updateSelection(selectedOption.filter((o) => o.value !== option.value));
            } else if (option) {
                updateSelection([...selectedOption, option]);
            }
        } else if (option && selectedOption.some((o) => o.value === option.value)) {
            // unselect option
            updateSelection([]);
        } else if (option) {
            updateSelection(option ? [option] : []);
        }

        setDisplayValue('');
        setOptions({ hasNextPage: false, page: 0, options: [] });
        inputRef.current?.focus();
    };

    // Handle search for options based on user input
    const handleSearch = async (query: string, force: boolean = false) => {
        if (force === false && isOpen === false) {
            // Value is already selected or dropdown is closed, no need to search
            return;
        }
        const controller = new AbortController();
        if (searchAbortController.current) {
            searchAbortController.current.abort();
        }
        searchAbortController.current = controller;
        if (nextPageAbortController.current) {
            nextPageAbortController.current.abort();
            nextPageAbortController.current = null;
            setIsLoadingNextPage(false);
        }
        try {
            setIsSearching(true);
            const options = await onSearch(query, 0, pageSize, controller.signal);
            if (!controller.signal.aborted) {
                setOptions(options);
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsSearching(false);
            }
        }
    };

    const handleSearchEffectEvent = useEffectEvent(handleSearch);

    // The public onFetch API has no signal; invalidate its completion locally instead.
    const onValueChange = useEffectEvent(async (newValues: string[], signal: AbortSignal, externalValue: string | string[]) => {
        const isCurrent = () => !signal.aborted && field.state.value === externalValue;

        try {
            setIsFetching(newValues.length > 0);
            const allSelected =
                newValues.every((v) => selectedOption.some((o) => o.value === v)) && newValues.length === selectedOption.length;

            if (!allSelected) {
                const fetchedOptions = await Promise.all(newValues.map((v) => onFetch(v)));

                if (!isCurrent()) {
                    return;
                }

                setSelectedOption(fetchedOptions.filter((o): o is Option => o !== null));
            }

            if (isCurrent()) {
                setOptions({ hasNextPage: false, page: 0, options: [] });
                setDisplayValue('');
            }
        } finally {
            if (isCurrent()) {
                setIsFetching(false);
            }
        }
    });

    // Handle scroll event to load next page of options
    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 8;

        if (atBottom && !isSearching && !isLoadingNextPage && options.hasNextPage) {
            setIsLoadingNextPage(true);
            const controller = new AbortController();
            if (nextPageAbortController.current) {
                nextPageAbortController.current.abort();
            }
            nextPageAbortController.current = controller;
            try {
                const nextOptions = await onSearch(displayValue, options.page + 1, pageSize, controller.signal);
                if (!controller.signal.aborted) {
                    setOptions((oldOptions) => {
                        return {
                            hasNextPage: nextOptions.hasNextPage,
                            page: nextOptions.page,
                            options: [...oldOptions.options, ...nextOptions.options]
                        };
                    });
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingNextPage(false);
                }
            }
        }
    };

    // Handle external value changes
    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            const newValue: string[] = [];
            if (value === null || value === undefined || (typeof value === 'string' && isBlank(value))) {
                // keep newValue empty
            } else if (Array.isArray(value)) {
                newValue.push(...value.filter((v) => isNotBlank(v)).map((v) => v.trim()));
            } else {
                newValue.push(value.trim());
            }
            if (!abortController.signal.aborted) {
                onValueChange(newValue, abortController.signal, field.state.value);
            }
        })();

        return () => {
            abortController.abort();
        };
    }, [value, field.state.value]);

    // Trigger search when display value changes
    useEffect(() => {
        handleSearchEffectEvent(displayValue);
    }, [displayValue]);

    // Toggle popover open/close
    useEffect(() => {
        if (isOpen) {
            popoverRef.current?.showPopover();
        } else {
            popoverRef.current?.hidePopover();
        }
    }, [isOpen]);

    // Closes dropdown when disabled
    useEffect(() => {
        (async () => {
            if (disabled) {
                handleOptionsClose();
            }
        })();
    }, [disabled]);

    const hasOptions = options.options.length > 0;

    return (
        <ElementWrapper
            label={label}
            error={error ?? errors}
            required={props.required}
            disabled={disabled}
            elementId={autocompleteId}
        >
            <div
                className={theme.wrapper}
                ref={wrapperRef}
                onBlur={handleBlur}
            >
                <div
                    className={theme.inputAndTagWrapper}
                    style={{ anchorName: `--autocomplete_${_id}` }}
                >
                    {selectedOption.map((option) => (
                        <Tag
                            key={option.value}
                            label={option.label}
                            disabled={disabled}
                            onRemove={() => handleRemoveOption(option)}
                            variant='outline'
                        />
                    ))}
                    <div className={theme.inputWrapper}>
                        <input
                            className={theme.input}
                            {...props}
                            value={displayValue}
                            name={field.name}
                            disabled={disabled || isFetching}
                            onChange={handleDisplayValueChange}
                            onKeyDown={handleKeyDown}
                            id={autocompleteId}
                            ref={inputRef}
                            role='combobox'
                            aria-autocomplete='list'
                            aria-haspopup='listbox'
                            aria-expanded={isOpen}
                            aria-controls={`${autocompleteId}-options`}
                            aria-activedescendant={activeOption ? optionId(activeOption) : undefined}
                        />
                        <Button
                            key={props.title}
                            variant='transparent'
                            showChildren={false}
                            icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                            onClick={() => {
                                inputRef.current?.focus();

                                if (isOpen) {
                                    handleOptionsClose();
                                } else {
                                    void handleOptionsOpen();
                                }
                            }}
                            onPointerDown={(e) => e.preventDefault()}
                            onMouseDown={(e) => e.preventDefault()}
                            tabIndex={-1}
                            aria-label={props.title ?? localization.selectOptions}
                            aria-haspopup='listbox'
                            aria-expanded={isOpen}
                            aria-controls={`${autocompleteId}-options`}
                            disabled={disabled || isFetching}
                            additionalClassName={theme.button}
                        >
                            {props.title}
                        </Button>
                    </div>
                </div>
                <div
                    popover='manual'
                    ref={popoverRef}
                    className={theme.optionsWrapper}
                    style={{
                        positionAnchor: `--autocomplete_${_id}`,
                        maxHeight: `${Math.min(pageSize - 1, 5) * 36 + 8}px`
                    }}
                    onScroll={handleScroll}
                    onPointerDown={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <ul
                        id={`${autocompleteId}-options`}
                        className={theme.options}
                        role='listbox'
                        aria-label={label ?? props['aria-label'] ?? props.title ?? localization.selectOptions}
                        aria-multiselectable={multiple}
                        aria-busy={isSearching || isLoadingNextPage}
                    >
                        {options.options.map((o) => (
                            <li
                                key={o.value}
                                className={`${theme.option.interactive(o.disabled)} ${activeOption === o ? 'outline-2 outline-primary' : ''}`}
                                role='presentation'
                            >
                                <button
                                    type='button'
                                    onClick={() => handleSelect(o)}
                                    id={optionId(o)}
                                    role='option'
                                    tabIndex={-1}
                                    aria-selected={selectedOption.some((so) => so.value === o.value)}
                                    aria-disabled={o.disabled || undefined}
                                    className={theme.option.button}
                                    disabled={o.disabled}
                                >
                                    {o.label}
                                    {selectedOption.some((so) => so.value === o.value) && <CheckIcon className={theme.option.buttonIcon} />}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {!isSearching && !hasOptions && (
                        <div
                            role='status'
                            className={theme.option.noninteractive}
                        >
                            {localization.noOptions}
                        </div>
                    )}
                    {(isSearching || isLoadingNextPage) && (
                        <div
                            role='status'
                            className={theme.option.noninteractive}
                        >
                            {localization.loading}
                        </div>
                    )}
                </div>
            </div>
        </ElementWrapper>
    );
};
