import { useId, useRef } from 'react';
import { Button } from '../button';
import type { DropdownProps } from './Dropdown.types';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export const Dropdown: React.FC<DropdownProps> = ({ children, options, buttonProps }) => {
    const baseId = useId();
    const popoverRef = useRef<HTMLDivElement>(null);
    const popoverId = `${baseId}-popover`;

    return (
        <div className='relative'>
            <Button
                {...buttonProps}
                popoverTarget={popoverId}
                style={{ anchorName: `--dropdown_${baseId}` }}
            >
                {children} <ChevronDownIcon className='w-xl fill-inherit' />
            </Button>
            <div
                id={popoverId}
                ref={popoverRef}
                popover='auto'
                className='absolute border rounded-sm p-sm tope-ui-dropdown'
                style={{
                    positionAnchor: `--dropdown_${baseId}`
                }}
            >
                <ul className='flex flex-col'>
                    {options.map((o) => {
                        const Icon = o.icon ?? null;
                        return (
                            <li
                                key={o.value}
                                className={`${o.disabled ? 'text-disabled' : 'has-hover:bg-secondary-extra-light has-focus-within:outline-2'} outline-primary rounded-sm py-md px-sm wrap-anywhere focus:z-10`}
                            >
                                <button
                                    onClick={(e) => {
                                        popoverRef.current?.hidePopover();
                                        o.action(e);
                                    }}
                                    className='flex flex-row gap-sm focus:outline-none cursor-pointer disabled:cursor-default'
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
