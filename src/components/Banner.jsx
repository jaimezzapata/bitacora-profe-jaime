export default function Banner({ nombre, email, role, logout }) {
  const mostrarNombre = nombre && nombre !== email ? nombre : email;
  return (
    <div className="w-full bg-blue-600 shadow z-20">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center gap-4">
          <svg
            className="w-12 h-12 text-blue-200 bg-blue-700 rounded-full p-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
          <div>
            <div className="text-lg sm:text-xl font-bold">{mostrarNombre}</div>
            <div className="text-blue-100 text-sm">{email}</div>
            <div className="text-blue-200 text-xs mt-1">
              Rol: <span className="font-semibold">{role}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition-all duration-200 text-sm md:text-base"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
