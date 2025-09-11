import { useState, useRef, useEffect, useCallback } from "react";

interface TrimTimelineProps {
    duration: number;
    trimStart: number;
    trimEnd: number;
    onTrimChange: (start: number, end: number) => void;
}

const TrimTimeLine = ({ duration, trimStart, trimEnd, onTrimChange }: TrimTimelineProps) => {
    const [localStart, setLocalStart] = useState(trimStart);
    const [localEnd, setLocalEnd] = useState(trimEnd);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [isDraggingStart, setIsDraggingStart] = useState(false);
    const [isDraggingEnd, setIsDraggingEnd] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [scrollOffset, setScrollOffset] = useState(0);

    useEffect(() => {
        setLocalStart(trimStart);
        setLocalEnd(trimEnd);
    }, [trimStart, trimEnd]);

    const formatTime = (t: number) => {
        if (!t || isNaN(t)) return "00:00";
        const mm = Math.floor(t / 60).toString().padStart(2, "0");
        const ss = Math.floor(t % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

    const generateTicks = useCallback((d: number, step: number) => {
        const ticks = [];
        for (let i = 0; i <= d; i += step) {
            ticks.push(i);
        }
        return ticks;
    }, []);

    const ticks = generateTicks(duration, 5);

    // Обработчики перетаскивания маркеров
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();

        // Рассчитываем новую позицию в секундах
        const totalTimelineWidth = duration * 20 * zoomLevel;
        let newTimeInPixels = e.clientX - rect.left + timelineRef.current.scrollLeft;
        let newTime = (newTimeInPixels / totalTimelineWidth) * duration;

        newTime = Math.max(0, Math.min(newTime, duration));

        if (isDraggingStart) {
            const newStart = Math.min(newTime, localEnd - 0.5);
            setLocalStart(newStart);
            onTrimChange(newStart, localEnd);
        } else if (isDraggingEnd) {
            const newEnd = Math.max(newTime, localStart + 0.5);
            setLocalEnd(newEnd);
            onTrimChange(localStart, newEnd);
        }
    }, [isDraggingStart, isDraggingEnd, localStart, localEnd, duration, onTrimChange, zoomLevel, scrollOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDraggingStart(false);
        setIsDraggingEnd(false);
    }, []);

    useEffect(() => {
        if (isDraggingStart || isDraggingEnd) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDraggingStart, isDraggingEnd, handleMouseMove, handleMouseUp]);

    const handleWheelScroll = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            setScrollOffset(prev => Math.max(0, Math.min(prev + e.deltaY, duration * (timelineRef.current?.offsetWidth || 0) / duration / zoomLevel - (timelineRef.current?.offsetWidth || 0))));
        }
    }, [duration, zoomLevel]);

    const timelineTotalWidth = duration * 20 * zoomLevel;

    return (
        <div className="w-full h-70 bg-white rounded-lg p-4 mt-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                    Временная шкала
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))} className="p-1 hover:bg-gray-100 rounded">➖</button>
                    <button onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.2))} className="p-1 hover:bg-gray-100 rounded">➕</button>
                    <span>{formatTime(0)} - {formatTime(duration)}</span> {/* TODO: это должно меняться при зуме */}
                </div>
            </div>

            <div
                ref={timelineRef}
                className="relative h-50 overflow-x-auto border border-gray-200 rounded-md"
                onWheel={handleWheelScroll}
            >
                <div
                    className="absolute inset-0 flex items-center h-full"
                    style={{ width: timelineTotalWidth, left: -scrollOffset }}
                >

                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-8 bg-green-400/40 rounded-md"
                        style={{
                            left: `${(localStart / duration) * timelineTotalWidth}px`,
                            width: `${((localEnd - localStart) / duration) * timelineTotalWidth}px`,
                        }}
                    />

                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-10 w-1 bg-red-500 cursor-ew-resize z-10"
                        style={{ left: `${(localStart / duration) * timelineTotalWidth}px` }}
                        onMouseDown={() => setIsDraggingStart(true)}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-10 w-1 bg-red-500 cursor-ew-resize z-10"
                        style={{ left: `${(localEnd / duration) * timelineTotalWidth}px` }}
                        onMouseDown={() => setIsDraggingEnd(true)}
                    />

                    <div className="absolute top-0 w-full h-full flex items-start">
                        {ticks.map((t) => (
                            <div
                                key={t}
                                className="absolute select-none h-full border-l border-gray-300 flex flex-col justify-start pt-1 text-xs text-gray-600"
                                style={{ left: `${(t / duration) * timelineTotalWidth}px` }}
                            >
                                <span className="-ml-4">{formatTime(t)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end select-none text-xs text-red-500 mt-2">
                ✂ {formatTime(localStart)} – {formatTime(localEnd)}
            </div>
        </div>
    );
};

export default TrimTimeLine;