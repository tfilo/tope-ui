/**
 * Determines whether a string is empty.
 *
 * A string is considered empty if it is undefined, null, or has zero lenght.
 *
 * @param str - The string to evaluate.
 * @returns True if the input is undefined, null, or zero lenght; otherwise false.
 *
 * @example
 * ```ts
 * isEmpty(undefined); // true
 * isEmpty(null);      // true
 * isEmpty('');        // true
 * isEmpty('   ');     // false
 * isEmpty('text');    // false
 * ```
 */
export const isEmpty = (str: string | null | undefined): boolean => {
    if (str === undefined || str === null || str.length === 0) {
        return true;
    }
    return false;
};

/**
 * Determines whether a string is not empty.
 *
 * A string is considered empty if it is undefined, null, or has zero lenght.
 *
 * @param str - The string to evaluate.
 * @returns False if the input is undefined, null, or zero lenght; otherwise false.
 *
 * @example
 * ```ts
 * isEmpty(undefined); // false
 * isEmpty(null);      // false
 * isEmpty('');        // false
 * isEmpty('   ');     // true
 * isEmpty('text');    // true
 * ```
 */
export const isNotEmpty = (str: string | null | undefined): str is string => {
    return !isEmpty(str);
};

/**
 * Determines whether a string is blank.
 *
 * A string is considered blank if it is undefined, null, or consists only of
 * whitespace characters.
 *
 * @param str - The string to evaluate.
 * @returns True if the input is undefined, null, or only whitespace; otherwise false.
 *
 * @example
 * ```ts
 * isBlank(undefined); // true
 * isBlank(null);      // true
 * isBlank('');        // true
 * isBlank('   ');     // true
 * isBlank('text');    // false
 * ```
 */
export const isBlank = (str: string | null | undefined): boolean => {
    if (str === undefined || str === null || str.trim() === '') {
        return true;
    }
    return false;
};

/**
 * Determines whether a string is not blank.
 *
 * A string is considered blank if it is undefined, null, or consists only of
 * whitespace characters.
 *
 * @param str - The string to evaluate.
 * @returns False if the input is undefined, null, or only whitespace; otherwise false.
 *
 * @example
 * ```ts
 * isNotBlank(undefined); // false
 * isNotBlank(null);      // false
 * isNotBlank('');        // false
 * isNotBlank('   ');     // false
 * isNotBlank('text');    // true
 * ```
 */
export const isNotBlank = (str: string | null | undefined): str is string => {
    return !isBlank(str);
};

/**
 * Stringify boolean
 *
 * @param val
 * @returns 'true' or 'false'
 */
export const sb = (val: boolean): 'true' | 'false' => {
    return `${val}`;
};
