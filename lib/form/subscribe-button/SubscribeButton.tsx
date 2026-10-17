import { useFormContext } from '../../hooks/form-context';
import { Button } from '../../general';
import type { ButtonProps } from '../../general/button/Button.types';

export const SubscribeButton: React.FC<Omit<ButtonProps<'button'>, 'as' | 'ref' | 'type'>> = ({
    children,
    disabled,
    onClick,
    ...props
}) => {
    const form = useFormContext();
    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Button
                    disabled={isSubmitting || disabled}
                    type={'submit'}
                    onClick={(e) => {
                        console.log('EVENT', e);
                        onClick?.(e);
                    }}
                    {...props}
                >
                    {children}
                </Button>
            )}
        </form.Subscribe>
    );
};
