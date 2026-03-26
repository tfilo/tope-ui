import type { ElementType } from 'react';
import { isNotBlank } from '../../utils';
import type { PageProps } from './Page.types';

/**
 * Page component renders as HTMLDivElement element with body and optional title
 */
export const Page: React.FC<PageProps> = ({ children, title, titleType = 'h1' }) => {
    const hasTitle = isNotBlank(title);
    const Title: ElementType = titleType;

    return (
        <div className='p-lg flex-1 flex flex-col gap-lg'>
            {hasTitle && <Title className='text-headline-1'>{title}</Title>}
            {children}
        </div>
    );
};
