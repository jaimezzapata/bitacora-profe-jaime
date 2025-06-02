import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return null; // No renderices nada si está autenticado

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 relative overflow-hidden">
      {/* Parches de color tipo post-it, fondo dinámico */}
      <div
        className="hidden sm:block absolute top-0 left-0 w-40 h-40 bg-pink-200 rounded-2xl rotate-12 shadow-xl z-0"
        style={{ opacity: 0.85 }}
      ></div>
      <div
        className="hidden sm:block absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-xl -rotate-6 shadow-xl z-0"
        style={{ opacity: 0.8 }}
      ></div>
      <div
        className="hidden sm:block absolute bottom-0 right-0 w-56 h-56 bg-green-200 rounded-3xl rotate-3 shadow-xl z-0"
        style={{ opacity: 0.7 }}
      ></div>
      <div
        className="hidden sm:block absolute bottom-10 left-10 w-28 h-28 bg-yellow-200 rounded-xl -rotate-3 shadow-lg z-0"
        style={{ opacity: 0.7 }}
      ></div>
      <div
        className="hidden sm:block absolute top-1/2 left-1/2 w-36 h-36 bg-pink-100 rounded-2xl -translate-x-1/2 -translate-y-1/2 shadow-lg z-0"
        style={{ opacity: 0.6 }}
      ></div>
      <div
        className="hidden sm:block absolute top-1/4 right-1/4 w-24 h-24 bg-blue-100 rounded-xl rotate-2 shadow-md z-0"
        style={{ opacity: 0.6 }}
      ></div>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4 sm:p-8 animate-fade-in relative z-10 mt-10 mb-10">
        {/* Post-it: Presentación */}
        <div className="bg-yellow-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-yellow-200 relative hover:scale-105 transition-transform duration-300">
          <svg
            className="w-16 h-16 text-blue-400 mb-2 animate-bounce-slow"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-extrabold text-blue-700 text-center drop-shadow-lg mb-2">
            Bitácora: El profe Jaime
          </h1>
          <p className="text-base text-blue-800 text-center font-semibold">
            Una app ligera y significativa para registrar y compartir notas de
            clase y preguntas frecuentes, construida con amor, código y vocación
            docente.
          </p>
        </div>
        {/* Post-it: Bienvenida */}
        <div className="bg-pink-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-pink-200 relative hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-pink-700 mb-2">
            👋 Bienvenido
          </h2>
          <p className="text-base text-blue-900 text-center">
            Hola, soy <b>Jaime Zapata</b> — desarrollador Front-End, docente de
            desarrollo de software y apasionado por enseñar de forma clara,
            cercana y con propósito.
          </p>
          <p className="mt-2 text-base text-blue-900 text-center">
            Esta aplicación conecta dos mundos que amo: <b>enseñar</b> y{" "}
            <b>crear con código</b>. Es una solución propia, práctica y humana
            para compartir con mis estudiantes lo esencial de cada clase, sin
            depender de plataformas rígidas o procesos innecesarios.
          </p>
        </div>
        {/* Post-it: ¿Por qué esta app? */}
        <div className="bg-blue-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-blue-200 relative hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            🎯 ¿Por qué esta aplicación?
          </h2>
          <p className="text-base text-blue-900 text-center">
            Durante cada clase, suelo abrir un bloc de notas donde escribo ideas
            clave, reflexiones espontáneas o explicaciones que surgen
            naturalmente. Pero luego, compartir ese contenido en plataformas
            como Moodle resulta lento y poco amigable.
          </p>
          <p className="mt-2 text-base text-blue-900 text-center italic">
            Así nació esta app: un espacio ágil, bonito y muy mío, donde puedo
            guardar lo esencial de cada semana y compartirlo de forma rápida y
            organizada.
          </p>
        </div>
        {/* Post-it: Propósito */}
        <div className="bg-green-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-green-200 relative hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            🧠 Propósito
          </h2>
          <p className="text-base text-blue-900 text-center">
            Bitácora: El profe Jaime busca ser una extensión viva de mi forma de
            enseñar: clara, tranquila, directa y con foco en lo importante. Es
            una herramienta para comunicar, recordar y acompañar a mis
            estudiantes más allá del aula.
          </p>
          <div className="mt-4 p-3 bg-green-200 border-2 border-green-400 rounded-xl shadow-lg animate-pulse">
            <p className="text-lg font-extrabold text-green-900 text-center">
              ¡Te invito a usar la Bitácora!{" "}
              <span className="text-green-700">
                Regístrate, explora y úsala
              </span>
            </p>
          </div>
        </div>
        {/* Post-it: Funcionalidades principales 1 */}
        <div className="bg-yellow-50 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-yellow-200 relative hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">
            Funcionalidades principales
          </h2>
          <ul className="list-disc pl-5 text-base text-blue-900 text-left w-full">
            <li>
              <b>🔐 Autenticación con Firebase:</b> Login y registro para
              estudiantes y profesor.
            </li>
            <li>
              <b>🧑‍🏫 Rol profesor:</b> Acceso al panel de gestión: materias,
              semanas, notas rápidas y FAQs.
            </li>
            <li>
              <b>🎓 Rol estudiante:</b> Navegación por materia y semana con
              acceso solo lectura.
            </li>
            <li>
              <b>🗂️ Gestión de materias y semanas:</b> Crear, editar y asociar
              contenido organizado por semana.
            </li>
          </ul>
        </div>
        {/* Post-it: Funcionalidades principales 2 */}
        <div className="bg-yellow-50 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-yellow-200 relative hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2">
            Más funcionalidades
          </h2>
          <ul className="list-disc pl-5 text-base text-blue-900 text-left w-full">
            <li>
              <b>📝 Notas rápidas:</b> Registro de ideas, conceptos clave o
              explicaciones tipo post-it.
            </li>
            <li>
              <b>❓ Preguntas frecuentes (FAQ):</b> Sección de preguntas comunes
              por semana para reforzar conceptos.
            </li>
            <li>
              <b>🌐 Interfaz pública protegida:</b> Solo usuarios autenticados
              pueden acceder, según su rol.
            </li>
            <li>
              <b>📱 Responsive y rápida:</b> Diseñada para funcionar bien en
              móviles, tablets y PC.
            </li>
          </ul>
        </div>
      </div>
      {/* Botones de acceso siempre en la esquina superior derecha */}
      <div className="fixed top-6 right-8 z-30 flex gap-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-xl shadow-xl text-base transition-all duration-200 border-4 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register-student"
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-5 rounded-xl shadow-xl text-base transition-all duration-200 border-4 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          Registrarse
        </Link>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1, transform: none; } }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}
