import type { ElementType } from 'react';

import { isNotBlank } from '../../utils';
import type { PageProps } from './Page.types';

const theme = {
    page: 'flex flex-1 flex-col gap-lg p-lg',
    title: 'text-headline-1'
} as const;

/**
 * Page component renders as HTMLDivElement element with body and optional title
 */
export const Page: React.FC<PageProps> = ({ children, title, titleType = 'h1' }) => {
    const hasTitle = isNotBlank(title);
    const Title: ElementType = titleType;

    return (
        <div className={theme.page}>
            {hasTitle && <Title className={theme.title}>{title}</Title>}
            {children}
        </div>
    );
};
