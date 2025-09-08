import React, { useEffect, useRef, useState } from "react";

export default function FullCustomPlayerTailwind({ src: externalSrc }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [src, setSrc] = useState(externalSrc || null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [rate, setRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 🔹 Состояние для обрезки
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    useEffect(() => {
        if (duration) setTrimEnd(duration);
    }, [duration]);

    useEffect(() => {
        if (externalSrc) setSrc(externalSrc);
    }, [externalSrc]);

    // Подписки на события
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const onTime = () => setCurrentTime(v.currentTime);
        const onMeta = () => setDuration(isFinite(v.duration) ? v.duration : 0);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);
        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);

        return () => {
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
        };
    }, [src]);

    // Fullscreen change
    useEffect(() => {
        const onFS = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", onFS);
        return () => document.removeEventListener("fullscreenchange", onFS);
    }, []);

    // Volume / muted / rate
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = volume;
        v.muted = muted;
        v.playbackRate = rate;
    }, [volume, muted, rate]);

    // Очистка objectURL
    useEffect(() => {
        return () => {
            if (src) URL.revokeObjectURL(src);
        };
    }, [src]);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (src) URL.revokeObjectURL(src);
        const url = URL.createObjectURL(file);
        setSrc(url);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    };

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) v.play();
        else v.pause();
    };

    const handleSeek = (e) => {
        const t = Number(e.target.value);
        if (videoRef.current) videoRef.current.currentTime = t;
        setCurrentTime(t);
    };

    const handleMuteToggle = () => {
        setMuted((m) => !m);
    };

    const handleFullscreen = async () => {
        if (!containerRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.warn("Fullscreen error:", err);
        }
    };

    const handleTrimAndUpload = (start, end) => {
        console.log("Обрезка видео:", start, "—", end);
        // TODO: здесь отправка на backend
    };

    const format = (t) => {
        if (!t || isNaN(t)) return "00:00";
        const mm = Math.floor(t / 60)
            .toString()
            .padStart(2, "0");
        const ss = Math.floor(t % 60)
            .toString()
            .padStart(2, "0");
        return `${mm}:${ss}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                <label className="inline-flex items-center gap-3 text-sm text-gray-200 mb-4">
                    <span>Выберите видео</span>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFile}
                        className="text-xs cursor-pointer"
                    />
                </label>

                <div
                    ref={containerRef}
                    className={`relative mx-auto bg-black rounded-lg overflow-hidden shadow-lg ${
                        isFullscreen ? "w-screen h-screen" : "w-full"
                    }`}
                    style={{
                        aspectRatio: isFullscreen ? undefined : "16 / 9",
                        maxHeight: isFullscreen ? undefined : "80vh",
                    }}
                >
                    {!src ? (
                        <div className="w-full h-64 md:h-96 flex items-center justify-center text-gray-400">
                            Видео не выбрано
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                src={src}
                                className="w-full h-full object-contain bg-black"
                                controls={false}
                            />

                            {/* Панель управления */}
                            <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

                                <div className="relative z-10 p-4 pointer-events-auto">
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 0}
                                        step={0.1}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full accent-blue-500"
                                        style={{
                                            background: `linear-gradient(
                                              to right,
                                              #3b82f6 0%,
                                              #3b82f6 ${(trimStart / duration) * 100}%,
                                              #10b981 ${(trimStart / duration) * 100}%,
                                              #10b981 ${(trimEnd / duration) * 100}%,
                                              #3b82f6 ${(trimEnd / duration) * 100}%,
                                              #3b82f6 100%
                                            )`
                                        }}
                                    />

                                    <div className="mt-3 flex items-center justify-between text-white">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={togglePlay}
                                                className="p-2 bg-white/10 rounded-md hover:bg-white/20"
                                            >
                                                {isPlaying ? "⏸" : "▶️"}
                                            </button>

                                            <button
                                                onClick={handleMuteToggle}
                                                className="p-2 bg-white/5 rounded-md"
                                            >
                                                {muted || volume === 0 ? "🔇" : "🔊"}
                                            </button>

                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                value={muted ? 0 : volume}
                                                onChange={(e) => {
                                                    const v = Number(e.target.value);
                                                    setVolume(v);
                                                    if (v === 0) setMuted(true);
                                                    else setMuted(false);
                                                }}
                                                className="w-28"
                                            />

                                            <select
                                                value={rate}
                                                onChange={(e) => setRate(Number(e.target.value))}
                                                className="bg-white/10 text-white p-1 rounded"
                                            >
                                                <option value={0.5}>0.5x</option>
                                                <option value={0.75}>0.75x</option>
                                                <option value={1}>1x</option>
                                                <option value={1.25}>1.25x</option>
                                                <option value={1.5}>1.5x</option>
                                                <option value={2}>2x</option>
                                            </select>

                                            <div className="text-sm text-gray-200 ml-3">
                                                {format(currentTime)} / {format(duration)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleFullscreen}
                                                className="p-2 bg-white/10 rounded-md"
                                            >
                                                ⛶
                                            </button>
                                        </div>
                                    </div>

                                    {/* 🔹 Блок обрезки */}
                                    <div className="mt-4 p-3 bg-black/40 rounded-lg">
                                        <div className="flex gap-4 items-center text-sm text-white">
                                            <div>
                                                <label>
                                                    Начало: {format(trimStart)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={duration}
                                                    step={0.1}
                                                    value={trimStart}
                                                    onChange={(e) => {
                                                        const value = Math.min(Number(e.target.value), trimEnd - 0.1);
                                                        setTrimStart(value);
                                                        setCurrentTime(value);
                                                        if (videoRef.current) videoRef.current.currentTime = value;
                                                    }}
                                                    className="w-40 accent-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label>
                                                    Конец: {format(trimEnd)}
                                                </label>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={duration}
                                                    step={0.1}
                                                    value={trimEnd}
                                                    onChange={(e) => {
                                                        const value = Math.max(Number(e.target.value), trimStart + 0.1);
                                                        setTrimEnd(value);
                                                        setCurrentTime(value);
                                                        if (videoRef.current) videoRef.current.currentTime = value;
                                                    }}
                                                    className="w-40 accent-red-500"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleTrimAndUpload(trimStart, trimEnd)}
                                                className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                            >
                                                ✂️ Обрезать и отправить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
