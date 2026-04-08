import { useState } from 'react';
import { register, setToken } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(form);
            setToken(res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/');
        } catch {
            setError('Error al registrarse, intenta con otro email');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>🎵 Melodix</h1>
                <h2>Crear cuenta</h2>
                {error && <p className="error">{error}</p>}
                <input placeholder="Nombre de usuario"
                    value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <input placeholder="Email" type="email"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Contraseña" type="password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button onClick={handleSubmit}>Registrarse</button>
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
            </div>
        </div>
    );
}