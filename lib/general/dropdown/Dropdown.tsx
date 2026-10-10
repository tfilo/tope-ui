import { useId, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { Button } from '../button';
import type { DropdownProps } from './Dropdown.types';

const theme = {
    wrapper: 'relative',
    button: 'flex cursor-pointer flex-row gap-sm focus:outline-none disabled:cursor-default',
    icon: 'w-xl fill-inherit',
    dropdown: 'tope-ui-dropdown absolute rounded-sm border p-sm',
    dropdownItems: 'flex max-h-[min(200px,50vh)] w-full flex-col',
    dropdownItem: (isDisabled: boolean = false) =>
        `${isDisabled ? 'text-disabled' : 'has-focus-within:outline-2 has-hover:bg-secondary-extra-light'} rounded-sm px-sm py-md wrap-anywhere outline-primary focus:z-10`
} as const;

/**
 * Dropdown component that renders as button which open list of options when clicked. Using native popover feature.
 */
export const Dropdown: React.FC<DropdownProps> = ({ children, options, buttonProps }) => {
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
                {buttonProps?.showChildren !== false && children} <ChevronDownIcon className={theme.icon} />
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
                                className={theme.dropdownItem(o.disabled)}
                            >
                                <button
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
