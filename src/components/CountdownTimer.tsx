import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    endsAt: Date;
    extended?: boolean; // true when anti-sniping kicked in
}

function getTimeLeft(endsAt: Date) {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s, totalSeconds };
}

export default function CountdownTimer({ endsAt, extended = false }: CountdownTimerProps) {
    const [time, setTime] = useState(() => getTimeLeft(endsAt));

    useEffect(() => {
        setTime(getTimeLeft(endsAt));
        const id = setInterval(() => setTime(getTimeLeft(endsAt)), 1000);
        return () => clearInterval(id);
    }, [endsAt]);

    const { h, m, s, totalSeconds } = time;
    const isOver = totalSeconds === 0;
    const isCritical = totalSeconds <= 120 && !isOver;   // ≤ 2 min — anti-sniping zone
    const isWarning = totalSeconds <= 300 && !isCritical && !isOver; // ≤ 5 min

    const pad = (n: number) => String(n).padStart(2, '0');

    const colorClass = isOver
        ? 'text-neutral-600'
        : isCritical
            ? 'text-red-400'
            : isWarning
                ? 'text-amber-400'
                : 'text-neutral-200';

    return (
        <div className="flex items-center gap-2">
            <span className={`font-mono text-sm tabular-nums ${colorClass} ${isCritical ? 'animate-pulse' : ''}`}>
                {isOver ? 'Ended' : h > 0 ? `${h}h ${pad(m)}m ${pad(s)}s` : `${pad(m)}m ${pad(s)}s`}
            </span>
            {isCritical && !isOver && (
                <span className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-sm">
                    Anti-Snipe
                </span>
            )}
            {extended && !isCritical && (
                <span className="text-[9px] uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-sm">
                    Extended
                </span>
            )}
        </div>
    );
}
