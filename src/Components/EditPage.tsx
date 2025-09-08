import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export default function EditPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [videoUrl] = useState(localStorage.getItem("uploadedVideo"));

    if (!videoUrl) {
        navigate("/");
        return null;
    }

    return (
        <div className="p-6 ">
            <button onClick={() => navigate("/")} className="mb-4 text-blue-600">← Назад</button>

            <h2 className="text-xl font-semibold mb-4">Редактирование</h2>

            <div className="flex items-start gap-8">
                {/* Видео слева */}
                <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full max-w-3xl rounded-lg shadow-lg"
                />

                {/* Блок кнопок справа */}
                <div className="flex flex-col gap-4">
                    <button
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow"
                        onClick={() => navigate("/export")}
                    >
                        Перевести видео
                    </button>

                    <button
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow"
                        onClick={() => alert('Обрезка видео (скоро)')}
                    >
                        Обрезать
                    </button>
                </div>
            </div>

        </div>
    );
}
