import { useFormContext } from '../../hooks/form-context';
import { Button } from '../../general';
import type { ButtonProps } from '../../general/button/Button.types';

export const ResetButton: React.FC<Omit<ButtonProps<'button'>, 'as' | 'ref' | 'type'>> = ({ children, onClick, ...props }) => {
    const form = useFormContext();
    return (
        <Button
            type='reset'
            variant='danger'
            onClick={(e) => {
                form.reset();
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </Button>
    );
};
