import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDocument } from "../services/firestoreService";

export default function TempRegisterProfe() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDocument("users", user.uid, { role: "profesor", email: user.email });
      setMessage("Usuario profesor creado y rol asignado correctamente.");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Registrar Profesor Temporal</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Correo del profesor"
          className="w-full px-3 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-3 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar Profesor"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}
    </div>
  );
}
