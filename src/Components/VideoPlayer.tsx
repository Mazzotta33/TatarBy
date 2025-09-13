import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrimTimeLine from "./TrimTimeLine";

interface VideoPlayerProps {
    videoUrl: string | null;
    trimStart: number;
    trimEnd: number;
    onTrimChange: (start: number, end: number) => void;
    onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = ({ videoUrl, trimStart, trimEnd, onTrimChange, onTimeUpdate }: VideoPlayerProps) => {
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    //
    // const [videoUrl] = useState<string | null>(localStorage.getItem("currentVideo"));

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [rate, setRate] = useState(1);

    const [showControls, setShowControls] = useState(false);
    const hideTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (v && videoUrl) {
            v.src = videoUrl;
            v.load();
            v.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
        }
    }, [videoUrl]);

    useEffect(() => {
        if (!videoUrl) {
            navigate("/");
            return;
        }
    }, [videoUrl, navigate]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        const onTime = () => {
            const t = v.currentTime;
            setCurrentTime(t);
            onTimeUpdate?.(t);

            if (trimEnd > 0 && t >= trimEnd) {
                v.pause();
                setIsPlaying(false);
            }
        };

        const onMeta = () => {
            const d = isFinite(v.duration) ? v.duration : 0;
            setDuration(d);
            onTrimChange(0, d);
        };

        v.addEventListener("timeupdate", onTime);
        v.addEventListener("loadedmetadata", onMeta);

        return () => {
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("loadedmetadata", onMeta);
        };
    }, [trimEnd, onTrimChange, onTimeUpdate]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = volume;
        v.muted = muted;
        v.playbackRate = rate;
    }, [volume, muted, rate]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
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
        onTimeUpdate?.(t);
    };

    const handleMuteToggle = () => setMuted((m) => !m);

    const format = (t: number) => {
        if (t == null || isNaN(t)) return "00:00";
        const mm = Math.floor(t / 60).toString().padStart(2, "0");
        const ss = Math.floor(t % 60).toString().padStart(2, "0");
        return `${mm}:${ss}`;
    };

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

    const clearHideTimer = () => {
        if (hideTimerRef.current != null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const startAutoHideTimer = (ms = 2500) => {
        clearHideTimer();
        hideTimerRef.current = window.setTimeout(() => {
            setShowControls(false);
            hideTimerRef.current = null;
        }, ms);
    };

    const onMouseEnter = () => {
        setShowControls(true);
        clearHideTimer();
    };

    const onMouseMove = () => {
        setShowControls(true);
        startAutoHideTimer();
    };

    const onMouseLeave = () => {
        clearHideTimer();
        setShowControls(false);
    };

    useEffect(() => {
        return () => {
            clearHideTimer();
        };
    }, []);

    if (!videoUrl) return null;

    return (
        <div className="w-full max-w-3xl">
            <div
                ref={containerRef}
                className="relative bg-black rounded-lg overflow-hidden shadow-lg"
                style={{ aspectRatio: "16 / 9", maxHeight: "80vh" }}
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
            >
                <video
                    key={videoUrl}
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain bg-black"
                    controls={false}
                />

                <div className="absolute inset-0 flex flex-col justify-end">
                    <div
                        className={`relative z-10 p-4 space-y-3 transform transition-all duration-200 ease-in-out
                        ${showControls ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full accent-blue-500"
                            style={{ background: trackBg }}
                        />

                        <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={togglePlay} className="p-2 rounded-md hover:bg-white/10">
                                    {isPlaying ? "⏸" : "▶️"}
                                </button>

                                <button onClick={handleMuteToggle} className="p-2 rounded-md hover:bg-white/10">
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
                                    className="text-white p-1 rounded-lg bg-black/20"
                                >
                                    <option value={0.5}>0.5x</option>
                                    <option value={0.75}>0.75x</option>
                                    <option value={1}>1x</option>
                                    <option value={1.25}>1.25x</option>
                                    <option value={1.5}>1.5x</option>
                                    <option value={2}>2x</option>
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
                                    className="p-2 rounded-md hover:bg-white/10"
                                >
                                    ⛶
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TrimTimeLine duration={duration} trimStart={trimStart} trimEnd={trimEnd} onTrimChange={onTrimChange} />
        </div>
    );
};

export default VideoPlayer;
