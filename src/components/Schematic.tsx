import { FunctionComponent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { renderSchematic } from '../../3d_test';

interface SchematicProps {
    schematic: string;
}

const Container = styled.div``;

export const Schematic: FunctionComponent<SchematicProps> = ({
    schematic,
    ...rest
}) => {
    const ref = useRef<HTMLCanvasElement>();

    useEffect(() => {
        if (schematic && ref.current) {
            return renderSchematic(ref.current, schematic);
        }
    }, [schematic]);

    return (
        <Container {...rest}>
            <canvas ref={ref} />
        </Container>
    );
};
