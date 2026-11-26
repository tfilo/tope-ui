import { localization } from '../../utils/constants';
import type { LoadingOverlayProps } from './LoadingOverlay.types';

const theme = {
    base: 'absolute inset-none z-20 animate-[tope-ui-reveal-page-loading_0s_200ms_both] bg-white/60 backdrop-blur-sm',
    content: 'sticky top-[50dvh] mx-auto flex w-fit -translate-y-1/2 flex-col items-center gap-md',
    spinner: 'size-[40px] rounded-full border-4 border-primary/20 border-t-primary motion-safe:animate-spin'
} as const;

/** Covers a relatively positioned page with a blurred loading overlay after 200ms. */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ active, label = localization.loading, 'data-testid': dataTestId }) => {
    if (!active) return null;

    return (
        <div
            className={theme.base}
            data-testid={dataTestId}
        >
            <div
                role='status'
                className={theme.content}
            >
                <span
                    aria-hidden='true'
                    className={theme.spinner}
                />
                <span>{label}</span>
            </div>
        </div>
    );
};
