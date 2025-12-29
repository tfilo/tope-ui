import type { FlexProps } from './Flex.types';

const theme = {
    direction: {
        row: 'mobile:flex-row flex-col',
        column: 'flex-col'
    },
    gap: {
        none: '',
        xs: 'gap-xs',
        sm: 'gap-sm',
        md: 'gap-md',
        lg: 'gap-lg',
        xl: 'gap-xl'
    },
    justify: {
        none: '',
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between'
    }
} as const;

/**
 * Flex component renders as HTMLDivElement element with defined flex classes to ensure unified behavior across app use this instead of specifying flex class everywhere
 */
export const Flex: React.FC<FlexProps> = ({
    direction = 'row',
    gap = 'md',
    justify = direction === 'row' ? 'end' : 'none',
    additionalClassName = '',
    children
}) => {
    return (
        <div
            className={`w-full flex ${theme.direction[direction]} ${theme.gap[gap]} ${theme.justify[justify]} ${additionalClassName}`.trim()}
        >
            {children}
        </div>
    );
};
