import type { ListProps } from './List.types';

export const List: React.FC<ListProps> = ({ listType = 'unordered', items = [] }) => {
    const List = listType === 'unordered' ? 'ul' : 'ol';

    return (
        <List className={`${listType === 'unordered' ? 'list-disc' : 'list-decimal'} list-inside text-default`}>
            {items.map((item, idx) => (
                <li key={`item_${idx}_${item}`}>{item}</li>
            ))}
        </List>
    );
};
