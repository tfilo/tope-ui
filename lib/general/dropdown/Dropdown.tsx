import { useId } from 'react';
import { Button } from '../button';
import type { DropdownProps } from './Dropdown.types';

export const Dropdown: React.FC<DropdownProps> = ({ children, options, buttonProps }) => {
    const baseId = useId();
    const popoverId = `${baseId}-popover`;

    return (
        <div className='relative'>
            <Button
                {...buttonProps}
                popoverTarget={popoverId}
                style={{ anchorName: `--dropdown_${baseId}` }}
            >
                {children}
            </Button>
            <div
                id={popoverId}
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
                                onClick={() => /* handleSelect(o) */ {}}
                                onKeyDown={() => /* handleOptionKeyDown(e, o) */ {}}
                                className={`${o.disabled ? 'text-disabled' : 'hover:bg-secondary-extra-light cursor-pointer'} rounded-sm py-md px-sm wrap-anywhere focus:z-10 flex flex-row gap-sm`}
                                tabIndex={0}
                            >
                                {Icon && <Icon className='w-xl fill-inherit' />}
                                {o.label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
