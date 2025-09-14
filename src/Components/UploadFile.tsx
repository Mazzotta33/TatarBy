import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {useUploadAudioMutation, useUploadVideoMutation} from "../Redux/api/videoApi.ts";
import { useSelector } from "react-redux";

import ru from '../translations/ru.json';
import tat from '../translations/tat.json';

const translations = { ru, tat };

const UploadFile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRefSubtitles = useRef<HTMLInputElement | null>(null);
    const fileInputRefAudio = useRef<HTMLInputElement | null>(null);

    const [uploadVideo, { isLoading, data, error }] = useUploadVideoMutation();
    const [uploadAudio, { isLoading: isAudioLoading, data: audioData, error: audioError }] = useUploadAudioMutation();

    const [activeCard, setActiveCard] = useState<string | null>('subtitles');

    const currentLanguage = useSelector(state => state.language.current);
    const t = (key) => translations[currentLanguage][key];

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, targetPath: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            let res;

            if (e.target === fileInputRef.current || e.target === fileInputRefSubtitles.current) {
                res = await uploadVideo(file).unwrap();
                const videoUrl = typeof res === "string" ? res : res.videoUrl;
                localStorage.setItem("originalVideo", videoUrl);
                localStorage.setItem("currentVideo", videoUrl);

            } else if (e.target === fileInputRefAudio.current) {
                res = await uploadAudio(file).unwrap();
                const audioUrl = typeof res === "string" ? res : res.audioUrl;
                localStorage.setItem("originalAudio", audioUrl);
                localStorage.setItem("currentAudio", audioUrl);

            } else {
                return;
            }

            console.log(`Загрузка успешно завершена. Попытка навигации по пути: ${targetPath}`);

            navigate(targetPath);

            console.log(`Навигация вызвана.`);
        } catch (err) {
            console.error("Ошибка загрузки:", err);
        }
    };

    const handleVideoTranslate = () => {
        setActiveCard('video');
        fileInputRef.current?.click();
    };

    const handleAudioTranslate = () => {
        setActiveCard('audio');
        fileInputRefAudio.current?.click();
    };

    const handleSubtitlesCreate = () => {
        setActiveCard('subtitles');
        fileInputRefSubtitles.current?.click();
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 my-8 text-center leading-tight">
                <span className="text-green-600">{t('main_title').split(' ').slice(0, 1)}</span>&nbsp;
                <span className="inline-flex items-center">
                    <img src="./../../public/star.png" className="w-10 h-10 inline-block" alt="star"/>
                </span>
                {t('main_title').split(' ').slice(1, 2)}&nbsp;
                <span className="text-green-600">{t('main_title').split(' ')[2]}</span>&nbsp;
                <span className="">{t('main_title').split(' ')[3]}</span>
                <br/>
                {t('main_title').split(' ').slice(4, 6).join(' ')}&nbsp;
                <span className="inline-flex items-center justify-center">
                    <span className="text-green-700">{t('main_title').split(' ').slice(6, 8).join(' ')}</span>&nbsp;
                    <img
                        src="./../../public/tatarstan.png"
                        alt="Флаг Татарстана"
                        className="w-12 h-10 rounded overflow-hidden mt-5"
                    />
                </span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center">
                {!isLoading ? (
                    <>
                        <div className="flex-1 bg-white p-8 rounded-xl shadow-lg mb-30 mt-10 flex flex-col items-start border border-gray-200">
                            <img src="./../../public/camera.png" className="w-12 h-12 mb-4" alt="star"/>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('video_card_title')}</h2>
                            <ul className="text-left text-sm text-gray-600 space-y-2 mb-8 w-full">
                                <li className="flex items-center"><span className="text-green-500 mr-2"><img src="./../../public/star.png"
                                                                                                             className="w-6 h-6 rounded overflow-hidden "/></span>{t('video_feature_1')}
                                </li>
                                <li className="flex items-center"><span className="text-green-500 mr-2">
                                    <img src="./../../public/star.png" className="w-6 h-6 rounded overflow-hidden "/>
                                </span>{t('video_feature_2')}
                                </li>
                                <li className="flex items-center"><span className="text-green-500 mr-2"><img
                                    src="./../../public/star.png" className="w-6 h-6 rounded overflow-hidden "/></span>{t('video_feature_3')}
                                </li>
                            </ul>
                            <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e, "/edit")}
                                className="hidden"
                            />
                            <button
                                onClick={handleVideoTranslate}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105 transition mt-auto"
                            >
                                {t('video_card_title')}
                            </button>
                        </div>

                        <div
                            className="flex-1 bg-white p-8 rounded-xl shadow-lg mb-30 mt-10 flex flex-col items-start border border-gray-200">
                            <img src="./../../public/audio.png" className="w-12 h-12 mb-4" alt="star"/>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('audio_card_title')}</h2>
                            <ul className="text-left text-sm text-gray-600 space-y-2 mb-8 w-full">
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/orangeStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('audio_feature_1')}
                                </li>
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/orangeStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('audio_feature_2')}
                                </li>
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/orangeStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('audio_feature_3')}
                                </li>
                            </ul>
                            <input
                                type="file"
                                accept="audio/*"
                                ref={fileInputRefAudio}
                                onChange={(e) => handleFileChange(e, "/editAudio")}
                                className="hidden"
                            />
                            <button
                                onClick={handleAudioTranslate}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow hover:shadow-lg hover:brightness-105 transition mt-auto"
                            >
                                {t('audio_card_title')}
                            </button>
                        </div>

                        <div
                            className="flex-1 bg-white p-8 rounded-xl shadow-lg mb-30 mt-10 flex flex-col items-start border border-gray-200">
                            <img src="./../../public/subtitles.png" className="w-12 h-12 mb-4" alt="star"/>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{t('subtitles_card_title')}</h2>
                            <ul className="text-left text-sm text-gray-600 space-y-2 mb-8 w-full">
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/blueStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('subtitles_feature_1')}
                                </li>
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/blueStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('subtitles_feature_2')}
                                </li>
                                <li className="flex items-center"><span className="text-orange-500 mr-2">
                                    <img src="./../../public/blueStar.png" className="w-5 h-5 rounded overflow-hidden "/>
                                </span>{t('subtitles_feature_3')}
                                </li>
                            </ul>
                            <input
                                type="file"
                                accept="video/*"
                                ref={fileInputRefSubtitles}
                                onChange={(e) => handleFileChange(e, "/editAudio")}
                                className="hidden"
                            />
                            <button
                                onClick={handleSubtitlesCreate}
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600 text-white font-semibold shadow hover:shadow-lg hover:brightness-105 transition mt-auto"
                            >
                                {t('subtitles_card_title')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-16 rounded-xl shadow-md text-center w-full max-w-lg border border-gray-200">
                        <div className="p-4">
                            <h2 className="text-xl font-medium text-gray-600 mb-3">{t('uploading_title')}</h2>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-green-500 h-3 transition-all duration-200"
                                    style={{ width: `100%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{t('uploading_text')}</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-600 mt-4">{t('error_message')}</p>
            )}
        </div>
    );
};

export default UploadFile;