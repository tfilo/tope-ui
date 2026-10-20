import { useSyncExternalStore } from 'react';

const subscribe = (onStoreChange: () => void) => {
    window.addEventListener('resize', onStoreChange);

    return () => window.removeEventListener('resize', onStoreChange);
};

const getSnapshot = () => window.innerWidth;

// Use the same desktop fallback on the server and during hydration.
const getServerSnapshot = () => 1280;

/**
 * Hook returning responsive breakpoints for mobile, tablet, desktop sizes.
 * Server rendering uses desktop until the browser viewport is available.
 *
 * @returns window size as 'desktop', 'tablet' or 'mobile'
 */
export const useWindowSize = () => {
    const windowSize = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    if (windowSize >= 1280) {
        return 'desktop';
    }

    if (windowSize >= 768) {
        return 'tablet';
    }

    return 'mobile';
};
