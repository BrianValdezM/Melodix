import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../services/authService';

export default function Sidebar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <h1 className="logo">🎵 Melodix</h1>
            <p className="sidebar-user">Hola, {username}</p>
            <nav>
                <Link to="/">🏠 Inicio</Link>
                <Link to="/favorites">❤️ Favoritos</Link>
                <Link to="/playlists">📂 Playlists</Link>
            </nav>
            <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}