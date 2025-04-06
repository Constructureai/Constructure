import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import styled from 'styled-components';

const HeroContainer = styled.div`
    width: 100%;
    height: 400px; /* Adjust height as needed */
`;

function ThreeDHero() {
    return (
        <HeroContainer>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Box position={[0, 0, 0]} args={[1, 1, 1]} material-color="blue" />
                <OrbitControls />
            </Canvas>
        </HeroContainer>
    );
}

export default ThreeDHero;