import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const role = localStorage.getItem("user_role");

        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        window.location.href = "/login";
    };

    if (location.pathname.startsWith("/autism-info/")) {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/section-selection-page" className="hover:underline">Escolher Seção</a>
                {userRole === "admin" && (
                    <>
                    <a href="/forum-edit" className="hover:underline">
                        Adicionar Seções
                    </a>
                    </>
                )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/section-selection-page") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                {userRole === "admin" && (
                    <>
                    <a href="/forum-edit" className="hover:underline">
                        Adicionar Seções
                    </a>
                    </>
                )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/teste") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                {userRole === "admin" && (

                    <a href="/upload-data" className="hover:underline">
                        Enviar dados
                    </a>
                )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/register-patient") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/see-patients" className="hover:underline">Ver Pacientes</a>
                    <a href="/appointmentForNewPatient" className="hover:underline">Nova anamnese</a>
                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/register-doctor") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/see-doctors" className="hover:underline">Ver Médicos</a>
                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/see-patients") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/register-patient" className="hover:underline">Cadastrar Paciente</a>
                    <a href="/appointmentForNewPatient" className="hover:underline">Nova anamnese</a>
                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/see-doctors") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/register-doctor" className="hover:underline">Cadastrar Médico</a>
                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/add-appointment") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/see-patients" className="hover:underline">Ver Pacientes</a>
                    <a href="/appointmentForNewPatient" className="hover:underline">Nova anamnese</a>

                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    if (location.pathname === "/appointmentForNewPatient") {
        return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/see-patients" className="hover:underline">Ver Pacientes</a>
                    <a href="/register-patient" className="hover:underline">Cadastrar Paciente</a>
                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
        );
    }

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="w-full flex justify-between items-center px-8">
                <h1 className="text-2xl font-bold">ConsulTEA</h1>

                <nav className="space-x-4">
                    <a href="/" className="hover:underline">Início</a>
                    <a href="/section-selection-page" className="hover:underline">Dados</a>

                    {!isLoggedIn ? (
                        <a href="/login" className="hover:underline">Login</a>
                    ) : (
                        <>
                            <a href="/see-patients" className="hover:underline">
                                Ver Pacientes
                            </a>

                            {userRole === "admin" && (
                                <a href="/see-doctors" className="hover:underline">
                                    Ver Médicos
                                </a>
                            )}

                            <button onClick={handleLogout} className="hover:underline">
                                Sair
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}