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

import { selectionTheme as theme } from '../selection-theme';

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
    const optionsRef = useRef<HTMLUListElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteId = isNotBlank(id) ? `${id}-visual` : `autocomplete-${_id}`;
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<OnSearchResult>({ hasNextPage: false, page: 0, options: [] });
    const [isInitialized, setIsInitialized] = useState(false);

    const [selectedOption, setSelectedOption] = useState<Option[]>([]);
    const [displayValue, setDisplayValue] = useState<string>('');

    // Handle input value changes by user
    const handleDisplayValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsOpen(true);
        setDisplayValue(e.currentTarget.value);
    };

    // Remove selected option and reset search state
    const handleRemoveOption = (option: Option) => {
        setSelectedOption(selectedOption.filter((o) => o.value !== option.value));
        setDisplayValue('');
        setOptions({ hasNextPage: false, page: 0, options: [] });
    };

    // Close dropdown and clear current option list
    const handleOptionsClose = () => {
        setIsOpen(false);
        setOptions({ hasNextPage: false, page: 0, options: [] });
    };

    // Open dropdown, fetch the initial options if needed, and focus the first available item
    const handleOptionsOpen = async () => {
        if (isOpen === false) {
            setIsOpen(true);
            await handleSearch(displayValue, true);
        }
        // Focus first option if exists
        if (optionsRef.current) {
            const firstOption = optionsRef.current.querySelector('button:not(:disabled)');
            if (firstOption) {
                (firstOption as HTMLElement).focus();
            }
        }
    };

    // Handle key down events for navigation
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            await handleOptionsOpen();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (options.options.length > 0 && isNotBlank(displayValue)) {
                handleSelect(options.options[0]);
            } else {
                handleSelect(null);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleOptionsClose();
        }
    };

    // Handle key down events for open button, allows to navigate by arrows to options
    const handleKeyDownOnOpenButton = async (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            await handleOptionsOpen();
        }
    };

    // Handle key down on options for navigation
    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, option: Option) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            let nextSibling: HTMLElement = e.currentTarget;
            do {
                const next = (nextSibling.parentElement?.nextElementSibling as HTMLElement | null | undefined) ?? null;
                if (next && next.firstElementChild?.tagName === 'BUTTON') {
                    nextSibling = next.firstElementChild as HTMLElement;
                } else {
                    break;
                }
            } while (nextSibling?.hasAttribute('disabled'));

            nextSibling.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            let previousSibling: HTMLElement | null = e.currentTarget;
            do {
                const prev = (previousSibling.parentElement?.previousElementSibling as HTMLElement | null | undefined) ?? null;
                if (prev && prev.firstElementChild?.tagName === 'BUTTON') {
                    previousSibling = prev.firstElementChild as HTMLElement;
                } else {
                    previousSibling = null;
                    break;
                }
            } while (previousSibling?.hasAttribute('disabled'));

            if (previousSibling) {
                previousSibling.focus();
            } else {
                // Focus input
                const inputElement = document.getElementById(autocompleteId);
                if (inputElement) {
                    inputElement.focus();
                }
                handleOptionsClose();
            }
        } else if (e.key === 'Enter') {
            if (option.disabled) {
                return;
            }
            e.preventDefault();
            handleSelect(option);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleOptionsClose();
            // Focus input
            const inputElement = document.getElementById(autocompleteId);
            if (inputElement) {
                inputElement.focus();
            }
        }
    };

    // Handle blur event to close dropdown
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // If target is inside optionsRef, do not close
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
                setSelectedOption(selectedOption.filter((o) => o.value !== option.value));
            } else if (option) {
                setSelectedOption([...selectedOption, option]);
            }
        } else if (option && selectedOption.some((o) => o.value === option.value)) {
            // unselect option
            setSelectedOption([]);
        } else if (option) {
            setSelectedOption(option ? [option] : []);
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

    // Handle external value changes and fetch corresponding options
    const onValueChange = useEffectEvent(async (newValues: string[], signal: AbortSignal) => {
        try {
            setIsFetching(true);
            if (newValues.length === 0) {
                if (selectedOption.length > 0) {
                    setSelectedOption([]);
                }
            } else {
                // Check if all newValues are already selected
                const allSelected =
                    newValues.every((v) => selectedOption.some((o) => o.value === v)) && newValues.length === selectedOption.length;
                if (!allSelected) {
                    const fetchedOptions = await Promise.all(newValues.map(async (v) => await onFetch(v, signal)));
                    if (!signal.aborted) {
                        setSelectedOption(fetchedOptions.filter((o): o is Option => o !== null));
                    }
                }
            }

            if (!signal.aborted) {
                setOptions({ hasNextPage: false, page: 0, options: [] });
                setDisplayValue('');
                setIsInitialized(true);
            }
        } catch (error) {
            if (!signal.aborted) {
                console.error(error);
            }
        } finally {
            if (!signal.aborted) {
                setIsFetching(false);
            }
        }
    });

    // Trigger onChange when selectedOption changes
    const handleChange = useEffectEvent((selectedOption: Option[], multiple: boolean) => {
        if (isInitialized === true) {
            if (multiple === false) {
                if (selectedOption.length === 0) {
                    if (value !== null) {
                        field.handleChange('');
                    }
                } else if (value !== selectedOption[0].value) {
                    field.handleChange(selectedOption[0].value);
                }
            } else {
                const allSelected =
                    Array.isArray(value) &&
                    value.every((v) => selectedOption.some((o) => o.value === v)) &&
                    value.length === selectedOption.length;

                if (!allSelected) {
                    field.handleChange(selectedOption.map((o) => o.value));
                }
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
                await onValueChange(newValue, abortController.signal);
            }
        })();

        return () => {
            abortController.abort();
        };
    }, [value]);

    // Trigger search when display value changes
    useEffect(() => {
        handleSearchEffectEvent(displayValue);
    }, [displayValue]);

    // Trigger onChange when selectedOption changes
    useEffect(() => {
        handleChange(selectedOption, multiple);
    }, [selectedOption, multiple]);

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
                        />
                        <Button
                            key={props.title}
                            variant='transparent'
                            showChildren={false}
                            icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                            onClick={() => (isOpen ? handleOptionsClose() : handleOptionsOpen())}
                            onKeyDown={handleKeyDownOnOpenButton}
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
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <ul
                        ref={optionsRef}
                        id={`${autocompleteId}-options`}
                        className={theme.options}
                    >
                        {!isSearching && !hasOptions && (
                            <li
                                key='___no_options___'
                                className={theme.option.noninteractive}
                            >
                                {localization.noOptions}
                            </li>
                        )}
                        {options.options.map((o) => (
                            <li
                                key={o.value}
                                className={theme.option.interactive(o.disabled)}
                            >
                                <button
                                    onClick={() => handleSelect(o)}
                                    onKeyDown={(e) => handleOptionKeyDown(e, o)}
                                    className={theme.option.button}
                                    disabled={o.disabled}
                                >
                                    {o.label}
                                    {selectedOption.some((so) => so.value === o.value) && <CheckIcon className={theme.option.buttonIcon} />}
                                </button>
                            </li>
                        ))}
                        {(isSearching || isLoadingNextPage) && (
                            <li
                                key='___loading___'
                                className={theme.option.noninteractive}
                            >
                                {localization.loading}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </ElementWrapper>
    );
};
