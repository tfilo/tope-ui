const theme = {
    base: 'mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-x-auto'
} as const;

/**
 * Content component renders as HTMLDivElement element and limits max width of content
 */
export const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className={theme.base}>{children}</div>;
};
