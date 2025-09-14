import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.tsx";

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <div className="w-full max-w-5xl"> {/* Общий контейнер для Navbar и Outlet */}
                <Navbar/>
                <main>
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default Layout;