import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDocument, getCollection } from "../services/firestoreService";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { registerStudentValidationSchema } from "../utils/validationSchemas";

export default function RegisterStudent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    getCollection("materias").then(setMaterias);
  }, []);

  // Agrupar materias equivalentes para el select
  const equivalencias = {
    'Programación Web 2': 'Front 2',
    'Front 2': 'Front 2',
    'Programación Web 1': 'Front 1',
    'Front 1': 'Front 1',
  };
  const materiasUnicas = Array.from(
    new Map(
      materias.map((mat) => [equivalencias[mat.nombre] || mat.nombre, mat])
    ).values()
  );

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", subject: "", token: "" },
    validationSchema: registerStudentValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setLoading(true);
      setMessage("");
      try {
        // Validar token de materia (acepta codigoSecreto o token)
        const materia = materias.find(m => m.nombre === values.subject);
        const codigo = materia?.codigoSecreto || materia?.token;
        if (!materia || !codigo || values.token !== codigo) {
          setFieldError("token", "Código secreto incorrecto para la materia seleccionada");
          setLoading(false);
          return;
        }
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        await setDocument("users", user.uid, { role: "estudiante", email: user.email, name: values.name, subject: values.subject });
        setMessage("Estudiante registrado correctamente. Ya puedes iniciar sesión.");
        resetForm();
      } catch (err) {
        setMessage("Error: " + err.message);
        setFieldError("email", " ");
      }
      setLoading(false);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 relative overflow-hidden">
      {/* Parches de color tipo post-it, aún más repetidos y variados */}
      <div className="hidden sm:block absolute top-0 left-0 w-40 h-40 bg-yellow-200 rounded-2xl rotate-12 shadow-xl z-0" style={{opacity:0.85}}></div>
      <div className="hidden sm:block absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-xl -rotate-6 shadow-xl z-0" style={{opacity:0.8}}></div>
      <div className="hidden sm:block absolute bottom-0 right-0 w-56 h-56 bg-green-200 rounded-3xl rotate-3 shadow-xl z-0" style={{opacity:0.7}}></div>
      <div className="hidden sm:block absolute bottom-10 left-10 w-28 h-28 bg-pink-200 rounded-xl -rotate-3 shadow-lg z-0" style={{opacity:0.7}}></div>
      <div className="hidden sm:block absolute top-1/2 left-1/2 w-36 h-36 bg-blue-100 rounded-2xl -translate-x-1/2 -translate-y-1/2 shadow-lg z-0" style={{opacity:0.6}}></div>
      <div className="hidden sm:block absolute top-1/4 right-1/4 w-24 h-24 bg-yellow-100 rounded-xl rotate-2 shadow-md z-0" style={{opacity:0.6}}></div>
      <div className="hidden sm:block absolute top-1/3 left-1/3 w-20 h-20 bg-green-100 rounded-xl rotate-3 shadow-md z-0" style={{opacity:0.5}}></div>
      <div className="hidden sm:block absolute bottom-1/4 right-1/3 w-24 h-16 bg-pink-300 rounded-2xl -rotate-2 shadow-lg z-0" style={{opacity:0.6}}></div>
      <div className="hidden sm:block absolute top-2/3 left-1/4 w-16 h-24 bg-blue-300 rounded-xl rotate-6 shadow-md z-0" style={{opacity:0.5}}></div>
      <div className="hidden sm:block absolute bottom-1/3 left-1/2 w-20 h-20 bg-yellow-300 rounded-2xl -rotate-12 shadow-lg z-0" style={{opacity:0.5}}></div>
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-6">
          <svg className="w-16 h-16 text-blue-500 mb-2 animate-bounce-slow" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Registro de Estudiante</h2>
          <p className="text-blue-400 text-sm">Crea tu cuenta para consultar tus notas</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-blue-700 font-medium mb-1">Nombre completo</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre del estudiante"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${formik.touched.name && formik.errors.name ? "border-red-400" : "border-blue-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-blue-700 font-medium mb-1">Correo electrónico</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.091 7.091a2.25 2.25 0 01-3.182 0L3.409 8.584A2.25 2.25 0 012.75 6.993V6.75" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Correo del estudiante"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${formik.touched.email && formik.errors.email ? "border-red-400" : "border-blue-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-blue-700 font-medium mb-1">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V8.25A4.5 4.5 0 008 8.25v2.25m8.25 0a2.25 2.25 0 01-4.5 0m4.5 0V12a6 6 0 01-12 0v-1.5m12 0V12a6 6 0 01-12 0v-1.5" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${formik.touched.password && formik.errors.password ? "border-red-400" : "border-blue-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                minLength={6}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="subject" className="block text-blue-700 font-medium mb-1">Materia</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              <select
                id="subject"
                name="subject"
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${formik.touched.subject && formik.errors.subject ? "border-red-400" : "border-blue-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="" disabled>Selecciona una materia</option>
                {materiasUnicas.map((mat) => (
                  <option key={mat.id} value={equivalencias[mat.nombre] || mat.nombre}>
                    {equivalencias[mat.nombre] || mat.nombre}
                  </option>
                ))}
              </select>
            </div>
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.subject}</p>
            )}
          </div>
          <div>
            <label htmlFor="token" className="block text-blue-700 font-medium mb-1">Código secreto de la materia</label>
            <input
              id="token"
              name="token"
              type="text"
              className="pl-3 pr-4 py-2 w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={formik.values.token}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              autoComplete="off"
            />
            {formik.touched.token && formik.errors.token && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.token}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          {message && <p className={`text-center text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-blue-600'}`}>{message}</p>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">¿Ya tienes cuenta?</span>
          <Link to="/login" className="ml-2 text-blue-600 hover:underline font-semibold text-sm transition">
            Inicia sesión
          </Link>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}
