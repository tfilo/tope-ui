import { useCallback, type ElementType } from 'react';
import type { CardProps } from './Card.types';
import { isNotBlank } from '../../utils';
import placeholder from '../../assets/placeholder.png';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { Button } from '../../general';
import { localization } from '../../utils/constants';

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
        <div className='relative'>
            {hasOnAction && (
                <Button
                    icon={PencilSquareIcon}
                    variant='transparent'
                    additionalClassName='right-sm top-sm absolute w-[32px]! h-[32px]! fill-black/20 hover:fill-black/80 focus:fill-black/80'
                    showChildren={false}
                    onClick={handleAction}
                >
                    {localization.edit}
                </Button>
            )}
            <BaseElement
                className={`rounded-sm border border-default ${hasOnClick ? 'cursor-pointer' : 'cursor-default'} flex aspect-square w-full flex-col`}
                onClick={handleClick}
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className='flex-1'></div>
                {hasDescription && (
                    <div className='bg-secondary-light/20 p-lg text-justify text-base'>
                        <span className='text-default'>{description}</span>
                    </div>
                )}
            </BaseElement>
        </div>
    );
};
