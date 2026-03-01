import React, { useCallback, useId, useMemo, useState } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { CalendarProps, DateTimeInputProps } from './DateTimeInput.types';
import { Button } from '../../general';
import { CalendarDaysIcon } from '@heroicons/react/16/solid';
import { getMonth, getYear } from 'date-fns';
import { getMonthName } from '../../utils/calendar';
import type { Option } from '../../../lib/common/Option';

const theme = {
    action: {
        button: 'min-w-[30px] min-h-[30px]',
        iconWrapper: 'min-w-[30px] min-h-[30px] flex justify-center',
        icon: 'w-xl',
        leftWrapper: 'flex flex-row border-r',
        rightWrapper: 'flex flex-row border-l'
    },
    input: 'flex-1 focus:outline-none px-md min-h-[30px]'
} as const;

// budu controlled zadam z vonku value, onChange ale tie riesim uz v storyboooku
const Calendar: React.FC<CalendarProps> = ({ type, baseId, popoverId }) => {
    const year = getYear(new Date());
    const month = getMonth(new Date()) + 1;
    console.log(year, month, type);

    const monthOptions = useMemo(() => {
        const options: Option[] = [];
        for (let i = 1; i <= 12; i++) {
            options.push({ value: i.toString(), label: getMonthName(i) }); // TODO value moze byt len string v Option
        }
        return options;
    }, []);

    const yearOptions = useMemo(() => {
        const options: Option[] = [];
        for (let i = 1980; i <= 2050; i++) {
            options.push({ value: i.toString(), label: i.toString() }); // TODO value moze byt len string v Option
        }
        return options;
    }, []);

    return (
        <div
            id={popoverId}
            popover='auto'
            className='absolute border rounded-sm p-sm tope-ui-dropdown'
            style={{
                positionAnchor: `--dropdown_${baseId}`
            }}
        >
            <select defaultValue={month.toString()}>
                {monthOptions.map((option) => {
                    return (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className='p-xs rounded-sm'
                        >
                            {option.label}
                        </option>
                    );
                })}
            </select>
            <select defaultValue={year.toString()}>
                {yearOptions.map((option) => {
                    return (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            className='p-xs rounded-sm'
                        >
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

/**
 * Date DateTime input component that renders as HTMLInputElement element wrapped by parent div
 * containing optional label and error message.
 */
export const DateTimeInput: React.FC<DateTimeInputProps> = ({ id, label, error, type, ...props }) => {
    const _id = useId();
    const baseId = id || _id;
    const inputId = `input-${baseId}`;
    const popoverId = `${baseId}-popover`;
    const [processing, setProcessing] = useState(false); // TODO zatial s tym nic nerobim
    const [openCalendar, setOpenCalendar] = useState(false);

    const handleClick = useCallback(() => {
        setProcessing(true); // TODO zatial s tym nic nerobim
        try {
            setOpenCalendar((prev) => !prev);
        } finally {
            setProcessing(false); // TODO zatial s tym nic nerobim
        }
    }, []);
    return (
        <>
            <ElementWrapper
                label={label}
                error={error}
                required={props.required}
                disabled={props.disabled}
                elementId={inputId}
            >
                <input
                    className={theme.input}
                    {...props}
                    id={inputId}
                />
                <div className={`${theme.action.rightWrapper} relative`}>
                    <Button
                        key={props.title}
                        variant='transparent'
                        showChildren={false}
                        icon={CalendarDaysIcon}
                        onClick={handleClick}
                        disabled={processing || props.disabled}
                        additionalClassName={theme.action.button}
                        popoverTarget={popoverId}
                        style={{ anchorName: `--dropdown_${baseId}` }}
                    >
                        {props.title}
                    </Button>
                </div>
            </ElementWrapper>
            {openCalendar && (
                <Calendar
                    type={type}
                    baseId={baseId}
                    popoverId={popoverId}
                />
            )}
        </>
    );
};
