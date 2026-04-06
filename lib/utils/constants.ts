export const localization = {
    loading: 'Loading...',
    noOptions: 'No options',
    selectFile: 'Select file',
    emptyOptionLabel: '--Please choose an option--',
    textareaCounter: 'Displays the current character count and the maximum allowed characters.',
    requiredField: 'This field is required.',
    remove: (name: string) => `Remove ${name}`,
    edit: 'Edit',
    profile: 'Profile',
    logout: 'Logout',
    page: 'Page',
    of: 'of',
    sortAsc: 'Sorted ascending',
    sortDsc: 'Sorted descending',
    sortNotSet: 'Not sorted',
    nextPage: 'Next page',
    prevPage: 'Previous page',
    currentPage: 'Current page',
    dateTimeInput: {
        previous: 'Predchádzajúci mesiac',
        next: 'Nasledujúci mesiac',
        dayAbbreviations: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'], // 0 for sunday
        months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
        monthAbbreviations: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        defaultDateTimeInputPattern: 'dd.MM.yyyy HH:mm:ss',
        defaultDateInputPattern: 'dd.MM.yyyy',
        defaultDateTimeInputPlaceholder: 'DD.MM.YYYY HH:mm:ss',
        defaultDateInputPlaceholder: 'DD.MM.YYYY'
    }
};

export const config: {
    locale: Intl.LocalesArgument;
} = {
    locale: 'sk-SK'
};

/**
 * Merges the provided localization object with the existing one, allowing for partial updates to the localization settings.
 *
 * @param newLocalization
 */
export const setLocalization = (newLocalization: Partial<typeof localization>) => {
    Object.assign(localization, newLocalization);
};

/**
 * Merges the provided config object with the existing one, allowing for partial updates to the config settings.
 *
 * @param newConfig
 */
export const setConfig = (newConfig: Partial<typeof config>) => {
    Object.assign(config, newConfig);
};
