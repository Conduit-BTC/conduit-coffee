import React from 'react';
import { Lock, Unlock } from 'lucide-react';

const ProtocolToggle = ({ isNip17, onToggle }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center text-center gap-2 sm:gap-4 sm:w-auto mb-3">
            <div className={`
        font-mono tracking-wider order-1 sm:order-2
        ${isNip17 ? 'text-yellow-400' : 'text-blue-400'}
      `}>
                <div className="text-base font-bold">{isNip17 ? 'NIP-17' : 'NIP-04'}</div>
                <div className="text-xs opacity-75">
                    {isNip17 ? '(SECURE +)' : '(STANDARD)'}
                </div>
            </div>

            {/* Toggle Switch */}
            <button
                onClick={onToggle}
                className={`
          relative w-[3.75rem] h-8 rounded-lg transition-colors duration-300
          border-2 border-opacity-50 order-2 sm:order-1 p-4
          ${isNip17
                        ? 'bg-black border-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                        : 'bg-gray-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}
        `}
            >
                {/* Track Lighting */}
                <div
                    className={`
            absolute inset-0 rounded-lg transition-opacity duration-300
            ${isNip17
                            ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20'
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'}
          `}
                />

                {/* Slider with Icon */}
                <div
                    className={`
            absolute top-1 left-1 w-6 h-6 rounded-md
            transform transition-all duration-300 ease-out
            ${isNip17
                            ? 'translate-x-6 bg-gradient-to-br from-yellow-400 to-amber-500'
                            : 'translate-x-0 bg-gradient-to-br from-blue-400 to-cyan-500'}
            shadow-lg backdrop-blur-sm
          `}
                >
                    <div className="absolute inset-0 flex items-center justify-center text-black">
                        {isNip17 ? (
                            <Lock size={14} className="animate-bounce" />
                        ) : (
                            <Unlock size={14} />
                        )}
                    </div>
                </div>

                {/* NIP-17 Active Effects */}
                {isNip17 && (
                    <>
                        <div className="absolute inset-0 rounded-lg">
                            <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 animate-ping" />
                        </div>
                        <div className="absolute -inset-1 rounded-lg bg-yellow-400/20 animate-pulse blur-sm" />
                    </>
                )}
            </button>

            {/* Relay URL will be positioned after this component */}
        </div>
    );
};

export default ProtocolToggle;
