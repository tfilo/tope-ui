import { useState, useEffect } from 'react';

/**
 * Hook returing responsive breakpoints for mobile, tablet, desktop sizes
 *
 * @returns window size as 'desktop', 'tablet' or 'mobile'
 */
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowSize(window.innerWidth);

        // Listener for resize event
        window.addEventListener('resize', handleResize);

        // Remove listener for resize event in cleanup function
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (windowSize >= 1280) {
        return 'desktop';
    }

    if (windowSize >= 768) {
        return 'tablet';
    }

    return 'mobile';
};

export default useWindowSize;
