import type { ColumnProps } from './Column.types';

const theme = {
    base: (colSpan: 1 | 2 | 3 | 4) => {
        switch (colSpan) {
            case 2:
                return 'desktop:col-span-2 tablet:col-span-full mobile:col-span-full';
            case 3:
                return 'desktop:col-span-3 tablet:col-span-full mobile:col-span-full';
            case 4:
                return 'desktop:col-span-4 tablet:col-span-full mobile:col-span-full';
            default:
                return '';
        }
    }
};

export const Column: React.FC<ColumnProps> = ({ children, colspan = 1, className = '' }) => {
    return <div className={[theme.base(colspan), className].join(' ').trim()}>{children}</div>;
};
