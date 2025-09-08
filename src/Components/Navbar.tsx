// Navbar.tsx
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-center p-4 bg-white shadow">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `p-2 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                }
            >
                Загрузка
            </NavLink>
            <NavLink
                to="/edit"
                className={({ isActive }) =>
                    `p-2 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                }
            >
                Редактирование
            </NavLink>
            <NavLink
                to="/export"
                className={({ isActive }) =>
                    `p-2 mx-4 border-b-2 ${isActive ? 'border-green-500 text-green-500 font-semibold' : 'border-transparent text-gray-500'}`
                }
            >
                Экспорт
            </NavLink>
        </nav>
    );
};

export default Navbar;