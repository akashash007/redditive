import {
    CircleCheck,
    XCircle,
    Info,
    AlertTriangle,
    Loader2,
} from "lucide-react";
import clsx from "clsx";

const iconSize = 22;
const stroke = 1.25; // thinner outline

const iconMap = {
    success: <CircleCheck size={iconSize} strokeWidth={stroke} className="text-green-400" />,
    error: <XCircle size={iconSize} strokeWidth={stroke} className="text-red-400" />,
    info: <Info size={iconSize} strokeWidth={stroke} className="text-blue-400" />,
    warning: <AlertTriangle size={iconSize} strokeWidth={stroke} className="text-yellow-400" />,
    loading: <Loader2 size={iconSize} strokeWidth={stroke} className="text-white animate-spin" />,
};

export const Toast = ({ type = "info", title, description }) => {
    return (
        <div
            className={clsx(
                "w-80 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-lg flex items-center gap-3 transition-all duration-300",
                {
                    "bg-gradient-to-br from-green-700/20 to-emerald-600/10 border-green-400/30":
                        type === "success",
                    "bg-gradient-to-br from-red-700/20 to-orange-600/10 border-red-400/30":
                        type === "error",
                    "bg-gradient-to-br from-purple-800/30 to-purple-600/20 border-purple-500/30":
                        type === "info",
                    "bg-gradient-to-br from-yellow-600/20 to-yellow-500/10 border-yellow-400/30":
                        type === "warning",
                    "bg-gradient-to-br from-slate-800/20 to-slate-700/10 border-slate-500/30":
                        type === "loading",
                }
            )}
        >
            <div className="flex-shrink-0">{iconMap[type]}</div>
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-white">{title}</p>
                {description && (
                    <p className="text-sm text-white/80 mt-0.5 leading-snug">{description}</p>
                )}
            </div>
        </div>
    );
};

export default Toast;
