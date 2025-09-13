import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    // Функция для определения активного пути
    const isActiveLink = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div>
            <div className="flex items-center justify-center bg-white shadow py-4">
                <h1 className="text-3xl font-bold text-green-600 flex items-center">
                    TatTranslate
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Tatarstan.svg/640px-Flag_of_Tatarstan.svg.png"
                        alt="Флаг Татарстана"
                        className="w-8 h-6 rounded-sm shadow-md ml-2"
                    />
                </h1>
            </div>
            <nav className="flex items-center justify-center p-4 bg-white shadow-sm">
                <NavLink
                    to="/"
                    className={isActiveLink('/') ? 'p-5 mx-4 border-b-2 border-green-500 text-green-500 font-semibold transition-colors duration-200' : 'p-5 mx-4 border-b-2 border-transparent text-gray-500 hover:text-green-500 transition-colors duration-200'}
                >
                    Загрузка
                </NavLink>
                <NavLink
                    to="/edit"
                    className={isActiveLink('/edit') ? 'p-5 mx-4 border-b-2 border-green-500 text-green-500 font-semibold transition-colors duration-200' : 'p-5 mx-4 border-b-2 border-transparent text-gray-500 hover:text-green-500 transition-colors duration-200'}
                >
                    Редактирование
                </NavLink>
                <NavLink
                    to="/export"
                    className={isActiveLink('/export') ? 'p-5 mx-4 border-b-2 border-green-500 text-green-500 font-semibold transition-colors duration-200' : 'p-5 mx-4 border-b-2 border-transparent text-gray-500 hover:text-green-500 transition-colors duration-200'}
                >
                    Экспорт
                </NavLink>
            </nav>
        </div>
    );
};

export default Navbar;