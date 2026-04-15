import type { InputHTMLAttributes } from 'react';
import type { WeekDayType } from './DateTimeInput';

/** Represents a single day cell in the calendar grid. */
export interface Day {
    /** The day of the month (1-31). */
    date: number;
    /** The day of the week index (0-6). If null, the day is not part of the current month */
    day: number | null;
}

/** Represents a month in the calendar selection. */
export interface Month {
    /** The localized name of the month (e.g., "January", "February"). */
    label: string;
    /** The numeric value of the month. (0 = January, 11 = December). */
    val: number;
}

/** Represents a single selectable time interval in the picker. */
export interface Slot {
    /** Human-readable time (HH:mm) representation in 24-hour format (e.g., "14:30"). */
    label: string;
    /** The total number of minutes elapsed since the start of the day (00:00), (e.g., 90 for "01:30"). */
    minute: number;
}

/** Properties for the DateTimeInput component. */
export interface DateTimeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'placeholder'> {
    /** The currently selected date and time in ISO format (YYYY-MM-DD[THH:mm:ss]). Set to null if no date is selected */
    value: string | null;

    /** Callback function triggered when the date or time changes.
     * @param {string | null} value - The new ISO-formatted date string or null or 'UNKNOWN' if date is invalid.
     */
    onChange: (value: string | null) => Promise<void> | void;

    /** Optional label for DateTimeInput component */
    label?: string;

    /** Optional error message for DateTimeInput component, if not blank, DateTimeInput is in danger color */
    error?: string;

    /** Type of input - determine if the component should display and allow time selection.
     * If 'dateTime', it enables the time picker and uses time (e.g. 13:30).
     * @default 'date'
     */
    type?: 'date' | 'dateTime';

    /** Defines which day is treated as the last day of the week in the calendar.
     * @default WeekDay.Sunday */
    lastDayInWeek?: WeekDayType;

    /** * The time interval in minutes between each selectable slot in the time picker.
     * For example, a value of 15 generates slots like 08:00, 08:15, 08:30, etc.
     * @default 15
     */
    slots?: number;

    /**
     * Custom date-fns format pattern for the text input (e.g., 'dd.MM.yyyy').
     * If not provided, it falls back to a default based on the `type` prop.
     * If type is 'dateTime', default format pattern is 'dd.MM.yyyy HH:mm:ss'
     * If type is 'date', default format pattern is 'dd.MM.yyyy'
     * @example 'dd.MM.yyyy HH:mm:ss'
     */
    inputFormat?: string;

    /**
     * Custom placeholder text for the input field.
     * If not provided, it falls back to a default based on the `type` prop.
     * If type is 'dateTime', default placeholder is 'DD.MM.YYYY HH:mm:ss'
     * If type is 'date', default placeholder is 'DD.MM.YYYY'
     * @example 'DD.MM.YYYY'
     */
    placeholder?: string;

    /**
     * Custom title for input end icon
     * If not provided, it falls back to a default localized text for open and close calendar.
     */
    inputIconTitle?: string;

    /** Automatically close date-time picker if value is selected
     * @default true
     */
    closeDateTimePickerIfSelected?: boolean;
}
