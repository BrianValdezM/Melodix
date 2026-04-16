import { useState } from 'react';
import { login, setToken, setRole } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            setToken(res.data.token);
            setRole(res.data.role);
            localStorage.setItem('username', res.data.username);
            navigate('/');
        } catch {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>🎵 Melodix</h1>
                <h2>Iniciar sesion</h2>
                {error && <p className="error">{error}</p>}
                <input placeholder="Email" type="email"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Contrasena" type="password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button onClick={handleSubmit}>Entrar</button>
                <p>No tienes cuenta? <Link to="/register">Registrate</Link></p>
            </div>
        </div>
    );
}