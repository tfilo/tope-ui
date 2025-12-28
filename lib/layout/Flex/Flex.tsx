import type { PropsWithChildren } from 'react';

type FlexBase =
    | {
          direction?: 'row';
          justify?: 'start' | 'center' | 'end' | 'between';
          gap?: 'sm' | 'md' | 'lg' | 'xl';
      }
    | {
          direction?: 'column';
          justify?: never;
          gap?: 'sm' | 'md' | 'lg' | 'xl';
      };

type FlexProps = PropsWithChildren<FlexBase>;

const theme = {
    direction: {
        row: 'mobile:flex-row flex-col',
        column: 'flex-col'
    },
    gap: {
        sm: 'gap-sm',
        md: 'gap-md',
        lg: 'gap-lg',
        xl: 'gap-xl'
    },
    justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between'
    }
} as const;

export const Flex: React.FC<FlexProps> = ({ direction = 'row', gap = 'md', justify = 'end', children }) => {
    return <div className={`w-full flex ${theme.direction[direction]} ${theme.gap[gap]} ${theme.justify[justify]}`}>{children}</div>;
};
