import type { ElementType } from 'react';

import { Button } from '../../general/button';
import { isNotBlank } from '../../utils';
import type { SectionProps } from './Section.types';

const theme = {
    wrapper: (hasBorder: boolean) => {
        return hasBorder ? 'overflow-hidden border border-light rounded-md bg-white flex flex-col' : 'flex flex-col gap-lg';
    },
    header: (hasBorder: boolean) => {
        return hasBorder
            ? 'flex items-start gap-md p-lg bg-primary-extra-light/10 border-b border-light shadow-[inset_3px_0_var(--color-primary)]'
            : 'flex items-start gap-md py-lg border-b border-default';
    },
    title: (hasBorder: boolean, hasActions: boolean) =>
        `min-w-0 flex-1 wrap-anywhere ${hasBorder ? 'text-lg font-medium' : 'text-md font-bold'} ${hasActions ? 'flex min-h-[32px] items-center' : ''}`,
    actions: 'ml-auto flex shrink-0 items-start gap-xs',
    content: (hasBorder: boolean) => {
        return hasBorder ? 'p-lg flex flex-col gap-lg' : 'flex flex-col gap-lg';
    }
} as const;

/**
 * Section renders div element wrapped by border by default, optionaly without border, title type is default h2 but can be configured to h2-h6
 */
export const Section: React.FC<SectionProps> = ({ title, titleType = 'h2', hasBorder = true, actions, children }) => {
    const hasTitle = isNotBlank(title);
    const hasActions = actions !== undefined && actions.length > 0;
    const Title: ElementType = titleType;

    return (
        <div className={theme.wrapper(hasBorder)}>
            {(hasTitle || hasActions) && (
                <div className={theme.header(hasBorder)}>
                    {hasTitle && <Title className={theme.title(hasBorder, hasActions)}>{title}</Title>}
                    {hasActions && (
                        <div className={theme.actions}>
                            {actions.map((action, index) => (
                                <Button
                                    key={index}
                                    icon={action.icon}
                                    title={action.title}
                                    aria-label={action.title}
                                    onClick={action.onClick}
                                    disabled={action.disabled}
                                    variant={action.variant ?? 'transparent'}
                                    showChildren={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className={theme.content(hasBorder)}>{children}</div>
        </div>
    );
};
