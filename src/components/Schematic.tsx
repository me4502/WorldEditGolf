import { FunctionComponent, useRef, useEffect } from 'react';
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
        border: solid 2px rgba(28, 28, 28, 0.3);
    }
`;

export const Schematic: FunctionComponent<SchematicProps> = ({
    schematic,
    size = 500,
    ...rest
}) => {
    const ref = useRef<HTMLCanvasElement>();

    useEffect(() => {
        if (schematic && ref.current) {
            return renderSchematic(ref.current, schematic, size);
        }
    }, [schematic]);

    return (
        <Container {...rest}>
            <canvas ref={ref} />
        </Container>
    );
};
