import { Link, useNavigate } from 'react-router-dom';
import { removeToken, isAdmin } from '../services/authService';
import ProfileMenu from './ProfileMenu';

export default function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <h1 className="logo">🎵 Melodix</h1>
            <nav>
                <Link to="/">🏠 Inicio</Link>
                <Link to="/favorites">❤️ Favoritos</Link>
                <Link to="/playlists">📂 Playlists</Link>
                <Link to="/artist">🎤 Mi espacio artista</Link>
                {isAdmin() && <Link to="/admin">🛡️ Administracion</Link>}
            </nav>
            <div style={{ marginTop: 'auto' }}>
                <ProfileMenu />
                <button className="logout-btn" onClick={handleLogout}>
                    Cerrar sesion
                </button>
            </div>
        </div>
    );
}