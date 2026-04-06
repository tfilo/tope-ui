import type { GridProps } from './Grid.types';

const theme = {
    base: (maxRows: 4 | 2 | 1) => {
        switch (maxRows) {
            case 4:
                return 'grid desktop:grid-cols-4 tablet:grid-cols-2 mobile:grid-cols-1 gap-lg';
            case 2:
                return 'grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-lg';
            case 1:
                return 'grid desktop:grid-cols-1 tablet:grid-cols-1 mobile:grid-cols-1 gap-lg';
        }
    }
} as const;

/**
 * Renders grid element as div with children
 */
export const Grid: React.FC<GridProps> = ({ children, maxRows = 4 }) => {
    return <div className={theme.base(maxRows)}>{children}</div>;
};
