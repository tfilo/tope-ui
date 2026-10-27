export const selectionTheme = {
    input: 'flex-1 focus:outline-none px-md min-h-[30px] w-full min-w-[100px]',
    inputAndTagWrapper: 'flex-1 flex flex-wrap',
    inputWrapper: 'flex flex-1',
    button: 'min-w-[30px] min-h-[30px] rounded-sm',
    wrapper: 'w-full flex flex-col relative',
    optionsWrapper: 'absolute border rounded-sm p-sm tope-ui-autocomplete shadow-sm',
    options: 'flex flex-col',
    retryIcon: 'size-xl shrink-0 fill-danger',
    retryIconDisabled: 'size-xl shrink-0 fill-disabled',
    fetchError:
        'w-full flex items-center justify-between gap-md text-left cursor-pointer disabled:cursor-default rounded-sm hover:bg-secondary-extra-light disabled:hover:bg-transparent',
    option: {
        error: 'w-full flex items-center justify-between gap-md py-md px-sm text-left cursor-pointer rounded-sm hover:bg-secondary-extra-light focus:outline-2 outline-primary',
        errorMessage: 'text-danger',
        noninteractive: 'text-disabled py-md px-sm',
        interactive: (disabled: boolean = false) =>
            `${disabled ? 'text-disabled' : 'has-hover:bg-secondary-extra-light has-focus-within:outline-2'} outline-primary rounded-sm py-md px-sm wrap-anywhere focus:z-10`,
        button: 'focus:outline-none cursor-pointer disabled:cursor-default w-full text-left flex flex-row justify-between',
        buttonIcon: 'w-xl fill-primary'
    }
} as const;
