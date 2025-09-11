import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <h1 className="
            flex items-center justify-center bg-white shadow text-green-600 text-3xl font-bold
            ">
                TatTranslate
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Flag_of_Tatarstan.svg/640px-Flag_of_Tatarstan.svg.png"
                    alt="Флаг Татарстана"
                    className="w-8 h-6 rounded-sm shadow"
                />
            </h1>
            <nav className="flex items-center justify-center p-4 bg-white">
                <NavLink
                    to="/"
                    className={({isActive}) =>
                        `p-5 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                    }
                >
                    Загрузка
                </NavLink>
                <NavLink
                    to="/edit"
                    className={({isActive}) =>
                        `p-5 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                    }
                >
                    Редактирование
                </NavLink>
                <NavLink
                    to="/export"
                    className={({isActive}) =>
                        `p-5 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                    }
                >
                    Экспорт
                </NavLink>
            </nav>
        </div>
    );
};

export default Navbar;