import React from 'react';
import Confetti from 'react-confetti';

export function ConfettiEffect() {
    return (
        <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
        />
    );
}
