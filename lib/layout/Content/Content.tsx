/**
 * Content component renders as HTMLDivElement element and limits max width of content
 */
export const Content: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <div className='max-w-7xl flex-1 flex flex-col overflow-x-auto mx-auto'>{children}</div>;
};
