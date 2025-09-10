import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import TrimTimeLine from "./TrimTimeLine.tsx";

interface VideoPlayerProps {
    trimStart: number;
    trimEnd: number;
    onTrimChange: (start: number, end: number) => void;
}

const VideoPlayer = ({ trimStart, trimEnd, onTrimChange }: VideoPlayerProps) => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // url видео берём из UploadPage
    const [videoUrl] = useState(localStorage.getItem("uploadedVideo"));

    // плеер: состояния
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [rate, setRate] = useState(1);

    useEffect(() => {
        if (!videoUrl) {
            navigate("/");
            return;
        }
    }, [videoUrl, navigate]);

    // подписки на события видео
    useEffect(() => {
        const v: any = videoRef.current;
        if (!v) return;

        const onTime = () => {
            setCurrentTime(v.currentTime);

            // ⛔️ если дошли до trimEnd → стоп
            if (v.currentTime >= trimEnd) {
                v.pause();
                setIsPlaying(false);
            }
        };

        const onMeta = () => {
            const d = isFinite(v.duration) ? v.duration : 0;
            setDuration(d);
            onTrimChange(0, d); // при загрузке видео
        };

        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);

        return () => {
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
        };
    }, [trimEnd, onTrimChange]);

    // применяем громкость/мьют/скорость
    useEffect(() => {
        const v: any = videoRef.current;
        if (!v) return;
        v.volume = volume;
        v.muted = muted;
        v.playbackRate = rate;
    }, [volume, muted, rate]);

    const togglePlay = () => {
        const v:any = videoRef.current;
        if (!v) return;

        if (v.paused) {
            // 🎯 если вышли за пределы диапазона → стартуем с trimStart
            if (v.currentTime < trimStart || v.currentTime >= trimEnd) {
                v.currentTime = trimStart;
            }
            v.play();
            setIsPlaying(true);
        } else {
            v.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const t = Number(e.target.value);
        if (videoRef.current) videoRef.current.currentTime = t;
        setCurrentTime(t);
    };

    const handleMuteToggle = () => setMuted((m) => !m);

    const format = (t: number) => {
        if (!t || isNaN(t)) return "00:00";
        const mm = Math.floor(t / 60)
            .toString()
            .padStart(2, "0");
        const ss = Math.floor(t % 60)
            .toString()
            .padStart(2, "0");
        return `${mm}:${ss}`;
    };

    // подсветка диапазона на таймлайне
    const pct = (x: number) => (duration > 0 ? (x / duration) * 100 : 0);
    const trackBg = `linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 ${pct(trimStart)}%,
    #10b981 ${pct(trimStart)}%,
    #10b981 ${pct(trimEnd)}%,
    #3b82f6 ${pct(trimEnd)}%,
    #3b82f6 100%
  )`;

    if (!videoUrl) return null;

    return (
        <div className="w-full max-w-3xl">
            {/* Видео с оверлеем */}
            <div
                ref={containerRef}
                className="relative bg-black rounded-lg overflow-hidden shadow-lg"
                style={{aspectRatio: "16 / 9", maxHeight: "80vh"}}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain bg-black"
                    controls={false}
                />

                {/* Контролы поверх видео */}
                <div className="absolute inset-0 flex flex-col justify-end">
                    {/* градиент снизу для читаемости */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>

                    <div className="relative z-10 p-4 space-y-3">
                        {/* Таймлайн */}
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full accent-blue-500"
                            style={{background: trackBg}}
                        />

                        {/* нижняя панель */}
                        <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={togglePlay}
                                    className="p-2 rounded-md hover:bg-white/30"
                                >
                                    {isPlaying ? "⏸" : "▶️"}
                                </button>

                                <button
                                    onClick={handleMuteToggle}
                                    className="p-2 rounded-md hover:bg-white/30"
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
                                    className="text-white p-1 rounded-lg"
                                >
                                    <option value={0.5} className="bg-black rounded-lg">0.5x</option>
                                    <option value={0.75} className="bg-black rounded-lg">0.75x</option>
                                    <option value={1} className="bg-black rounded-lg">1x</option>
                                    <option value={1.25} className="bg-black rounded-lg">1.25x</option>
                                    <option value={1.5} className="bg-black rounded-lg">1.5x</option>
                                    <option value={2} className="bg-black rounded-lg">2x</option>
                                </select>

                                <div className="ml-3 text-gray-200">
                                    {format(currentTime)} / {format(duration)}
                                </div>

                                <button
                                    onClick={() => {
                                        if (containerRef.current) {
                                            if (document.fullscreenElement) {
                                                document.exitFullscreen();
                                            } else {
                                                (containerRef.current as HTMLElement).requestFullscreen();
                                            }
                                        }
                                    }}
                                    className="gap-x-200 p-2 rounded-md hover:bg-white/30"
                                >
                                    ⛶
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TrimTimeLine duration={duration} trimStart={trimStart} trimEnd={trimEnd} onTrimChange={onTrimChange}/>

        </div>
    )
}

export default VideoPlayer;