import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../Redux/store/languageSlice';

// Import your JSON translation files
import ru from '../translations/ru.json';
import tat from '../translations/tat.json';

const translations = { ru, tat };

const Navbar = () => {
    const dispatch = useDispatch();
    const currentLanguage = useSelector(state => state.language.current);

    // Helper function to get translated text
    const t = (key) => translations[currentLanguage][key];

    return (
        <nav className="bg-white p-4 mt-8 rounded-3xl shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="text-4xl font-bold text-gray-800 flex items-center">
                    <img src="./../../public/Logo.png" alt="logo" className="mr-4 w-72 h-15 mt-3" />
                </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="hidden md:inline p-4 text-black md:text-lg">
                    {t('site_language')}
                </span>
                <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-full border border-gray-200">
                    <button
                        onClick={() => dispatch(setLanguage('ru'))}
                        className={`px-4 py-2 rounded-full font-semibold ${
                            currentLanguage === 'ru' ? 'bg-green-500 text-white' : 'text-gray-500'
                        }`}
                    >
                        {t('rus')}
                    </button>
                    <button
                        onClick={() => dispatch(setLanguage('tat'))}
                        className={`px-4 py-2 rounded-full font-semibold ${
                            currentLanguage === 'tat' ? 'bg-green-500 text-white' : 'text-gray-500'
                        }`}
                    >
                        {t('tat')}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;