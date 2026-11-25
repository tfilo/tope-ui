import { type ElementType } from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

import placeholder from '../../assets/placeholder.svg';

import { isNotBlank } from '../../utils';
import { localization } from '../../utils/constants';
import { Button } from '..';
import type { CardProps } from './Card.types';

const theme = {
    base: (hasOnClick: boolean) =>
        `relative shadow-md ${hasOnClick ? 'has-[.card-main:active]:translate-y-none! transition-shadow duration-300 ease-out hover:-translate-y-px hover:shadow-xl focus-within:-translate-y-px focus-within:shadow-xl' : ''}`,
    actionBtn: 'right-sm top-sm absolute w-[32px]! h-[32px]! fill-black/20 hover:fill-black/80 focus:fill-black/80 rounded-sm',
    card: (hasOnClick: boolean, compactOnMobile: boolean) =>
        `rounded-sm border border-default ${hasOnClick ? 'card-main cursor-pointer' : 'cursor-default'} flex w-full ${compactOnMobile ? 'items-start gap-sm p-sm max-tablet:bg-none! tablet:aspect-square tablet:flex-col tablet:items-stretch tablet:gap-none tablet:p-none' : 'aspect-square flex-col'}`,
    description: (hasOnAction: boolean, compactOnMobile: boolean) =>
        compactOnMobile
            ? `min-w-0 flex-1 text-left text-sm max-tablet:wrap-anywhere tablet:flex-initial tablet:bg-secondary-light/60 tablet:p-lg tablet:text-justify tablet:text-base ${hasOnAction ? 'pr-[36px]' : ''}`
            : 'bg-secondary-light/60 p-lg text-justify text-base',
    title: (compactOnMobile: boolean) => `text-headline-5 ${compactOnMobile ? 'max-tablet:text-[1rem]' : ''}`,
    descriptionText: (compactOnMobile: boolean) => `text-default ${compactOnMobile ? 'text-sm tablet:text-base' : ''}`,
    spacer: (compactOnMobile: boolean) =>
        compactOnMobile
            ? 'w-[64px] shrink-0 self-stretch rounded-sm bg-cover bg-center max-tablet:min-h-[64px] tablet:w-auto tablet:flex-1 tablet:bg-none!'
            : 'flex-1'
} as const;

export const Card: React.FC<CardProps> = ({
    ariaLabel,
    title,
    description,
    compactOnMobile = true,
    onClick,
    onAction,
    imageUrl,
    actionIcon = PencilSquareIcon,
    actionLabel = localization.edit
}) => {
    const backgroundUrl = isNotBlank(imageUrl) ? imageUrl : placeholder;
    const hasOnClick = onClick !== undefined;
    const hasOnAction = onAction !== undefined;
    const BaseElement: ElementType = hasOnClick ? 'button' : 'div';
    const hasTitle = isNotBlank(title);
    const hasDescription = isNotBlank(description);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (hasOnClick) {
            onClick(e as React.MouseEvent<HTMLButtonElement, MouseEvent>);
        }
    };

    const handleAction = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (hasOnAction) {
            onAction(e);
        }
    };

    return (
        <div className={theme.base(hasOnClick)}>
            {hasOnAction && (
                <Button
                    icon={actionIcon}
                    variant='transparent'
                    additionalClassName={theme.actionBtn}
                    showChildren={false}
                    onClick={handleAction}
                >
                    {actionLabel}
                </Button>
            )}
            <BaseElement
                type={hasOnClick ? 'button' : undefined}
                aria-label={ariaLabel}
                className={theme.card(hasOnClick, compactOnMobile)}
                onClick={handleClick}
                style={{
                    backgroundImage: `url("${backgroundUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div
                    className={theme.spacer(compactOnMobile)}
                    style={compactOnMobile ? { backgroundImage: `url("${backgroundUrl}")` } : undefined}
                ></div>
                {(hasTitle || hasDescription) && (
                    <div className={theme.description(hasOnAction, compactOnMobile)}>
                        {hasTitle && <div className={theme.title(compactOnMobile)}>{title}</div>}
                        {hasDescription && <span className={theme.descriptionText(compactOnMobile)}>{description}</span>}
                    </div>
                )}
            </BaseElement>
        </div>
    );
};
