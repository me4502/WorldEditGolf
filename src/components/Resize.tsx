import { useEffect, useState } from 'react';

export const useElementWidth: <T extends HTMLElement>(
    ref: React.MutableRefObject<T>
) => number = ref => {
    const getWidth = () =>
        (ref && ref.current && ref.current.getBoundingClientRect().width) || 0;

    const [width, setWidth] = useState(getWidth());

    useEffect(() => {
        setWidth(getWidth());

        const handleResize = () => {
            setWidth(getWidth());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [ref]);

    return width;
};
