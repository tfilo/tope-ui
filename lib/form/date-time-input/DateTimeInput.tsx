import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
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
import { WeekDay } from './WeekDay';

const unknownDate = 'UNKNOWN';
const isoDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss";
const isoDateFormat = 'yyyy-MM-dd';
const minYear = 1900;
const maxYear = 2100;
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
    allMonths.push({ label: localization.dateTimeInput.months[i], val: i });
}

/** Generate time slots
 * @param {number} interval number in minutes between slots
 * @returns {Slot[]} array with defined slot interval
 * - label: human readable time (HH:mm)
 * - minute: total time in minutes from start of the day
 * @example
 * // Returns [{ label: "00:00", minute: 0 }, { label: "00:15", minute: 15 }, ...]
 * generateTimeSlots(15);
 * @example
 * // Returns [{ label: "00:00", minute: 0 }, { label: "01:00", minute: 60 }, ...]
 * generateTimeSlots(60);
 */
const generateTimeSlots = (interval: number): Slot[] => {
    if (interval === 0) {
        return [];
    }

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

/** Format a user-input date string into a ISO string.
 * @param {string | undefined} dateTime - The raw date/time string from the input field.
 * @param {boolean} hasTime - Flag to determine the output format (Date vs DateTime).
 * @param {string} inputFormatPattern - The pattern used to parse the input (e.g., 'dd.MM.yyyy HH:mm:ss').
 * @returns {string | null} A string in "yyyy-MM-dd" or "yyyy-MM-dd'T'HH:mm:ss" format, or null if dateTime is empty string or 'UNKNOWN' if dateTime is invalid.
 * @example
 * // Input: "26.03.2026", Pattern: "dd.MM.yyyy" -> Returns "2026-03-26"
 * formatToISO("26.03.2026", false, defaultDateInputPattern);
 * @example
 * // Input: "", Pattern: Pattern: "dd.MM.yyyy" -> Returns null
 * formatToISO("", false, defaultDateInputPattern);
 * @example
 * // Input: "26.02.300", Pattern: "dd.MM.yyyy" -> Returns "UNKNOWN"
 * formatToISO("26.02.300", false, defaultDateInputPattern);
 */
const formatToISO = (dateTime: string | undefined, hasTime: boolean, inputFormatPattern: string): string | null => {
    if (!dateTime?.trim()) return null;
    const parsedDate = parse(dateTime, inputFormatPattern, new Date()); // convert string into Date object according formatPattern
    if (!isValid(parsedDate) || getYear(parsedDate) < minYear || getYear(parsedDate) > maxYear) {
        // 'Invalid format or year out of the range');
        return unknownDate;
    } else {
        return hasTime ? format(parsedDate, isoDateTimeFormat) : format(parsedDate, isoDateFormat);
    }
};

/** Converts a ISO date string (YYYY-MM-DD[THH:mm:ss]) into a user-friendly display format based on a pattern
 * @param {string | null} dateTime - The ISO date string to be formatted (from an API).
 * @param {string} inputFormatPattern - The expected display pattern (e.g., 'dd.MM.yyyy HH:mm:ss').
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
    if (!dateTime || dateTime.trim() === unknownDate) return '';
    try {
        // Convert ISO string to Date object first to ensure compatibility with date-fns format()
        const date = parseISO(dateTime);

        // Check if the parsed date is valid
        if (!isValid(date) || getYear(date) < minYear || getYear(date) > maxYear) {
            return '';
        }
        return format(date, inputFormatPattern);
    } catch (error) {
        console.error('Error formatting ISO date:', error);
        return '';
    }
};

/** Formats a date and time into a string based on a provided pattern. Used in dateTime picker.
 * @param {number | null} year - The selected year.
 * @param {number | null} month - The selected 0-indexed month (0-11).
 * @param {number | null} date - The salected day of the month (1-31).
 * @param {number | null} minutes - Selected total minutes from midnight.
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
): string => {
    if (year !== null && month !== null && date !== null) {
        // if minutes or seconds are null, use 0 as midnight
        const hour = minutes === null ? 0 : Math.floor(minutes / 60);
        const min = minutes === null ? 0 : minutes % 60;
        const sec = seconds ?? 0;
        // Create date Object
        const dateObj = new Date(year, month, date, hour, min, sec);

        // check, if dateObj is valid
        if (!isValid(dateObj) || year < minYear || year > maxYear) {
            throw new Error('Invalid date or year out of the range');
        }
        // format date
        return format(dateObj, inputFormatPattern);
    } else {
        throw new Error('It is not possible to format date.');
    }
};

const theme = {
    action: {
        button: 'min-w-[30px] min-h-[30px]',
        rightWrapper: 'relative flex flex-row border-l'
    },
    calendar: {
        wrapper: 'tope-ui-calendar absolute rounded-sm border',
        base: 'flex size-full flex-col',
        btns: 'flex flex-row gap-xl border-b p-md',
        btnPrev: 'min-w-[50px] min-h-[40px]',
        btnMiddle: 'min-w-[50px] min-h-[40px] flex-1',
        btnNext: 'min-w-[50px] min-h-[40px]',
        years: 'grid max-h-[184px] flex-1 grid-cols-4 gap-md overflow-auto p-md',
        yearBtn: 'w-full min-w-full min-h-[32px]',
        months: 'grid h-full max-h-[184px] flex-1 grid-cols-4 gap-md p-md',
        monthBtn: 'flex-1',
        days: 'm-md h-none flex-1 table-fixed border-collapse',
        daysWrapper: 'flex flex-1 flex-row',
        daysHeader: 'h-3xl max-h-3xl w-[14.2857%]',
        daysColumn: 'h-3xl max-h-3xl w-[14.2857%] p-xs',
        dayBtn: 'p-sm w-full! h-full!',
        times: 'visible max-h-[184px] w-[80px] overflow-y-scroll border-l p-md',
        timeBtn: 'border-none'
    },
    fullWidth: 'w-full',
    flex: 'flex',
    input: 'min-h-[30px] flex-1 px-md focus:outline-none'
} as const;

const bgColor = {
    selected: 'bg-primary-light!',
    today: 'border border-primary-light!'
} as const;

/** Date and DateTime input component that renders as HTMLInputElement element wrapped by parent div containing optional label and error message.
 * DateTimeInput - A date and time picker component.
 * @example
 * // Basic usage with only a date
 * <DateTimeInput value="2026-03-26" />
 * @example
 * // Usage with 30-minute time slots and Monday as the last day
 * <DateTimeInput
 * value="2026-03-26T14:30"
 * hasTime={true}
 * slots={30}
 * lastDayInWeek={DaysEnum.Monday}
 * />
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
    inputIconTitle,
    closeDateTimePickerIfSelected = true,
    ...props
}) => {
    const hasTime = type === 'dateTime';

    const [isOpen, setIsOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'day' | 'month' | 'year'>('day');

    const [selectedDate, setSelectedDate] = useState<number | null>(() => {
        if (value) {
            const parsed = parseISO(value);
            if (isValid(parsed)) {
                return getDate(parsed);
            }
        }
        return null;
    });
    const [selectedMonth, setSelectedMonth] = useState<number | null>(() => {
        if (value) {
            const parsed = parseISO(value);
            if (isValid(parsed)) {
                return getMonth(parsed);
            }
        }
        return null;
    }); // Start from 0
    const [selectedYear, setSelectedYear] = useState<number | null>(() => {
        if (value) {
            const parsed = parseISO(value);
            if (isValid(parsed)) {
                return getYear(parsed);
            }
        }
        return null;
    });
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(() => {
        if (value && hasTime) {
            const parsed = parseISO(value);
            if (isValid(parsed)) {
                return getHours(parsed) * 60 + getMinutes(parsed);
            }
        }
        return null;
    });
    const [selectedSeconds, setSelectedSeconds] = useState<number | null>(() => {
        if (value && hasTime) {
            const parsed = parseISO(value);
            if (isValid(parsed)) {
                return getSeconds(parsed);
            }
        }
        return null;
    });

    /** Determines the active date-fns format pattern for parsing and formatting.
     * Logic flow:
     * 1. If a custom `inputFormat` is provided via props, it takes the highest priority.
     * 2. If no custom format exists, it falls back to a predefined default pattern based on whether the component is in "DateTime" or "Date-only" mode (`hasTime`).
     */
    const inputFormatPattern = useMemo(() => {
        if (inputFormat) {
            return inputFormat;
        } else {
            return hasTime ? localization.dateTimeInput.defaultDateTimeInputPattern : localization.dateTimeInput.defaultDateInputPattern;
        }
    }, [hasTime, inputFormat]);

    const [inputValue, setInputValue] = useState<string>(formatFromISO(value, inputFormatPattern));
    const [prevValue, setPrevValue] = useState(value);
    const activeDayRef = useRef<HTMLLIElement>(null);
    const activeYearRef = useRef<HTMLLIElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const calendarBtnRef = useRef<HTMLButtonElement>(null);

    const _id = useId();
    const baseId = id || _id;
    const inputId = `input-${baseId}`;

    /** Determines the input placeholder string.
     * Logic flow:
     * 1. If a custom `placeholder` is provided via props, it takes the highest priority.
     * 2. If no custom placeholder exists, it falls back to a predefined default placeholder based on whether the component is in "DateTime" or "Date-only" mode (`hasTime`).
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

    /** Memoized array of abbreviated day names, based on the `lastDayInWeek` prop. it calculates the starting day and reorders the abbreviations
     * @example
     * // If lastDayInWeek is Sunday (0), firstDay is 1 (Monday). Result: [Mon, Tue, ..., Sun]
     * // If lastDayInWeek is Saturday (6), firstDay is 0 (Sunday). Result: [Sun, Mon, ..., Sat]
     */
    const days = useMemo(() => {
        // Get day abbreviations (e.g., ["Ne", "Po", "Ut", "St", ...])
        const allDays = localization.dateTimeInput.days;
        // Calculate the index of the first day to display.
        // If Saturday is the last day, Sunday (index 0) becomes the first day.
        // Otherwise, the first day is simply the day following the chosen last day.
        const firstDayInweek = lastDayInWeek === WeekDay.Saturday ? 0 : lastDayInWeek + 1;
        // Split and reassemble the array to rotate it
        const daysAfter = allDays.slice(firstDayInweek);
        const daysBefore = allDays.slice(0, firstDayInweek);
        return [...daysAfter, ...daysBefore];
    }, [lastDayInWeek]);

    /**  Memoized array of days for the currently selected or active month or today's month.
     * Each day object contains:
     * - `date`: The numerical day of the month (1-31).
     * - `day`: The day of the week index (0-6, where 0 is Sunday)
     */
    const monthsDays = useMemo(() => {
        // Fallback to today's date if selectedYear/Month are null
        const usedYear = selectedYear ?? getYear(new Date());
        const usedMonth = selectedMonth ?? getMonth(new Date());

        const daysArray: Day[] = [];
        // Get total number of days in the specific month (e.g., 28, 30, or 31)
        const daysInMonth = getDaysInMonth(new Date(usedYear, usedMonth));

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDay = new Date(usedYear, usedMonth, i);
            daysArray.push({
                date: i, // Numerical date (1-31)
                day: getDay(currentDay) // Day of week index (e.g., 0 for Sunday)
            });
        }

        return daysArray;
    }, [selectedMonth, selectedYear]);

    /** Transforms aflat array of month days into a 2D array representing calendar weeks with last day of week according  `lastDayInWeek` prop.
     * If the first week doesn't start on the first day of the week, it prepends dates from the end of the previous month.
     * If the last week is incomplete, it appends dates from the start of the next month.
     * @returns {Day[][] | undefined} A 2D array where each inner array represents a week (7 days).
     */
    const getDaysInMonthArray = useCallback(() => {
        const usedYear = selectedYear ?? getYear(new Date());
        const usedMonth = selectedMonth ?? getMonth(new Date());

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

    /** Memoized list of time slots generated based on the defined interval (`slots` prop).
     * @returns {Slot[]} An array of time slot objects.
     */
    const timeSlots = useMemo(() => {
        return generateTimeSlots(slots);
    }, [slots]);

    /** Memoized 2D array representing the calendar (weeks and days).
     * @returns {Day[][] | undefined} A 2D array where each sub-array is a week.
     */
    const daysInMonthArray = useMemo(() => {
        return getDaysInMonthArray();
    }, [getDaysInMonthArray]);

    /** Calculates the time slot closest to a reference time.
     * @returns {number | null} The total minutes from the start of the day for the nearest slot, or null if no slots are available.
     */
    const getNearestSlot = useCallback(() => {
        if (!timeSlots || timeSlots.length === 0) {
            return null;
        }
        // Reference time used for comparison (selected value or current time)
        const subtractTime = selectedMinutes ?? getHours(new Date()) * 60 + getMinutes(new Date());
        const nearest = timeSlots.reduce((prev, curr) => {
            // Calculate absolute difference in minutes for both previous and current slots
            const prevDiff = Math.abs(prev.minute - subtractTime);
            const currDiff = Math.abs(curr.minute - subtractTime);

            // Return the slot object that has the smaller difference
            return currDiff < prevDiff ? curr : prev;
        }, timeSlots[0]);
        return nearest.minute;
    }, [selectedMinutes, timeSlots]);

    /** Automatically scrolls the active time slot into view when the selection changes or the picker for month choosing is opened/closed.
     * @dependency selectedMinutes - Re-runs when the user picks a different time.
     * @dependency pickerType - Re-runs when the month view is opened/closed.
     * @dependency isOpen - Re-runs when the calendar (time) view is opened/closed.
     */
    useEffect(() => {
        if (activeDayRef.current) {
            activeDayRef.current.scrollIntoView({
                behavior: 'auto', // Immediate jump without animation
                block: 'center' // Vertically aligns the item to the middle of the list
            });
        }
    }, [selectedMinutes, pickerType, isOpen]);

    /** Automatically aligns the selected year to the top of the scrollable list.
     * @dependency selectedYear - Re-runs to track the new active year.
     * @dependency pickerType - Re-runs to ensure alignment when the view is opened.
     * @dependency isOpen - Re-runs when the calendar (time) view is opened/closed.
     */
    useLayoutEffect(() => {
        if (activeYearRef.current) {
            // Standard jump to the element
            activeYearRef.current.scrollIntoView({
                behavior: 'auto', // Immediate jump without animation
                block: 'center' // Aligns the selected year to the top of the container
            });
        }
    }, [selectedYear, pickerType, isOpen]);

    /** Synchronizes internal date states by parsing the raw input string according to a format pattern.
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        // Reset all states if the input is cleared by the user
        if (rawValue.trim() === '') {
            setSelectedYear(null);
            setSelectedMonth(null);
            setSelectedDate(null);
            setSelectedMinutes(null);
            setSelectedSeconds(null);
            onChange(null);
        } else if (rawValue.trim().length === inputFormatPattern.length) {
            // Attempt to parse the string using the provided pattern. The third argument 'new Date()' acts as a reference for missing parts (e.g., if the pattern only has time, it takes today's date).
            const parsedDate = parse(rawValue, inputFormatPattern, new Date());

            // Validate the parsed result
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

                const res = hasTime ? format(parsedDate, isoDateTimeFormat) : format(parsedDate, isoDateFormat);
                onChange(res);
            } else {
                // Date is invalid (parsedDate is invalid, or year is out of the range)
                onChange(unknownDate);
            }
        } else {
            // Date is invalid (user is still typing)
            onChange(unknownDate);
        }
    };

    const handleCalendarClose = () => {
        setIsOpen(false);
        setPickerType('day');
    };

    const handleCalendarOpen = () => {
        setIsOpen(true);
    };

    /** Final update when some value from date-tme picker was selected.
     * @param {string} formattedDate - Date-time string formatted according to the inputFormatPattern
     * @param {boolean} [closeDateTimePicker=true] - If date-time picker should be closed after selection
     */
    const handleDateSelection = useCallback(
        (formattedDate: string, closeDateTimePicker: boolean = true) => {
            setInputValue(formattedDate);
            const res = formatToISO(formattedDate, hasTime, inputFormatPattern);
            onChange(res);
            if (closeDateTimePicker && closeDateTimePickerIfSelected) {
                // close date-time picker
                handleCalendarClose();
            }
        },
        [closeDateTimePickerIfSelected, hasTime, inputFormatPattern, onChange]
    );

    /** Navigates through months.
     * @param {MonthDirectionType} direction - Indicates whether to move to the PREVIOUS or NEXT month.
     */
    const changeMonthHandler = (direction: MonthDirectionType) => {
        // We create a reference date (always the 1st of the month to avoid problems with the length of months)
        const currentlyDisplayedMonth = new Date(selectedYear ?? getYear(new Date()), selectedMonth ?? getMonth(new Date()));
        let newMonth;
        if (direction === MonthDirection.PREVIOUS) {
            newMonth = subMonths(currentlyDisplayedMonth, 1); // Subtract one month using date-fns
            if (getYear(newMonth) < minYear) {
                return; // Don't allow to go belove minYear
            }
        } else if (direction === MonthDirection.NEXT) {
            newMonth = addMonths(currentlyDisplayedMonth, 1); // Add one month using date-fns
            if (getYear(newMonth) > maxYear) {
                return; // Don't allow to go above maxYear
            }
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
                handleDateSelection(formattedDate, false);
            }
        }
    };

    /** Updates the calendar's view when the user changes the month or year.
     * @param {number} year - The newly selected year.
     * @param {Month} month - The month object containing the 0-indexed value.
     */
    const changeMonthAndYearHandler = (year: number, month: Month) => {
        setSelectedYear(year);
        setSelectedMonth(month.val);
        // If a day is already picked, we must sync the text input with the new view
        if (selectedDate) {
            const formattedDate = formatDate(year, month.val, selectedDate, selectedMinutes ?? 0, selectedSeconds ?? 0, inputFormatPattern);
            handleDateSelection(formattedDate, false);
        }
        setPickerType('day');
    };

    /** Handles the selection of a new year from the calendar.
     * @param {number} year - The year value selected by the user.
     */
    const changeYearHandler = (year: number) => {
        const _year = Math.max(Math.min(year, maxYear), minYear);

        setSelectedYear(_year);
        // If a day and month is already picked, we must sync the text input with the new year
        if (selectedMonth && selectedDate) {
            const formattedDate = formatDate(
                _year,
                selectedMonth,
                selectedDate,
                selectedMinutes ?? 0,
                selectedSeconds ?? 0,
                inputFormatPattern
            );
            handleDateSelection(formattedDate, false);
        }
        setPickerType('month');
    };

    /** Updates the calendar's day.
     * @param {Day} d - The newly selected day.
     */
    const changeDayHandler = (d: Day) => {
        if (d.day) {
            // change input text
            const usedYear = selectedYear ?? getYear(new Date());
            const usedMonth = selectedMonth ?? getMonth(new Date());
            const usedMinutes = selectedMinutes ?? getHours(new Date()) * 60 + getMinutes(new Date());
            const usedSeconds = selectedSeconds ?? getSeconds(new Date());
            const formattedDate = formatDate(usedYear, usedMonth, d.date, usedMinutes, usedSeconds, inputFormatPattern);

            if (formattedDate) {
                if (selectedYear === null) {
                    setSelectedYear(usedYear);
                }
                if (selectedMonth === null) {
                    setSelectedMonth(usedMonth);
                }
                setSelectedDate(d.date);
                if (selectedMinutes === null) {
                    setSelectedMinutes(usedMinutes);
                }
                if (selectedSeconds === null) {
                    setSelectedSeconds(usedSeconds);
                }
            }
            handleDateSelection(formattedDate);
        } else {
            throw new Error('Button is not clickable');
        }
    };

    /** Updates the calendar's time.
     * @param {number} minute - The newly selected time.
     */
    const changeTimeHandler = (minute: number) => {
        const usedYear = selectedYear ?? getYear(new Date());
        const usedMonth = selectedMonth ?? getMonth(new Date());
        const usedDate = selectedDate ?? getDate(new Date());
        // change input text
        const formattedDate = formatDate(
            usedYear,
            usedMonth,
            usedDate,
            minute,
            0, // 0 seconds
            inputFormatPattern
        );
        if (formattedDate) {
            if (selectedYear === null) {
                setSelectedYear(usedYear);
            }
            if (selectedMonth === null) {
                setSelectedMonth(usedMonth);
            }
            if (selectedDate === null) {
                setSelectedDate(usedDate);
            }
            setSelectedMinutes(minute);
            setSelectedSeconds(0);
        }
        handleDateSelection(formattedDate);
    };

    /** Close date-time picker if it was clicked outside the picker or pressed escape */
    useEffect(() => {
        const handleClickAway = (e: MouseEvent) => {
            const target = e.target as Node;
            // Check if click is inside the calendar or calendar button
            const isInsideContainer = calendarRef.current?.contains(target) || calendarBtnRef.current?.contains(target);
            if (!isInsideContainer) {
                handleCalendarClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCalendarClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickAway);
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('mousedown', handleClickAway);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            calendarRef.current?.showPopover();
        } else {
            calendarRef.current?.hidePopover();
        }
    }, [isOpen]);

    if (value !== prevValue) {
        setPrevValue(value);
        if (value !== unknownDate) {
            setInputValue(formatFromISO(value, inputFormatPattern));
        }
    }

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
                />
                <div className={theme.action.rightWrapper}>
                    <Button
                        variant='transparent'
                        showChildren={false}
                        icon={CalendarDaysIcon}
                        ref={calendarBtnRef}
                        onClick={() => {
                            if (!props.readOnly) {
                                if (isOpen) {
                                    handleCalendarClose();
                                } else {
                                    handleCalendarOpen();
                                }
                            }
                        }}
                        disabled={props.disabled}
                        additionalClassName={theme.action.button}
                        style={{ anchorName: `--calendar_${baseId}` }}
                    >
                        {inputIconTitle ?? (isOpen ? localization.dateTimeInput.closeCalendar : localization.dateTimeInput.openCalendar)}
                    </Button>
                </div>
            </ElementWrapper>
            <div
                className={theme.calendar.wrapper}
                popover='manual'
                style={{
                    positionAnchor: `--calendar_${baseId}`,
                    width: hasTime ? '384px' : '298px', // width: table -> 7 columns = 7 * 40px = 280px , timeslots -> 80 px, , 'gap-md' -> 8 px
                    height: '243px'
                }}
                ref={calendarRef}
            >
                <div className={theme.calendar.base}>
                    {pickerType === 'day' && (
                        <div className={theme.calendar.btns}>
                            <Button
                                variant='outline'
                                showChildren={false}
                                icon={ChevronLeftIcon}
                                onClick={() => changeMonthHandler(MonthDirection.PREVIOUS)}
                                additionalClassName={theme.calendar.btnPrev}
                            >
                                {localization.dateTimeInput.previousMonth}
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() =>
                                    setPickerType((prev) => {
                                        switch (prev) {
                                            case 'day':
                                                return 'month';
                                            case 'month':
                                                return 'year';
                                            case 'year':
                                                return 'day';
                                        }
                                    })
                                }
                                additionalClassName={theme.calendar.btnMiddle}
                            >
                                {selectedMonth === null
                                    ? `${localization.dateTimeInput.months[getMonth(new Date())]} `
                                    : `${localization.dateTimeInput.months[selectedMonth]} `}
                                {selectedYear ?? getYear(new Date())}
                            </Button>
                            <Button
                                variant='outline'
                                showChildren={false}
                                icon={ChevronRightIcon}
                                onClick={() => changeMonthHandler(MonthDirection.NEXT)}
                                additionalClassName={theme.calendar.btnNext}
                            >
                                {localization.dateTimeInput.nextMonth}
                            </Button>
                        </div>
                    )}
                    {pickerType !== 'day' && (
                        <div className={theme.calendar.btns}>
                            <Button
                                variant='outline'
                                showChildren={false}
                                icon={ChevronLeftIcon}
                                onClick={() => changeYearHandler((selectedYear ?? getYear(new Date())) - 1)}
                                additionalClassName={theme.calendar.btnPrev}
                            >
                                {localization.dateTimeInput.previousYear}
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() =>
                                    setPickerType((prev) => {
                                        switch (prev) {
                                            case 'day':
                                                return 'month';
                                            case 'month':
                                                return 'year';
                                            case 'year':
                                                return 'day';
                                        }
                                    })
                                }
                                additionalClassName={theme.calendar.btnMiddle}
                            >
                                {selectedYear ?? getYear(new Date())}
                            </Button>
                            <Button
                                variant='outline'
                                showChildren={false}
                                icon={ChevronRightIcon}
                                onClick={() => changeYearHandler((selectedYear ?? getYear(new Date())) + 1)}
                                additionalClassName={theme.calendar.btnNext}
                            >
                                {localization.dateTimeInput.nextYear}
                            </Button>
                        </div>
                    )}
                    {pickerType === 'year' && (
                        <ul className={theme.calendar.years}>
                            {yearsRange.map((year) => {
                                let yearBgColor = '';
                                if (year === getYear(new Date())) {
                                    yearBgColor = bgColor.today;
                                }
                                if (year === selectedYear) {
                                    yearBgColor = bgColor.selected;
                                }

                                return (
                                    <li
                                        key={year}
                                        className={theme.fullWidth}
                                        ref={
                                            year === selectedYear || (selectedYear === null && year === getYear(new Date()))
                                                ? activeYearRef
                                                : undefined
                                        }
                                    >
                                        <Button
                                            variant='outline'
                                            additionalClassName={theme.calendar.yearBtn + ' ' + yearBgColor}
                                            onClick={() => changeYearHandler(year)}
                                        >
                                            {year}
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {pickerType === 'month' && (
                        <ul className={theme.calendar.months}>
                            {allMonths.map((month) => {
                                let monthBgColor = '';
                                if (month.val === getMonth(new Date()) && (selectedYear === getYear(new Date()) || selectedYear === null)) {
                                    monthBgColor = bgColor.today;
                                }
                                if (month.val === selectedMonth) {
                                    monthBgColor = bgColor.selected;
                                }
                                return (
                                    <li
                                        key={`${month.label}`}
                                        className={theme.flex}
                                    >
                                        <Button
                                            variant='outline'
                                            additionalClassName={theme.calendar.monthBtn + ' ' + monthBgColor}
                                            onClick={() => {
                                                changeMonthAndYearHandler(selectedYear ?? getYear(new Date()), month);
                                            }}
                                        >
                                            {month.label.substring(0, 3)}
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {pickerType === 'day' && (
                        <div className={theme.calendar.daysWrapper}>
                            <table className={theme.calendar.days}>
                                <thead>
                                    <tr>
                                        {days.map((d) => {
                                            return (
                                                <th
                                                    key={d}
                                                    className={theme.calendar.daysHeader}
                                                    aria-label={d}
                                                >
                                                    {d.substring(0, 2)}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {daysInMonthArray?.map((cd, idx) => {
                                        return (
                                            <tr key={`week-${idx}-${cd[0].date}-${cd[0].day}`}>
                                                {cd.map((d) => {
                                                    let dayBgColor = 'border-none';
                                                    if (
                                                        d.date === getDate(new Date()) &&
                                                        ((selectedMonth === getMonth(new Date()) && selectedYear === getYear(new Date())) ||
                                                            (selectedMonth === null && selectedYear === null))
                                                    ) {
                                                        dayBgColor = bgColor.today;
                                                    }
                                                    if (d.date === selectedDate && d.day !== null) {
                                                        dayBgColor = bgColor.selected;
                                                    }
                                                    return (
                                                        <td
                                                            key={`day-${d.date}-${d.day}`}
                                                            className={theme.calendar.daysColumn}
                                                        >
                                                            <Button
                                                                variant='outline'
                                                                additionalClassName={dayBgColor + ' ' + theme.calendar.dayBtn}
                                                                onClick={() => changeDayHandler(d)}
                                                                disabled={d.day === null}
                                                            >
                                                                {d.date ?? ''}
                                                            </Button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {hasTime && (
                                <ul className={theme.calendar.times}>
                                    {timeSlots.map((ts) => {
                                        const isSelected = ts.minute === selectedMinutes;
                                        const isNearestSlot = isSelected || ts.minute === getNearestSlot();
                                        return (
                                            <li
                                                key={ts.minute}
                                                ref={isNearestSlot ? activeDayRef : null}
                                                className='h-3xl'
                                            >
                                                <Button
                                                    variant='outline'
                                                    showChildren={true}
                                                    additionalClassName={
                                                        (isSelected ? 'bg-primary-light!' : '') + ' ' + theme.calendar.timeBtn
                                                    }
                                                    onClick={() => changeTimeHandler(ts.minute)}
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
            </div>
        </>
    );
};

export default DateTimeInput;
