import { FunctionComponent, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderSchematic } from '../../3d_test';

interface SchematicProps {
    schematic: string;
    size?: number;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    canvas {
        width: 0px;
        height: 0px;
        border: solid 2px rgba(28, 28, 28, 0.3);
    }
`;

export const Schematic: FunctionComponent<SchematicProps> = ({
    schematic,
    size = 500,
    ...rest
}) => {
    const ref = useRef<HTMLCanvasElement>();
    const [ resize, setResize ] = useState<(size: number) => void>();

    useEffect(() => {
        if (resize) {
            resize(size);
        }
    }, [size]);

    useEffect(() => {
        if (schematic && ref.current) {
            const { destroy, resize: r } = renderSchematic(ref.current, schematic, size);
            setResize(() => r);
            return destroy;
        }
    }, [schematic]);

    return (
        <Container {...rest}>
            <canvas ref={ref} />
        </Container>
    );
};
