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
    logout: 'Logout'
};

export const setLocalization = (newLocalization: Partial<typeof localization>) => {
    Object.assign(localization, newLocalization);
};
