import { useId, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { Button } from '../button';
import type { DropdownProps } from './Dropdown.types';

const theme = {
    wrapper: 'relative',
    button: 'w-full flex cursor-pointer flex-row gap-sm text-inherit fill-inherit focus:outline-none disabled:cursor-default',
    icon: 'w-xl fill-inherit',
    dropdown: 'tope-ui-dropdown absolute rounded-sm shadow-sm border p-sm',
    dropdownItems: 'flex max-h-[min(200px,50vh)] w-full flex-col',
    dropdownItem: (isDisabled: boolean = false, active: boolean = false) => {
        let state = 'has-focus-within:outline-2 has-hover:bg-secondary-extra-light';

        if (active) state = 'bg-primary text-white fill-white has-focus-within:outline-2 has-hover:bg-primary-dark';
        if (isDisabled) state = 'text-disabled';

        return `${state} rounded-sm px-sm py-md wrap-anywhere outline-primary focus:z-10`;
    }
} as const;

/**
 * Dropdown component that renders as button which open list of options when clicked. Using native popover feature.
 */
export const Dropdown: React.FC<DropdownProps> = ({ children, options, buttonProps, showChevron = true }) => {
    const baseId = useId();
    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverId = `${baseId}-popover`;

    return (
        <div className={theme.wrapper}>
            <Button
                {...buttonProps}
                showChildren={true}
                popoverTarget={popoverId}
                style={{ anchorName: `--dropdown_${baseId}` }}
            >
                {buttonProps?.showChildren !== false && children}
                {showChevron && <ChevronDownIcon className={theme.icon} />}
            </Button>
            <div
                id={popoverId}
                ref={popoverRef}
                popover='auto'
                className={theme.dropdown}
                style={{
                    positionAnchor: `--dropdown_${baseId}`
                }}
            >
                <ul className={theme.dropdownItems}>
                    {options.map((o) => {
                        const Icon = o.icon ?? null;
                        return (
                            <li
                                key={o.label}
                                className={theme.dropdownItem(o.disabled, o.active)}
                            >
                                <button
                                    type='button'
                                    aria-current={o.active ? 'page' : undefined}
                                    onClick={(e) => {
                                        popoverRef.current?.hidePopover();
                                        o.onClick(e);
                                    }}
                                    className={theme.button}
                                    disabled={o.disabled}
                                >
                                    {Icon && <Icon className={theme.icon} />}
                                    {o.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
