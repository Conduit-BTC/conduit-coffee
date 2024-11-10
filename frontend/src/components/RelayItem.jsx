import ProtocolToggle from "./ProtocolToggle";
import { X } from "lucide-react";

const RelayItem = ({ relay, isNip17, onToggle, onRemove }) => {
    // Split the relay URL into protocol and rest for styled display
    const [protocol, ...rest] = relay.split('://');
    const restOfUrl = rest.join('://');

    return (
        <div className="group relative bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 p-4">
                <ProtocolToggle
                    isNip17={isNip17}
                    onToggle={onToggle} />

                {/* URL Display with enhanced protocol visibility */}
                <div className="flex-1 font-mono text-sm overflow-hidden">
                    <div className="flex flex-wrap items-center gap-x-1 p-2 px-4 bg-black/50 rounded-md">
                        <span className="font-semibold text-blue-400">
                            {`${protocol}://`}
                        </span>
                        <span className="text-gray-300 break-all">
                            {`${restOfUrl}`}
                        </span>
                    </div>
                </div>

                {/* Remove button with hover effect */}
                <button
                    onClick={onRemove}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                    aria-label="Remove relay"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Subtle hover effect highlight */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};

export default RelayItem;
