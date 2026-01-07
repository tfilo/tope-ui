import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { AutocompleteProps } from './Autocomplete.types';
import { isBlank, isNotBlank } from '../../utils/string-utils';
import type { Option } from '../../common/Option';
import { Button } from '../button/Button';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { Tag } from '../../visual';

const theme = {
    input: 'flex-1 focus:outline-none px-md min-h-[30px] w-full min-w-[100px]',
    inputWrapper: 'flex-1 flex flex-wrap',
    button: 'min-w-[30px] min-h-[30px] rounded-sm',
    wrapper: 'w-full flex flex-col relative'
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
    id,
    label,
    error,
    value,
    onChange,
    onSearch,
    onFetch,
    multiple = false,
    disabled = false,
    ...props
}) => {
    const _id = useId();
    const globalAbortController = useRef<AbortController | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);
    const autocompleteId = isNotBlank(id) ? `${id}-visual` : `autocomplete-${_id}`;
    const [isSearching, setIsSearching] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const [selectedOption, setSelectedOption] = useState<Option[]>([]);
    const [displayValue, setDisplayValue] = useState<string>('');

    // Handle input value changes by user
    const handleDisplayValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsOpen(true);
        setDisplayValue(e.currentTarget.value);
    };

    const handleRemoveOption = (option: Option) => {
        setSelectedOption(selectedOption.filter((o) => o.value !== option.value));
        setDisplayValue('');
        setOptions([]);
    };

    const handleOptionsClose = () => {
        setIsOpen(false);
        setOptions([]);
    };

    const handleOptionsOpen = async () => {
        if (isOpen === false) {
            setIsOpen(true);
            await handleSearch(displayValue, true);
        }
        // Focus first option if exists
        if (optionsRef.current) {
            const firstOption = optionsRef.current.querySelector('li');
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
            if (options.length > 0 && isNotBlank(displayValue)) {
                handleSelect(options[0]);
            } else {
                handleSelect(null);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleOptionsClose();
        }
    };

    // Handle key down on options for navigation
    const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, option: Option) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextSibling = (e.currentTarget.nextSibling as HTMLElement) || null;
            if (nextSibling) {
                nextSibling.focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const previousSibling = (e.currentTarget.previousSibling as HTMLElement) || null;
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
        if (optionsRef.current && optionsRef.current.contains(e.relatedTarget as Node)) {
            return;
        }
        handleOptionsClose();
        setDisplayValue('');
    };

    // Handle option selection from dropdown
    const handleSelect = (option: Option | null) => {
        handleOptionsClose();
        if (multiple) {
            if (option && selectedOption.findIndex((o) => o.value === option.value) !== -1) {
                // unselect option
                setSelectedOption(selectedOption.filter((o) => o.value !== option.value));
            } else if (option) {
                setSelectedOption([...selectedOption, option]);
            }
        } else {
            if (option && selectedOption.findIndex((o) => o.value === option.value) !== -1) {
                return;
            }
            setSelectedOption(option ? [option] : []);
        }
        setDisplayValue('');
        setOptions([]);
    };

    const handleSearch = async (query: string, force: boolean = false) => {
        if (force === false && isOpen === false) {
            // Value is already selected or dropdown is closed, no need to search
            return;
        }
        const controller = new AbortController();
        if (globalAbortController.current) {
            globalAbortController.current.abort();
        }
        globalAbortController.current = controller;
        try {
            setIsSearching(true);
            const options = await onSearch(query, controller.signal);
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

    const onValueChange = useEffectEvent(async (newValues: string[]) => {
        if (newValues.length === 0) {
            if (selectedOption.length > 0) {
                setSelectedOption([]);
            }
        } else {
            try {
                setIsFetching(true);
                // Check if all newValues are already selected
                const allSelected =
                    newValues.every((v) => selectedOption.findIndex((o) => o.value === v) !== -1) &&
                    newValues.length === selectedOption.length;
                if (!allSelected) {
                    const fetchedOptions = await Promise.all(newValues.map(async (v) => await onFetch(v)));
                    setSelectedOption(fetchedOptions.filter((o): o is Option => o !== null));
                }
            } finally {
                setIsFetching(false);
            }
        }

        setOptions([]);
        setDisplayValue('');
        setIsInitialized(true);
    });

    const handleChange = useEffectEvent((selectedOption: Option[], multiple: boolean) => {
        if (isInitialized === true) {
            if (multiple === false) {
                if (selectedOption.length === 0) {
                    if (value !== null) {
                        console.log('Calling onChange with null');
                        (onChange as (value: string | null) => void)(null);
                    }
                } else {
                    if (value !== selectedOption[0].value) {
                        console.log('Calling onChange with ', selectedOption[0].value);
                        (onChange as (value: string | null) => void)(selectedOption[0].value);
                    }
                }
            } else {
                const allSelected =
                    Array.isArray(value) &&
                    value.every((v) => selectedOption.findIndex((o) => o.value === v) !== -1) &&
                    value.length === selectedOption.length;

                if (!allSelected) {
                    (onChange as (value: string[]) => void)(selectedOption.map((o) => o.value));
                }
            }
        }
    });

    /** Handle external value changes */
    useEffect(() => {
        if (value === null || value === undefined || (typeof value === 'string' && isBlank(value))) {
            onValueChange([]);
        } else if (Array.isArray(value)) {
            onValueChange(value.filter((v) => isNotBlank(v)).map((v) => v.trim()));
        } else {
            onValueChange([value.trim()]);
        }
    }, [value]);

    /** Trigger search when display value changes */
    useEffect(() => {
        handleSearchEffectEvent(displayValue);
    }, [displayValue]);

    /** Trigger onChange when selectedOption changes */
    useEffect(() => {
        handleChange(selectedOption, multiple);
    }, [selectedOption, multiple]);

    /** Toggle popover open/close  */
    useEffect(() => {
        if (isOpen) {
            popoverRef.current?.showPopover();
        } else {
            popoverRef.current?.hidePopover();
        }
    }, [isOpen]);

    useEffect(() => {
        if (disabled) {
            handleOptionsClose();
        }
    }, [disabled]);

    const hasOptions = options.length > 0;

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={props.required}
            disabled={disabled}
            elementId={autocompleteId}
        >
            <div className={theme.wrapper}>
                <div
                    className={theme.inputWrapper}
                    style={{ anchorName: `--autocomplete_${_id}` }}
                >
                    {selectedOption.map((option) => (
                        <Tag
                            key={option.value}
                            label={option.label}
                            disabled={disabled}
                            onRemove={() => handleRemoveOption(option)}
                        />
                    ))}
                    <div className='flex flex-1'>
                        <input
                            className={theme.input}
                            {...props}
                            value={displayValue}
                            disabled={disabled || isFetching}
                            onChange={handleDisplayValueChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            id={autocompleteId}
                        />
                        <Button
                            key={props.title}
                            variant='transparent'
                            showChildren={false}
                            icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                            onClick={() => (isOpen ? handleOptionsClose() : handleOptionsOpen())}
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
                    className='absolute border rounded-sm p-sm'
                    style={{
                        positionAnchor: `--autocomplete_${_id}`,
                        top: 'calc(anchor(bottom) + 4px)',
                        left: 'calc(anchor(left) - 2px)',
                        right: 'calc(anchor(right) - 2px)',
                        width: 'auto'
                    }}
                >
                    <ul
                        ref={optionsRef}
                        id={`${autocompleteId}-options`}
                        className='flex flex-col'
                    >
                        {isSearching && (
                            <li
                                key='___loading___'
                                className={`text-disabled py-md px-sm ${hasOptions ? 'border-b border-light' : ''}`}
                            >
                                Loading...
                            </li>
                        )}
                        {!isSearching && !hasOptions && (
                            <li
                                key='___no_options___'
                                className='text-disabled py-md px-sm'
                            >
                                No options
                            </li>
                        )}
                        {options.map((o) => (
                            <li
                                key={o.value}
                                onClick={() => handleSelect(o)}
                                onKeyDown={(e) => handleOptionKeyDown(e, o)}
                                className='hover:bg-secondary-extra-light cursor-pointer rounded-sm py-md px-sm wrap-anywhere'
                                tabIndex={0}
                            >
                                {o.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </ElementWrapper>
    );
};
