import type { ListProps } from './List.types';

const theme = {
    base: (listType: ListProps['listType']) => `${listType === 'unordered' ? 'list-disc' : 'list-decimal'} list-inside text-default`
} as const;

/**
 * Renders list component, based on props it can be unordered list with bullets or ordered list with numbers
 */
export const List: React.FC<ListProps> = ({ listType = 'unordered', items = [], 'data-testid': dataTestId }) => {
    const List = listType === 'unordered' ? 'ul' : 'ol';

    return (
        <List
            className={theme.base(listType)}
            data-testid={dataTestId}
        >
            {items.map((item, idx) => (
                <li
                    key={`item_${idx}_${item}`}
                    data-testid={dataTestId ? `${dataTestId}_item_${idx}` : undefined}
                >
                    {item}
                </li>
            ))}
        </List>
    );
};
