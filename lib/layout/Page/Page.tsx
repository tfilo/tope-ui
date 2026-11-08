import type { ElementType } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';

import { isNotBlank } from '../../utils';
import { localization } from '../../utils/constants';
import { Button } from '../../general';
import type { PageProps } from './Page.types';

const theme = {
    page: 'flex flex-1 flex-col gap-lg p-lg',
    header: 'flex items-center gap-lg',
    title: 'text-headline-1'
} as const;

/**
 * Page component renders as HTMLDivElement element with body and optional title
 */
export const Page: React.FC<PageProps> = ({ children, title, titleType = 'h1', onBack }) => {
    const hasTitle = isNotBlank(title);
    const Title: ElementType = titleType;

    return (
        <div className={theme.page}>
            {(hasTitle || onBack) && (
                <div className={theme.header}>
                    {onBack && (
                        <Button
                            icon={ChevronLeftIcon}
                            variant='transparent'
                            showChildren={false}
                            onClick={onBack}
                        >
                            {localization.back}
                        </Button>
                    )}
                    {hasTitle && <Title className={theme.title}>{title}</Title>}
                </div>
            )}
            {children}
        </div>
    );
};
