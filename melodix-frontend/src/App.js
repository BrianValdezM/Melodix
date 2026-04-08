import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { isAuthenticated } from './services/authService';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main">
                {children}
                <Player />
            </div>
        </div>
    );
}

export default function App() {
    return (
        <PlayerProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout><Home /></Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/favorites" element={
                        <PrivateRoute>
                            <Layout><Favorites /></Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/playlists" element={
                        <PrivateRoute>
                            <Layout><Playlists /></Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </PlayerProvider>
    );
}