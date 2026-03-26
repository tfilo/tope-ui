import type { ElementType } from 'react';
import { isNotBlank } from '../../utils';
import type { SectionProps } from './Section.types';

const theme = {
    wrapper: (hasBorder: boolean) => {
        return hasBorder ? 'border border-default rounded-sm flex flex-col' : 'flex flex-col gap-lg';
    },
    title: (hasBorder: boolean) => {
        return hasBorder ? 'text-md font-bold p-lg border-b border-default bg-primary-extra-light' : 'text-md font-bold';
    },
    content: (hasBorder: boolean) => {
        return hasBorder ? 'p-lg flex flex-col gap-lg' : 'flex flex-col gap-lg';
    }
} as const;

/**
 * Section renders div element wrapped by border by default, optionaly without border, title type is default h2 but can be configured to h2-h6
 */
export const Section: React.FC<SectionProps> = ({ title, titleType = 'h2', hasBorder = true, children }) => {
    const hasTitle = isNotBlank(title);
    const Title: ElementType = titleType;

    return (
        <div className={theme.wrapper(hasBorder)}>
            {hasTitle && <Title className={theme.title(hasBorder)}>{title}</Title>}
            <div className={theme.content(hasBorder)}>{children}</div>
        </div>
    );
};
