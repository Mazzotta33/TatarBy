
const VideoPlayer = () => {
    return (
        <div
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden shadow-lg w-full max-w-3xl"
            style={{aspectRatio: "16 / 9", maxHeight: "80vh"}}
        >
            {/* само видео */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain bg-black"
                controls={false}
            />

            {/* оверлей контролы */}
            <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <div className="relative z-10 p-4 pointer-events-auto">
                    {/* Главный таймлайн c подсветкой выбранного диапазона */}
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full accent-blue-500"
                        style={{background: trackBg}}
                        aria-label="Таймлайн"
                    />

                    {/* нижняя панель: плей/мьют/громкость/скорость/время */}
                    <div className="mt-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="p-2 bg-white/10 rounded-md hover:bg-white/20"
                                title="Воспроизвести / Пауза"
                            >
                                {isPlaying ? "⏸" : "▶️"}
                            </button>

                            <button
                                onClick={handleMuteToggle}
                                className="p-2 bg-white/10 rounded-md hover:bg-white/20"
                                title="Вкл/выкл звук"
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
                                aria-label="Громкость"
                            />

                            <select
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                className="bg-white/10 text-white p-1 rounded"
                                aria-label="Скорость"
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
                    </div>

                    {/* ТРИМ — выбор начала/конца (синхроним таймлайн и видео) */}
                    <div className="mt-4 p-3 bg-black/40 rounded-lg">
                        <div className="flex gap-6 items-center text-sm text-white">
                            <div className="flex flex-col">
                                <label className="mb-1">Начало: {format(trimStart)}</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.1}
                                    value={trimStart}
                                    onChange={(e) => {
                                        const value = Math.min(
                                            Number(e.target.value),
                                            trimEnd - 0.1
                                        );
                                        setTrimStart(value);
                                        setCurrentTime(value);
                                        if (videoRef.current)
                                            videoRef.current.currentTime = value;
                                    }}
                                    className="w-44 accent-green-500"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-1">Конец: {format(trimEnd)}</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.1}
                                    value={trimEnd}
                                    onChange={(e) => {
                                        const value = Math.max(
                                            Number(e.target.value),
                                            trimStart + 0.1
                                        );
                                        setTrimEnd(value);
                                        setCurrentTime(value);
                                        if (videoRef.current)
                                            videoRef.current.currentTime = value;
                                    }}
                                    className="w-44 accent-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer;