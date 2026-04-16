import { useEffect, useState } from 'react';
import {
    getPendingSongs, approveSong, rejectSong,
    getPendingArtists, approveArtist, rejectArtist
} from '../services/adminService';

export default function Admin() {
    const [tab, setTab] = useState('songs');
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [rejectComment, setRejectComment] = useState({});
    const [showReject, setShowReject] = useState({});

    const fetchData = async () => {
        const [s, a] = await Promise.all([getPendingSongs(), getPendingArtists()]);
        setSongs(s.data);
        setArtists(a.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleApproveSong = async (id) => {
        await approveSong(id);
        fetchData();
    };

    const handleRejectSong = async (id) => {
        await rejectSong(id, rejectComment[id] || 'No cumple los requisitos');
        setShowReject({ ...showReject, [id]: false });
        fetchData();
    };

    const handleApproveArtist = async (id) => {
        await approveArtist(id, 'Solicitud aprobada');
        fetchData();
    };

    const handleRejectArtist = async (id) => {
        await rejectArtist(id, rejectComment[id] || 'Solicitud rechazada');
        setShowReject({ ...showReject, [id]: false });
        fetchData();
    };

    return (
        <div className="page">
            <h2>🛡️ Panel de Administracion</h2>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${tab === 'songs' ? 'active' : ''}`}
                    onClick={() => setTab('songs')}>
                    🎵 Canciones pendientes
                    {songs.length > 0 && <span className="badge">{songs.length}</span>}
                </button>
                <button
                    className={`admin-tab ${tab === 'artists' ? 'active' : ''}`}
                    onClick={() => setTab('artists')}>
                    🎤 Solicitudes de artistas
                    {artists.length > 0 && <span className="badge">{artists.length}</span>}
                </button>
            </div>

            {/* Canciones pendientes */}
            {tab === 'songs' && (
                <div className="admin-section">
                    {songs.length === 0 && (
                        <div className="empty-state">
                            <p>No hay canciones pendientes</p>
                        </div>
                    )}
                    {songs.map(song => (
                        <div key={song.id} className="admin-card">
                            <div className="admin-card-info">
                                <h3>{song.title}</h3>
                                <p>{song.artist} {song.album && `· ${song.album}`}</p>
                                <p style={{ color: '#888', fontSize: 12 }}>
                                    Subida por: {song.uploadedBy} · {song.genre}
                                </p>
                                <audio controls src={`http://localhost:8080/api/songs/${song.id}/stream`}
                                    style={{ marginTop: 8, width: '100%', height: 30 }} />
                            </div>
                            <div className="admin-card-actions">
                                <button className="approve-btn" onClick={() => handleApproveSong(song.id)}>
                                    Aprobar
                                </button>
                                <button className="reject-btn"
                                    onClick={() => setShowReject({ ...showReject, [song.id]: !showReject[song.id] })}>
                                    Rechazar
                                </button>
                                {showReject[song.id] && (
                                    <div className="reject-form">
                                        <input placeholder="Razon del rechazo"
                                            value={rejectComment[song.id] || ''}
                                            onChange={e => setRejectComment({ ...rejectComment, [song.id]: e.target.value })} />
                                        <button className="reject-btn"
                                            onClick={() => handleRejectSong(song.id)}>
                                            Confirmar rechazo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Solicitudes de artistas */}
            {tab === 'artists' && (
                <div className="admin-section">
                    {artists.length === 0 && (
                        <div className="empty-state">
                            <p>No hay solicitudes pendientes</p>
                        </div>
                    )}
                    {artists.map(req => (
                        <div key={req.id} className="admin-card">
                            <div className="admin-card-info">
                                <h3>{req.username}</h3>
                                <p style={{ color: '#aaa', fontSize: 13 }}>{req.email}</p>
                                <div className="motivation-box">
                                    <p style={{ fontSize: 13, color: '#ccc' }}>{req.motivation}</p>
                                </div>
                                <p style={{ color: '#888', fontSize: 11 }}>
                                    Solicitado: {new Date(req.requestedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="admin-card-actions">
                                <button className="approve-btn" onClick={() => handleApproveArtist(req.id)}>
                                    Aprobar artista
                                </button>
                                <button className="reject-btn"
                                    onClick={() => setShowReject({ ...showReject, [req.id]: !showReject[req.id] })}>
                                    Rechazar
                                </button>
                                {showReject[req.id] && (
                                    <div className="reject-form">
                                        <input placeholder="Razon del rechazo"
                                            value={rejectComment[req.id] || ''}
                                            onChange={e => setRejectComment({ ...rejectComment, [req.id]: e.target.value })} />
                                        <button className="reject-btn"
                                            onClick={() => handleRejectArtist(req.id)}>
                                            Confirmar rechazo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}