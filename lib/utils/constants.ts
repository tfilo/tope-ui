export const localization = {
    loading: 'Načítava sa...',
    noOptions: 'Žiadne možnosti',
    unavailableOption: 'Táto možnosť už nie je dostupná. Odstráňte ju alebo vyberte inú.',
    selectFile: 'Vyberte súbor',
    emptyOptionLabel: '',
    textareaCounter: 'Zobrazuje aktuálny počet znakov a maximálny povolený počet znakov.',
    requiredField: 'Táto položka je poivnná.',
    remove: (name: string) => `Odstrániť ${name}`,
    edit: 'Upraviť',
    profile: 'Profil',
    logout: 'Odhlásiť sa',
    page: 'Strana',
    of: 'z',
    sortAsc: 'Zoradiť vzostupne',
    sortDsc: 'Zoradiť zostupne',
    sortNotSet: 'Nezoradené',
    prevPage: 'Predchádzajúca strana',
    nextPage: 'Nasledujúca strana',
    currentPage: 'Aktuálna strana',
    dateTimeInput: {
        previousMonth: 'Predchádzajúci mesiac',
        nextMonth: 'Nasledujúci mesiac',
        previousYear: 'Predchádzajúci rok',
        nextYear: 'Nasledujúci rok',
        days: ['Nedela', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'], // 0 for sunday
        months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
        defaultDateTimeInputPlaceholder: 'DD.MM.YYYY HH:mm:ss',
        defaultDateInputPlaceholder: 'DD.MM.YYYY',
        openCalendar: 'Otvoriť kalendár',
        closeCalendar: 'Zatvoriť kalendár'
    },
    switch: 'Prepínač',
    modal: {
        cancelLabel: 'Zrušiť',
        confirmLabel: 'Potvrdiť'
    }
};

export const config: {
    /** Default locale used for sorting in table */
    locale: Intl.LocalesArgument;
    dateTimeFormat: string[];
    dateFormat: string[];
} = {
    locale: 'sk-SK',
    dateTimeFormat: ['dd.MM.yyyy HH:mm:ss', 'd.M.yyyy H:mm:ss'],
    dateFormat: ['dd.MM.yyyy', 'd.M.yyyy']
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
