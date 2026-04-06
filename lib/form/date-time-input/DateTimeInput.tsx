import React, { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { ElementWrapper } from '../wrapper/ElementWrapper';
import type { DateTimeInputProps, Day, Month, Slot } from './DateTimeInput.types';
import { Button } from '../../general';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import {
    addMonths,
    format,
    getDate,
    getDay,
    getDaysInMonth,
    getHours,
    getMinutes,
    getMonth,
    getSeconds,
    getYear,
    isValid,
    parse,
    parseISO,
    subMonths
} from 'date-fns';
import { localization } from '../../utils/constants';

const isoDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss";
const isoDateFormat = 'yyyy-MM-dd';
const minYear = 1900;
const maxYear = 2100;

const WeekDay = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
} as const;

export type WeekDayType = (typeof WeekDay)[keyof typeof WeekDay];

const MonthDirection = {
    PREVIOUS: 'PREVIOUS',
    NEXT: 'NEXT'
} as const;

type MonthDirectionType = (typeof MonthDirection)[keyof typeof MonthDirection];

const yearsRange: number[] = [];
for (let i = minYear; i <= maxYear; i++) {
    yearsRange.push(i);
}

const allMonths: Month[] = [];
for (let i = 0; i < 12; i++) {
    allMonths.push({ label: localization.dateTimeInput.monthAbbreviations[i], val: i });
}
const monthRows = [
    allMonths.slice(0, 4), // Jan - Apr
    allMonths.slice(4, 8), // May - Aug
    allMonths.slice(8, 12) // Sep - Dec
];

// TODO nechat mimo komponent alebo v komponente aby sa to menilo alebo priamo pouzit v aplikacii ???
const todayDate = getDate(new Date());
const todayMonth = getMonth(new Date());
const todayYear = getYear(new Date());
const currentTime = getHours(new Date()) * 60 + getMinutes(new Date());

const bgColor = {
    none: '',
    selected: '!bg-primary-light',
    today: '!bg-secondary-extra-light'
};

/**
 * Generate time slots
 * @param {number} interval number in minutes between slots
 * @returns {Slot[]} array with defined slot interval
 * - label: human readable time (HH:mm)
 * - minute: total time in minutes from start of the day
 * * * @example
 * // Returns [{ label: "00:00", minute: 0 }, { label: "00:15", minute: 15 }, ...]
 * generateTimeSlots(15);
 * * @example
 * // Returns [{ label: "00:00", minute: 0 }, { label: "01:00", minute: 60 }, ...]
 * generateTimeSlots(60);
 */
const generateTimeSlots = (interval: number): Slot[] => {
    const slots: Slot[] = [];
    const minutesInDay = 24 * 60; // 1440 minutes a day

    for (let totalMinutes = 0; totalMinutes < minutesInDay; totalMinutes += interval) {
        // Calculate hours and remaining minutes
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;

        const hh = hour.toString().padStart(2, '0');
        const mm = minute.toString().padStart(2, '0');

        slots.push({ label: `${hh}:${mm}`, minute: totalMinutes });
    }
    return slots;
};

/**
 * Normalizes a user-input date string into a ISO string.
 * * * This function performs the following:
 * 1. **Parsing**: Uses the provided `inputFormatPattern` to interpret the raw string.
 * 2. **Validation**: Ensures the date is logically valid and falls within a realistic year range (minYear-maxYear).
 * 3. **Standardization**: Returns a strictly formatted ISO string based on whether time is required.
 * * @param {string | undefined} dateTime - The raw date/time string from the input field.
 * @param {boolean} hasTime - Flag to determine the output format (Date vs DateTime).
 * @param {string} inputFormatPattern - The pattern used to parse the input (e.g., 'dd.MM.yyyy HH:mm:ss').
 * @returns {string | null} A string in "yyyy-MM-dd" or "yyyy-MM-dd'T'HH:mm:ss" format, or null if invalid.
 * * @example
 * // Input: "26.03.2026", Pattern: "dd.MM.yyyy" -> Returns "2026-03-26"
 * formatToISO("26.03.2026", false, defaultDateInputPattern);
 * * @example
 * // Input: "2026-03-26", Pattern: "yyyy-MM-dd" -> Returns "2026-03-26"
 * formatToISO("2026-03-26", false, isoDateFormat);
 */
const formatToISO = (dateTime: string | undefined, hasTime: boolean, inputFormatPattern: string): string | null => {
    if (!dateTime) return null;
    const parsedDate = parse(dateTime, inputFormatPattern, new Date()); // convert string into Date object according formatPattern
    // Validation: Check if the date is valid AND the year is realistic (e.g., not 0225)
    if (!isValid(parsedDate) || getYear(parsedDate) < minYear || getYear(parsedDate) > maxYear) {
        console.error('Invalid format or unrealistic year');
        return null;
    } else {
        return hasTime ? format(parsedDate, isoDateTimeFormat) : format(parsedDate, isoDateFormat);
    }
};

/**
 * Converts a ISO date string (YYYY-MM-DD[THH:mm:ss]) into a user-friendly
 * display format based on a dynamic pattern.
 * @param {string | null} dateTime - The ISO date string to be formatted (from an API).
 * @param {string} inputFormatPattern - The desired display pattern (e.g., 'dd.MM.yyyy HH:mm:ss').
 * @returns {string} The formatted date string, or an empty string if the input is invalid or null.
 * @example
 * // Returns "26.03.2026"
 * formatFromISO("2026-03-26", "dd.MM.yyyy");
 * @example
 * // Returns "26.03.2026 09:30:12"
 * formatFromISO("2026-03-26T09:30:12", "dd.MM.yyyy HH:mm:ss");
 * @example
 * // Returns "" (empty string)
 * formatFromISO(null, "dd.MM.yyyy");
 */
const formatFromISO = (dateTime: string | null, inputFormatPattern: string): string => {
    // dateTime is in format 2026-02-09T09:30:12
    if (!dateTime) return '';
    try {
        // Convert ISO string to Date object first to ensure compatibility with date-fns format()
        const date = parseISO(dateTime);

        // Check if the parsed date is actually valid
        if (!isValid(date) || getYear(date) < minYear || getYear(date) > maxYear) return '';
        return format(date, inputFormatPattern);
    } catch (error) {
        console.error('Error formatting ISO date:', error);
        return '';
    }
};

/**
 * Formats a date and time into a string based on a provided pattern.
 * * @param {number | null} year - The selected year.
 * @param {number | null} month - The 0-indexed month (0-11).
 * @param {number | null} date - The day of the month (1-31).
 * @param {number | null} minutes - Total minutes from midnight.
 * @param {string} inputFormatPattern - The expected date-fns pattern (e.g., "dd.MM.yyyy" or "yyyy-MM-dd").
 * @returns {string} The formatted date string.
 */

const formatDate = (
    year: number | null,
    month: number | null,
    date: number | null,
    minutes: number | null,
    seconds: number | null,
    inputFormatPattern: string
) => {
    if (year !== null && month !== null && date !== null) {
        // if minutes or seconds are null, use 0 as midnight
        const hour = minutes === null ? 0 : Math.floor(minutes / 60);
        const min = minutes === null ? 0 : minutes % 60;
        const sec = seconds ?? 0;
        // Create date Object
        const dateObj = new Date(year, month, date, hour, min, sec);

        // check, if dateObj is valid
        if (!isValid(dateObj) || year < minYear || year > maxYear) {
            throw new Error('Invalid date components provided.');
        }
        // format date
        return format(dateObj, inputFormatPattern);
    } else {
        throw new Error('It is not possible to format date.');
    }
};

/**
 * DateTimeInput - A date and time picker component.
 * * @example
 * // Basic usage with only a date
 * <DateTimeInput value="2026-03-26" />
 * * @example
 * // Usage with 30-minute time slots and Monday as the last day
 * <DateTimeInput
 * value="2026-03-26T14:30"
 * hasTime={true}
 * slots={30}
 * lastDayInWeek={DaysEnum.Monday}
 * />
 */

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

/**
 * Date DateTime input component that renders as HTMLInputElement element wrapped by parent div
 * containing optional label and error message.
 */
const DateTimeInput: React.FC<DateTimeInputProps> = ({
    id,
    label,
    error,
    type = 'date',
    lastDayInWeek = WeekDay.Sunday,
    slots = 15,
    inputFormat,
    placeholder,
    value,
    onChange,
    ...props
}) => {
    const hasTime = useMemo(() => {
        return type === 'dateTime';
    }, [type]);
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenMonth, setIsOpenMonth] = useState(false);

    const [selectedDate, setSelectedDate] = useState<number | null>(value ? getDate(parseISO(value)) : null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(value ? getMonth(parseISO(value)) : null); // Start from 0
    const [selectedYear, setSelectedYear] = useState<number | null>(value ? getYear(parseISO(value)) : null);
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(
        value && hasTime ? getHours(value) * 60 + getMinutes(value) : null
    );
    const [selectedSeconds, setSelectedSeconds] = useState<number | null>(value && hasTime ? getSeconds(parseISO(value)) : null);

    /**
     * Determines the active date-fns format pattern for parsing and formatting.
     * * Logic flow:
     * 1. If a custom `inputFormat` is provided via props, it takes the highest priority.
     * 2. If no custom format exists, it falls back to a predefined default pattern
     * based on whether the component is in "DateTime" or "Date-only" mode (`hasTime`).
     */
    const inputFormatPattern = useMemo(() => {
        if (inputFormat) {
            return inputFormat;
        } else {
            return hasTime ? localization.dateTimeInput.defaultDateTimeInputPattern : localization.dateTimeInput.defaultDateInputPattern;
        }
    }, [hasTime, inputFormat]);

    const [inputValue, setInputValue] = useState<string>(formatFromISO(value, inputFormatPattern));
    const activeDayRef = useRef<HTMLLIElement>(null);
    const activeYearRef = useRef<HTMLLIElement>(null);

    const _id = useId();
    const baseId = id || _id;
    const inputId = `input-${baseId}`;
    const popoverId = `${baseId}-popover`;
    const [processing, setProcessing] = useState(false); // TODO zatial s tym nic nerobim

    /**
     * Toggles the visibility of the calendar picker.
     * * 1. **State Inversion**: Uses a functional update to switch the `isOpen`
     * state between `true` and `false`.
     * 2. **UI Interaction**: This handler is triggered by clicking the calendar icon.
     */
    const handleCalendar = useCallback(() => {
        setProcessing(true); // TODO zatial s tym nic nerobim
        try {
            setIsOpen((prev) => !prev);
        } finally {
            setProcessing(false); // TODO zatial s tym nic nerobim
        }
    }, []);

    /**
     * Determines the input placeholder string.
     * * Logic flow:
     * 1. If a custom `placeholder` is provided via props, it takes the highest priority.
     * 2. If no custom placeholder exists, it falls back to a predefined default placeholder
     * based on whether the component is in "DateTime" or "Date-only" mode (`hasTime`).
     */
    const inputPlaceholder = useMemo(() => {
        if (placeholder) {
            return placeholder;
        } else {
            return hasTime
                ? localization.dateTimeInput.defaultDateTimeInputPlaceholder
                : localization.dateTimeInput.defaultDateInputPlaceholder;
        }
    }, [hasTime, placeholder]);

    /**
     * Synchronizes the visible input field whenever the external date (`value`)
     * or the formatting pattern changes.
     * * This ensures that the text shown to the user is always a correctly
     * formatted representation of the internal date state.
     */
    useEffect(() => {
        setInputValue(formatFromISO(value, inputFormatPattern));
    }, [inputFormatPattern, value]);

    /**
     * Memoized array of abbreviated day names, rotated to match the custom week layout.
     * * The logic shifts the standard day array (starting with Monday) based on the
     * `lastDayInWeek` prop. It calculates the starting day and reorders the abbreviations
     * to ensure the calendar grid aligns correctly with the user's preference.
     *  @example
     * // If lastDayInWeek is Sunday (0), firstDay is 1 (Monday). Result: [Mon, Tue, ..., Sun]
     * // If lastDayInWeek is Saturday (6), firstDay is 0 (Sunday). Result: [Sun, Mon, ..., Sat]
     */
    const days = useMemo(() => {
        // Get the standard abbreviations (e.g., ["Ne", "Po", "Ut", "St", ...])
        const allDays = localization.dateTimeInput.dayAbbreviations;
        // Calculate the index of the first day to display.
        // If Saturday is the last day, Sunday (index 0) becomes the first day.
        // Otherwise, the first day is simply the day following the chosen last day.
        const firstDayInweek = lastDayInWeek === WeekDay.Saturday ? 0 : lastDayInWeek + 1;
        // Split and reassemble the array to rotate it
        const daysAfter = allDays.slice(firstDayInweek);
        const daysBefore = allDays.slice(0, firstDayInweek);
        return [...daysAfter, ...daysBefore];
    }, [lastDayInWeek]);

    /**
     * Memoized array of days for the currently selected or active month.
     * * The logic determines the number of days in the specific year and month,
     * then iterates through each day to create an object containing:
     * - `date`: The numerical day of the month (1-31).
     * - `day`: The day of the week index (0-6, where 0 is Sunday),
     * calculated using the `getDay` utility from date-fns.
     * * It falls back to the current date (today) if no year or month is explicitly selected.
     */
    const monthsDays = useMemo(() => {
        // Fallback to today's date if selectedYear/Month are null
        const usedYear = selectedYear ?? todayYear;
        const usedMonth = selectedMonth ?? todayMonth;

        const daysArray: Day[] = [];
        // Get total number of days in the specific month (e.g., 28, 30, or 31)
        const daysInMonth = getDaysInMonth(new Date(usedYear, usedMonth));

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(usedYear, usedMonth, i);
            daysArray.push({
                date: i, // Numerical date (e.g., 15)
                day: getDay(currentDay) // Day of week index (e.g., 0 for Sunday)
            });
        }

        return daysArray;
    }, [selectedMonth, selectedYear]);

    /**
     * Transforms the flat array of month days into a 2D array representing calendar weeks.
     * * This function performs several key tasks:
     * 1. **Week Chunking**: It identifies the `lastDayInWeek` to determine where one row ends and the next begins.
     * 2. **Start Padding**: If the first week doesn't start on the first day of the week, it prepends dates
     * from the end of the previous month.
     * 3. **End Padding**: If the last week is incomplete, it appends dates from the start of the next month.
     * * @returns {Day[][] | undefined} A 2D array where each inner array represents a week (7 days).
     */
    const getDaysInMonthArray = useCallback(() => {
        const usedYear = selectedYear ?? todayYear;
        const usedMonth = selectedMonth ?? todayMonth;

        if (monthsDays) {
            const calendarArray = [];
            // Find all indexes where a day matches the 'lastDayInWeek'
            const indexes = monthsDays.flatMap((item, i) => (item.day === lastDayInWeek ? [i] : []));
            let lastIndex = 0;
            indexes.forEach((stopIndex) => {
                const weekArray: Day[] = monthsDays.slice(lastIndex, stopIndex + 1);

                const missingDays = 7 - weekArray.length;
                // Fill the beginning of the first week with dates from the previous month if necessary
                if (missingDays !== 0) {
                    const prevMonthLastDate = getDate(new Date(usedYear, usedMonth, 0));
                    for (let i = 0; i < missingDays; i++) {
                        const prevDate = prevMonthLastDate - i;
                        weekArray.unshift({
                            date: prevDate,
                            day: null // day is null to indicate it's not part of the current month
                        });
                    }
                }
                calendarArray.push(weekArray);
                lastIndex = stopIndex + 1;
            });

            // Handle the final week if there are remaining days after the last 'stopIndex'
            if (lastIndex < monthsDays.length) {
                const weekArray: Day[] = monthsDays.slice(lastIndex);

                const missingDays = 7 - weekArray.length;
                // Fill the end of the last week with dates from the next month
                if (missingDays !== 0) {
                    for (let i = 1; i <= missingDays; i++) {
                        weekArray.push({
                            date: i,
                            day: null // day is null to indicate it's not part of the current month
                        });
                    }
                }
                calendarArray.push(weekArray);
            }
            return calendarArray;
        }
    }, [lastDayInWeek, monthsDays, selectedMonth, selectedYear]);

    /**
     * Memoized list of time slots generated based on the defined interval.
     * * This optimization prevents the `generateTimeSlots` function from re-running
     * on every render, ensuring that the time picker list is only recalculated
     * when the `slots` prop (the minute interval) is updated.
     * * @returns {Slot[]} An array of time slot objects.
     */
    const timeSlots = useMemo(() => {
        return generateTimeSlots(slots);
    }, [slots]);

    /**
     * Memoized 2D array representing the calendar (weeks and days).
     * * This value is derived from `getDaysInMonthArray`. It stores the final
     * matrix of days, including padding from adjacent months, ensuring the
     * calendar layout only recalculates when the month, year, or week-start
     * settings change.
     * * @returns {Day[][] | undefined} A 2D array where each sub-array is a week.
     */
    const daysInMonthArray = useMemo(() => {
        return getDaysInMonthArray();
    }, [getDaysInMonthArray]);

    /**
     * Navigates through months.
     * * 1. **Reference Point**: Uses the 1st day of the current month to prevent
     * "Month Overflow" (e.g., jumping from Jan 31st incorrectly into March).
     * 2. **Directional Logic**: Utilizes `date-fns` (subMonths/addMonths) to
     * accurately calculate the target month and year.
     * 3. **Boundary Safeguard**: If a date is already selected, it checks if that
     * day exists in the new month (e.g., if switching to February, 31 becomes 28/29).
     * 4. **State & Input Sync**: Updates internal states and regenerates the
     * formatted string for the text input to ensure the UI remains consistent.
     * * @param {MonthDirectionType} direction - Indicates whether to move to
     * the PREVIOUS or NEXT month.
     */
    const changeMonth = (direction: MonthDirectionType) => {
        const currentlyDisplayedMonth = new Date(
            selectedYear ?? todayYear,
            selectedMonth ?? todayMonth,
            1 // We create a reference date (always the 1st of the month to avoid problems with the length of months)
        );
        let newMonth;
        if (direction === MonthDirection.PREVIOUS) {
            newMonth = subMonths(currentlyDisplayedMonth, 1); // Subtract one month using date-fns
        } else if (direction === MonthDirection.NEXT) {
            newMonth = addMonths(currentlyDisplayedMonth, 1); // Add one month using date-fns
        }

        if (newMonth) {
            const year = getYear(newMonth);
            const month = getMonth(newMonth);
            setSelectedMonth(month);
            setSelectedYear(year);
            // Check if the currently selected day fits within the new month's range
            const daysInMonth = getDaysInMonth(new Date(year, month));
            if (selectedDate) {
                let newDate = selectedDate;
                if (daysInMonth < selectedDate) {
                    // Adjustment: March 31st -> February 28th
                    setSelectedDate(daysInMonth);
                    newDate = daysInMonth;
                }
                // Sync the display value in the input field
                const formattedDate = formatDate(year, month, newDate, selectedMinutes ?? 0, selectedSeconds ?? 0, inputFormatPattern);
                setInputValue(formattedDate ?? '');
            }
        }
    };

    /**
     * Calculates the time slot closest to a reference time.
     * * This function uses a "nearest-neighbor" logic by iterating through all
     * available `timeSlots` and comparing their total minutes to either
     * the `selectedMinutes` or the current system time.
     * * It utilizes the `reduce` method to find the slot with the smallest absolute
     * difference in minutes.
     * * @returns {number | null} The total minutes from the start of the day for
     * the nearest slot, or null if no slots are available.
     */
    const getNearestSlot = useCallback(() => {
        if (!timeSlots || timeSlots.length === 0) {
            return null;
        }
        // Reference time used for comparison (selected value or current time)
        const subtractTime = selectedMinutes ?? currentTime;
        const nearest = timeSlots.reduce((prev, curr) => {
            // Calculate absolute difference in minutes for both previous and current slots
            const prevDiff = Math.abs(prev.minute - subtractTime);
            const currDiff = Math.abs(curr.minute - subtractTime);

            // Return the slot object that has the smaller difference
            return currDiff < prevDiff ? curr : prev;
        }, timeSlots[0]);
        return nearest.minute;
    }, [selectedMinutes, timeSlots]);

    /**
     * Automatically scrolls the active time slot into view when the selection changes
     * or the picker for month choosing is opened/closed.
     * * This effect uses a `ref` attached to the currently selected time slot element.
     * When `selectedMinutes` changes or the month view is toggled (`isOpenMonth`),
     * it triggers a native `scrollIntoView` call to ensure the active element
     * is positioned in the vertical center of its scrollable container.
     * * @dependency selectedMinutes - Re-runs when the user picks a different time.
     * @dependency isOpenMonth - Re-runs when the month/time view is opened/closed.
     */
    useEffect(() => {
        if (activeDayRef.current) {
            activeDayRef.current.scrollIntoView({
                behavior: 'auto', // Immediate jump without animation
                block: 'center' // Vertically aligns the item to the middle of the list
            });
        }
    }, [selectedMinutes, isOpenMonth]);

    /**
     * Automatically aligns the selected year to the top of the scrollable list.
     * * This effect is triggered when the `selectedYear` changes or when the
     * month/year navigation view is toggled (`isOpenMonth`).
     * It uses a `ref` specifically attached to the active year element to
     * ensure the user doesn't have to scroll through a long list of years
     * (e.g., from 2026 to 2029) to find their current selection.
     * * @dependency selectedYear - Re-runs to track the new active year.
     * @dependency isOpenMonth - Re-runs to ensure alignment when the view is opened.
     */
    useEffect(() => {
        if (activeYearRef.current) {
            // 1. First, perform the standard jump to the element
            activeYearRef.current.scrollIntoView({
                behavior: 'auto', // Immediate jump without animation
                block: 'start' // Aligns the selected year to the top of the container
            });
            /**
             * 2. Manual Offset Correction:
             * After scrolling to the start, we scroll the parent container
             * UP by 3 pixels to reveal the outline of button.
             * We find the closest scrollable parent to apply this to.
             */
            const scrollableParent = activeYearRef.current.parentElement;
            if (scrollableParent) {
                scrollableParent.scrollBy({
                    behavior: 'auto',
                    top: -3 // Move up by 3 px
                });
            }
        }
    }, [selectedYear, isOpenMonth]);

    /**
     * Synchronizes internal date states by parsing the raw input string
     * according to a dynamic format pattern.
     * * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        // 1. Reset all states if the input is cleared by the user
        if (rawValue.trim() === '') {
            setSelectedYear(null);
            setSelectedMonth(null);
            setSelectedDate(null);
            setSelectedMinutes(null);
            setSelectedSeconds(null);
            return;
        }

        /** * 2. Attempt to parse the string using the provided pattern.
         * The third argument 'new Date()' acts as a reference for missing parts
         * (e.g., if the pattern only has time, it takes today's date).
         */
        const parsedDate = parse(rawValue, inputFormatPattern, new Date());

        /**
         * 3. Validate the parsed result.
         * isValid() checks if the string matches the pattern and represents a real date
         * (e.g., it rejects '31.02.2026').
         */
        if (isValid(parsedDate) && getYear(parsedDate) >= minYear && getYear(parsedDate) <= maxYear) {
            // Extract individual components to sync the calendar picker state
            setSelectedYear(getYear(parsedDate));
            setSelectedMonth(getMonth(parsedDate)); // Returns 0-11
            setSelectedDate(getDate(parsedDate));
            if (inputFormatPattern.includes('HH') && inputFormatPattern.includes('mm')) {
                // Calculate total minutes from midnight for the time-slot logic
                const totalMinutes = getHours(parsedDate) * 60 + getMinutes(parsedDate);
                setSelectedMinutes(totalMinutes);
            }

            // Sync seconds if the current pattern includes them
            if (inputFormatPattern.includes('ss')) {
                setSelectedSeconds(getSeconds(parsedDate));
            }
        } else {
            /**
             * Note: If the date is invalid (user is still typing),
             * we keep the 'inputValue' updated but don't force-sync
             * the calendar state until a valid date is formed.
             */
        }
    };

    /**
     * Normalizes user input into an ISO string and synchronizes internal states.
     * 1. **Dynamic Parsing**: Uses `formatToISO` with `inputFormatPattern` to validate the current `inputValue`.
     * 2. **Strict Reset on Failure**: If the input is invalid, it clears the input field and resets
     * all calendar states (Year, Month, Date, Minutes, Seconds) to `null` to prevent data corruption.
     * 3. **State Synchronization**: On success, it updates the calendar picker state with values
     * extracted from the parsed ISO date.
     * 4. **Conditional Time/Seconds Sync**: Automatically detects if hours, minutes, or seconds
     * should be synchronized based on their presence in the `inputFormatPattern`.
     * * @returns {void}
     */
    const formatToIsoDate = useCallback(() => {
        // Attempt to convert the text input to a valid ISO Date object
        const isoDate = formatToISO(inputValue, hasTime, inputFormatPattern);
        if (isoDate === null) {
            // STRICT RESET: Clear all values if the input doesn't match a valid date
            setInputValue('');
            setSelectedYear(null);
            setSelectedMonth(null);
            setSelectedDate(null);
            setSelectedMinutes(null);
        } else {
            // SYNC: Populate the picker state with the successfully parsed date/time
            setInputValue(formatFromISO(isoDate, inputFormatPattern));
            setSelectedYear(getYear(isoDate));
            setSelectedMonth(getMonth(isoDate));
            setSelectedDate(getDate(isoDate));
            if (inputFormatPattern.includes('HH') && inputFormatPattern.includes('mm')) {
                // Calculate total minutes from midnight for the time-slot logic
                const totalMinutes = getHours(isoDate) * 60 + getMinutes(isoDate);
                setSelectedMinutes(totalMinutes);
            }

            // Sync seconds if the current pattern includes them
            if (inputFormatPattern.includes('ss')) {
                setSelectedSeconds(getSeconds(isoDate));
            }
        }
    }, [hasTime, inputFormatPattern, inputValue]);

    useEffect(() => {
        onChange(formatToISO(inputValue, hasTime, inputFormatPattern));
    }, [hasTime, inputFormatPattern, inputValue, onChange]);

    /**
     * Updates the calendar's view when the user changes the month or year.
     * * 1. **State Sync**: Updates the internal `selectedYear` and `selectedMonth`.
     * 2. **Input Update**: If a specific date is already selected, it re-formats
     * the entire date string using the new month/year and updates the text input.
     * 3. **Time Preservation**: Defaults minutes and seconds to 0 if they haven't
     * been explicitly selected yet, ensuring a valid format.
     * * @param {number} year - The newly selected year.
     * @param {Month} month - The month object containing the 0-indexed value.
     */
    const changeMonthAndYearHandler = (year: number, month: Month) => {
        setSelectedYear(year);
        setSelectedMonth(month.val);
        // If a day is already picked, we must sync the text input with the new view
        if (selectedDate) {
            const formattedDate = formatDate(year, month.val, selectedDate, selectedMinutes ?? 0, selectedSeconds ?? 0, inputFormatPattern);
            setInputValue(formattedDate ?? '');
        }
    };

    /**
     * Handles the selection of a new year from the calendar header.
     * * 1. **State Update**: Persists the newly selected year to the internal state.
     * 2. **Input Synchronization**: If both a month and a day are already selected,
     * it recalculates the formatted string to reflect the year change in the text input.
     * 3. **Defaulting Time**: Uses 0 as a fallback for minutes and seconds to ensure
     * the `formatDate` utility receives valid numeric inputs.
     * * @param {number} year - The year value selected by the user.
     */
    const changeYearHandler = (year: number) => {
        setSelectedYear(year);
        if (selectedMonth && selectedDate) {
            const formattedDate = formatDate(
                year,
                selectedMonth,
                selectedDate,
                selectedMinutes ?? 0,
                selectedSeconds ?? 0,
                inputFormatPattern
            );
            setInputValue(formattedDate ?? '');
        }
    };

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
                    type='text'
                    id={inputId}
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={formatToIsoDate}
                />
                <div className={`${theme.action.rightWrapper} relative`}>
                    <Button
                        key={props.title}
                        variant='transparent'
                        showChildren={false}
                        icon={CalendarDaysIcon}
                        onClick={handleCalendar}
                        disabled={processing || props.disabled}
                        additionalClassName={theme.action.button}
                        popoverTarget={popoverId}
                        style={{ anchorName: `--dropdown_${baseId}` }}
                    >
                        {props.title}
                    </Button>
                </div>
            </ElementWrapper>
            {isOpen && (
                <div
                    className='flex w-fit flex-col absolute border rounded-sm p-md tope-ui-dropdown'
                    id={popoverId}
                    popover='auto'
                    style={{
                        positionAnchor: `--dropdown_${baseId}`
                    }}
                >
                    <div className='mb-md flex w-full flex-row gap-xl'>
                        <Button
                            variant='outline'
                            showChildren={false}
                            icon={ChevronLeftIcon}
                            onClick={() => changeMonth(MonthDirection.PREVIOUS)}
                            additionalClassName={'py-md !w-[50px]'}
                        >
                            {localization.dateTimeInput.previous}
                        </Button>
                        <Button
                            variant='outline'
                            showChildren={true}
                            onClick={() => setIsOpenMonth((prev) => !prev)}
                            additionalClassName={'py-md flex-1'}
                        >
                            {selectedMonth === null
                                ? `${localization.dateTimeInput.months[todayMonth]} `
                                : `${localization.dateTimeInput.months[selectedMonth]} `}
                            {selectedYear ?? todayYear}
                        </Button>
                        <Button
                            variant='outline'
                            showChildren={false}
                            icon={ChevronRightIcon}
                            onClick={() => changeMonth(MonthDirection.NEXT)}
                            additionalClassName='py-md !w-[50px]'
                        >
                            {localization.dateTimeInput.next}
                        </Button>
                    </div>

                    {isOpenMonth && (
                        <ul
                            className='h-[200px] overflow-auto p-sm'
                            style={{ width: hasTime ? '368px' : '280px' }} // width: table -> 7 columns = 7 * 40px = 280px , timeslots -> 80 px, , 'gap-md' -> 8 px
                        >
                            {yearsRange.map((year) => {
                                let yearBgColor = bgColor.none;
                                if (year === selectedYear) {
                                    yearBgColor = bgColor.selected;
                                } else if (selectedYear === null && year === todayYear) {
                                    yearBgColor = bgColor.today;
                                }

                                const isSelected = selectedYear ? year === selectedYear : year === todayYear;
                                return (
                                    <li
                                        key={year}
                                        ref={isSelected ? activeYearRef : null}
                                        className='w-full'
                                    >
                                        {isSelected ? (
                                            <table className='w-full'>
                                                <thead className={`w-full ${yearBgColor}`}>
                                                    <tr>
                                                        <th
                                                            colSpan={4}
                                                            className='rounded-sm'
                                                        >
                                                            <Button
                                                                variant='outline'
                                                                showChildren={true}
                                                                additionalClassName={`!w-full ${yearBgColor} !h-[24px]  `}
                                                                onClick={() => changeYearHandler(year)}
                                                            >
                                                                {year}
                                                            </Button>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {monthRows.map((r) => {
                                                        return (
                                                            <tr key={`${r[0].label}-${r[1].label}-${r[2].label}-${r[3].label}`}>
                                                                {r.map((monthVal) => {
                                                                    let monthBgColor = bgColor.none;
                                                                    if (monthVal.val === selectedMonth) {
                                                                        monthBgColor = bgColor.selected;
                                                                    } else if (selectedMonth === null && monthVal.val === todayMonth) {
                                                                        monthBgColor = bgColor.today;
                                                                    }
                                                                    return (
                                                                        <td
                                                                            key={monthVal.label}
                                                                            className={`p-sm`}
                                                                        >
                                                                            <Button
                                                                                variant='outline'
                                                                                showChildren={true}
                                                                                additionalClassName={`!h-[24px] !w-full ${monthBgColor}`}
                                                                                onClick={() => {
                                                                                    changeMonthAndYearHandler(year, monthVal);
                                                                                }}
                                                                            >
                                                                                {monthVal.label}
                                                                            </Button>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <Button
                                                variant='outline'
                                                showChildren={true}
                                                additionalClassName={`!w-full ${yearBgColor} !h-[24px]`}
                                                onClick={() => changeYearHandler(year)}
                                            >
                                                {year}
                                            </Button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {!isOpenMonth && (
                        <div className='flex gap-md'>
                            <table className='h-[200px]'>
                                <thead>
                                    <tr className='flex flex-row'>
                                        {days.map((d) => {
                                            return (
                                                <th
                                                    key={d}
                                                    className='w-[40px] h-[24px]'
                                                >
                                                    {d}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                {daysInMonthArray?.map((cd, idx) => {
                                    return (
                                        <tbody key={`week-${idx}-${cd[0].date}-${cd[0].day}`}>
                                            <tr className='flex flex-row text-center'>
                                                {cd.map((d) => {
                                                    let dayBgColor = bgColor.none;

                                                    if (d.date === selectedDate && d.day !== null) {
                                                        dayBgColor = bgColor.selected;
                                                    } else if (
                                                        !selectedDate &&
                                                        d.date === todayDate &&
                                                        d.day !== null &&
                                                        (selectedMonth === null || selectedMonth === todayMonth) &&
                                                        (selectedYear === null || selectedYear === todayYear)
                                                    ) {
                                                        dayBgColor = bgColor.today;
                                                    }
                                                    return (
                                                        <td key={`day-${d.date}-${d.day}`}>
                                                            <Button
                                                                variant='outline'
                                                                showChildren={true}
                                                                additionalClassName={`!w-[40px] ${dayBgColor} border-none !h-[24px]`}
                                                                onClick={() => {
                                                                    if (d.date) {
                                                                        // change input text
                                                                        const formattedDate = formatDate(
                                                                            selectedYear ?? todayYear,
                                                                            selectedMonth ?? todayMonth,
                                                                            d.date,
                                                                            selectedMinutes ?? 0,
                                                                            selectedSeconds ?? 0,
                                                                            inputFormatPattern
                                                                        );

                                                                        if (formattedDate) {
                                                                            if (selectedYear === null) {
                                                                                setSelectedYear(todayYear);
                                                                            }
                                                                            if (selectedMonth === null) {
                                                                                setSelectedMonth(todayMonth);
                                                                            }
                                                                            setSelectedDate(d.date);
                                                                            if (selectedMinutes === null) {
                                                                                setSelectedMinutes(0);
                                                                            }
                                                                            if (selectedSeconds === null) {
                                                                                setSelectedSeconds(0);
                                                                            }
                                                                        }
                                                                        setInputValue(formattedDate ?? '');
                                                                    } else {
                                                                        throw new Error('Button is not clickable');
                                                                    }
                                                                }}
                                                                disabled={d.day === null}
                                                            >
                                                                {d.date ?? ''}
                                                            </Button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </tbody>
                                    );
                                })}
                            </table>
                            {hasTime && (
                                <ul className='visible h-[200px] w-[80px] overflow-auto p-sm'>
                                    {timeSlots.map((ts) => {
                                        const isSelected = ts.minute === selectedMinutes;
                                        const isNearestSlot = isSelected || ts.minute === getNearestSlot();
                                        return (
                                            <li
                                                key={ts.minute}
                                                ref={isNearestSlot ? activeDayRef : null}
                                                className='h-[24px]'
                                            >
                                                <Button
                                                    variant='outline'
                                                    showChildren={true}
                                                    additionalClassName={`${isSelected ? bgColor.selected : bgColor.none} border-none`}
                                                    onClick={() => {
                                                        // change input text
                                                        const formattedDate = formatDate(
                                                            selectedYear,
                                                            selectedMonth,
                                                            selectedDate,
                                                            ts.minute,
                                                            0, // 0 seconds
                                                            inputFormatPattern
                                                        );
                                                        if (formattedDate) {
                                                            setSelectedMinutes(ts.minute);
                                                            setSelectedSeconds(0);
                                                        }
                                                        setInputValue(formattedDate ?? '');
                                                    }}
                                                >
                                                    {ts.label}
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default DateTimeInput;
