import { useId, useRef } from 'react';
import { Button } from '../button';
import type { DropdownProps } from './Dropdown.types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

/**
 * Dropdown component that renders as button which open list of options when clicked. Using native popover feature.
 */
export const Dropdown: React.FC<DropdownProps> = ({ children, options, buttonProps }) => {
    const baseId = useId();
    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverId = `${baseId}-popover`;

    return (
        <div className='relative'>
            <Button
                {...buttonProps}
                showChildren={true}
                popoverTarget={popoverId}
                style={{ anchorName: `--dropdown_${baseId}` }}
            >
                {buttonProps?.showChildren !== false && children} <ChevronDownIcon className='w-xl fill-inherit' />
            </Button>
            <div
                id={popoverId}
                ref={popoverRef}
                popover='auto'
                className='tope-ui-dropdown absolute rounded-sm border p-sm'
                style={{
                    positionAnchor: `--dropdown_${baseId}`
                }}
            >
                <ul className='flex max-h-[min(200px,50vh)] w-full flex-col'>
                    {options.map((o) => {
                        const Icon = o.icon ?? null;
                        return (
                            <li
                                key={o.label}
                                className={`${o.disabled ? 'text-disabled' : 'has-focus-within:outline-2 has-hover:bg-secondary-extra-light'} rounded-sm px-sm py-md wrap-anywhere outline-primary focus:z-10`}
                            >
                                <button
                                    onClick={(e) => {
                                        popoverRef.current?.hidePopover();
                                        o.onClick(e);
                                    }}
                                    className='flex cursor-pointer flex-row gap-sm focus:outline-none disabled:cursor-default'
                                    disabled={o.disabled}
                                >
                                    {Icon && <Icon className='w-xl fill-inherit' />}
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
