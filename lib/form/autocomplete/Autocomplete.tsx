import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { AutocompleteProps } from './Autocomplete.types';
import { isBlank, isNotBlank } from '../../utils/string-utils';
import type { Option } from '../../common/Option';
import { Button } from '../button/Button';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { Tag } from '../../visual';

const theme = {
    input: 'flex-1 focus:outline-none px-md min-h-[30px]',
    inputWrapper: 'flex-1 flex',
    button: 'min-w-[30px] min-h-[30px]',
    wrapper: 'w-full flex flex-col relative'
};

export const Autocomplete: React.FC<AutocompleteProps> = ({ id, label, error, value, onChange, onSearch, onFetch, ...props }) => {
    console.log('Autocomplete render', value);
    const _id = useId();
    const globalAbortController = useRef<AbortController | null>(null);
    const optionsRef = useRef<HTMLUListElement>(null);
    const autocompleteId = isNotBlank(id) ? `${id}-visual` : `autocomplete-${_id}`;
    const [isSearching, setIsSearching] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [displayValue, setDisplayValue] = useState<string>('');

    // Handle input value changes by user
    const handleDisplayValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleDisplayValueChange', e.currentTarget.value);
        setIsOpen(true);
        setDisplayValue(e.currentTarget.value);
    };

    const handleRemoveOption = (o: Option) => {
        console.log('handleRemoveOption', o);
        setSelectedOption(null);
        setDisplayValue('');
        setOptions([]);
        onChange(null);
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
        console.log('handleKeyDown', e.key);
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
        console.log('handleOptionKeyDown', e.key);
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
        console.log('handleBlur', e.relatedTarget);
        // If target is inside optionsRef, do not close
        if (optionsRef.current && optionsRef.current.contains(e.relatedTarget as Node)) {
            console.log('handleBlur - inside options');
            return;
        }
        handleOptionsClose();
        setDisplayValue('');
    };

    // Handle option selection from dropdown
    const handleSelect = (option: Option | null) => {
        console.log('handleSelect', option);
        handleOptionsClose();
        if (option?.value === selectedOption?.value) {
            return;
        }
        setSelectedOption(option);
        setDisplayValue('');
        setOptions([]);
        if (option === null) {
            onChange(null);
        } else {
            onChange(option.value);
        }
    };

    const handleSearch = async (query: string, force: boolean = false) => {
        console.log('handleSearch', isOpen, query);
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

    const onValueChange = useEffectEvent(async (newValue: string | null) => {
        console.log('onValueChange', newValue);
        if (isNotBlank(newValue) && newValue !== selectedOption?.value) {
            try {
                setIsFetching(true);
                const option = await onFetch(newValue.trim());
                setSelectedOption(option);
            } finally {
                setIsFetching(false);
            }
        } else if (isBlank(newValue)) {
            setSelectedOption(null);
        }
        setOptions([]);
        setDisplayValue('');
    });

    /** Handle external value changes */
    useEffect(() => {
        onValueChange(value);
    }, [value]);

    /** Trigger search when display value changes */
    useEffect(() => {
        handleSearchEffectEvent(displayValue);
    }, [displayValue]);

    const hasOptions = options.length > 0;

    return (
        <ElementWrapper
            label={label}
            error={error}
            required={props.required}
            disabled={props.disabled}
            elementId={autocompleteId}
        >
            <div className={theme.wrapper}>
                <div className={theme.inputWrapper}>
                    {selectedOption && (
                        <Tag
                            label={selectedOption.label}
                            onRemove={() => handleRemoveOption(selectedOption)}
                        />
                    )}
                    <input
                        className={theme.input}
                        {...props}
                        value={displayValue}
                        disabled={props.disabled || isFetching}
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
                        disabled={props.disabled || isFetching}
                        additionalClassName={theme.button}
                    >
                        {props.title}
                    </Button>
                </div>
                {isOpen && (
                    <ul
                        ref={optionsRef}
                        id={`${autocompleteId}-options`}
                        className='absolute top-[36px] -left-xs border rounded-sm flex flex-col w-[calc(100%+4px)]'
                    >
                        {isSearching && (
                            <li
                                key='___loading___'
                                className={`text-disabled p-md ${hasOptions ? 'border-b border-light' : ''}`}
                            >
                                Loading...
                            </li>
                        )}
                        {!isSearching && !hasOptions && (
                            <li
                                key='___no_options___'
                                className='text-disabled p-md'
                            >
                                No options
                            </li>
                        )}
                        {options.map((o) => (
                            <li
                                key={o.value}
                                onClick={() => handleSelect(o)}
                                onKeyDown={(e) => handleOptionKeyDown(e, o)}
                                className='hover:bg-secondary-extra-light cursor-pointer rounded-sm p-md'
                                tabIndex={0}
                            >
                                {o.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ElementWrapper>
    );
};
