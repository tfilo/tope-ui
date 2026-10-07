import { useCallback, type ElementType } from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';

import placeholder from '../../assets/placeholder.png';

import { isNotBlank } from '../../utils';
import { localization } from '../../utils/constants';
import { Button } from '../../general';
import type { CardProps } from './Card.types';

const theme = {
    base: 'relative',
    actionBtn: 'right-sm top-sm absolute w-[32px]! h-[32px]! fill-black/20 hover:fill-black/80 focus:fill-black/80 rounded-sm',
    card: (hasOnClick: boolean) =>
        `rounded-sm border border-default ${hasOnClick ? 'cursor-pointer' : 'cursor-default'} flex aspect-square w-full flex-col`,
    description: 'bg-secondary-light/20 p-lg text-justify text-base',
    descriptionText: 'text-default',
    spacer: 'flex-1'
} as const;

export const Card: React.FC<CardProps> = ({ description, onClick, onAction, imageUrl = placeholder }) => {
    const hasOnClick = onClick !== undefined;
    const hasOnAction = onAction !== undefined;
    const BaseElement: ElementType = hasOnClick ? 'button' : 'div';
    const hasDescription = isNotBlank(description);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (hasOnClick) {
                onClick(e as React.MouseEvent<HTMLButtonElement, MouseEvent>);
            }
        },
        [hasOnClick, onClick]
    );

    const handleAction = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            if (hasOnAction) {
                onAction(e);
            }
        },
        [hasOnAction, onAction]
    );

    return (
        <div className={theme.base}>
            {hasOnAction && (
                <Button
                    icon={PencilSquareIcon}
                    variant='transparent'
                    additionalClassName={theme.actionBtn}
                    showChildren={false}
                    onClick={handleAction}
                >
                    {localization.edit}
                </Button>
            )}
            <BaseElement
                className={theme.card(hasOnClick)}
                onClick={handleClick}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className={theme.spacer}></div>
                {hasDescription && (
                    <div className={theme.description}>
                        <span className={theme.descriptionText}>{description}</span>
                    </div>
                )}
            </BaseElement>
        </div>
    );
};
