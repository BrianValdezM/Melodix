import { useEffect, useState } from 'react';
import { getMySongs } from '../services/songService';
import { getProfile } from '../services/userService';
import UploadSong from '../components/UploadSong';
import axios from 'axios';
import { getToken } from '../services/authService';

export default function ArtistDashboard() {
    const [songs, setSongs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [showRequestForm, setShowRequestForm] = useState(false);

    const fetchData = async () => {
        const res = await getProfile();
        setProfile(res.data);
        if (res.data.role === 'ARTIST' || res.data.role === 'ADMIN') {
            const songs = await getMySongs();
            setSongs(songs.data);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleRequestArtist = async () => {
        try {
            await axios.post('http://localhost:8080/api/artist-requests',
                { comment: motivation },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setRequestSent(true);
            setShowRequestForm(false);
        } catch (e) {
            alert(e.response?.data?.message || 'Ya tienes una solicitud pendiente');
        }
    };

    const statusBadge = (status) => {
        const map = {
            PENDING: { label: 'Pendiente', color: '#f39c12' },
            APPROVED: { label: 'Aprobada', color: '#1db954' },
            REJECTED: { label: 'Rechazada', color: '#e74c3c' }
        };
        const s = map[status] || map.PENDING;
        return <span style={{ color: s.color, fontWeight: 'bold', fontSize: 12 }}>{s.label}</span>;
    };

    if (!profile) return <div className="page"><p>Cargando...</p></div>;

    const isArtist = profile.role === 'ARTIST' || profile.role === 'ADMIN';

    return (
        <div className="page">
            <h2>🎤 Panel de Artista</h2>

            {/* Si NO es artista */}
            {!isArtist && (
                <div className="artist-request-box">
                    <h3>Conviertete en artista</h3>
                    <p>Solicita el rol de artista para poder subir tus canciones a Melodix.</p>
                    {requestSent ? (
                        <p className="saved-msg">Solicitud enviada, espera la aprobacion del admin.</p>
                    ) : showRequestForm ? (
                        <div className="request-form">
                            <textarea
                                placeholder="Cuentanos por que quieres ser artista en Melodix..."
                                value={motivation}
                                onChange={e => setMotivation(e.target.value)}
                                rows={4}
                            />
                            <div className="form-actions">
                                <button className="cancel-btn" onClick={() => setShowRequestForm(false)}>
                                    Cancelar
                                </button>
                                <button className="save-btn" onClick={handleRequestArtist}>
                                    Enviar solicitud
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="edit-btn" onClick={() => setShowRequestForm(true)}>
                            Solicitar ser artista
                        </button>
                    )}
                </div>
            )}

            {/* Si ES artista */}
            {isArtist && (
                <>
                    <UploadSong onUploaded={fetchData} />
                    <div className="my-songs-section">
                        <h3>Mis canciones ({songs.length})</h3>
                        {songs.length === 0 && <p style={{ color: '#aaa' }}>No has subido canciones aun.</p>}
                        {songs.map(song => (
                            <div key={song.id} className="song-card">
                                <div className="song-icon">🎵</div>
                                <div className="song-info">
                                    <p className="song-title">{song.title}</p>
                                    <p className="song-artist">{song.artist}</p>
                                </div>
                                <p className="song-genre">{song.genre}</p>
                                <div>{statusBadge(song.status)}</div>
                                {song.status === 'REJECTED' && (
                                    <p style={{ color: '#e74c3c', fontSize: 11 }}>
                                        {song.rejectionReason}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}