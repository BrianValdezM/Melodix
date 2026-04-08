import { useEffect, useState } from 'react';
import { getPlaylists, createPlaylist, addSongToPlaylist } from '../services/playlistService';
import { getAllSongs } from '../services/songService';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [selected, setSelected] = useState(null);
    const [newName, setNewName] = useState('');
    const [songs, setSongs] = useState([]);
    const { setQueue } = usePlayer();

    const fetchPlaylists = async () => {
        const res = await getPlaylists();
        setPlaylists(res.data);
    };

    const fetchSongs = async () => {
        const res = await getAllSongs();
        setSongs(res.data);
    };

    useEffect(() => { fetchPlaylists(); fetchSongs(); }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        await createPlaylist({ name: newName });
        setNewName('');
        fetchPlaylists();
    };

    const handleSelectPlaylist = (pl) => {
        setSelected(pl);
        setQueue(pl.songs);
    };

    const handleAddSong = async (songId) => {
        if (!selected) return;
        await addSongToPlaylist(selected.id, songId);
        fetchPlaylists();
    };

    return (
        <div className="page">
            <h2>📂 Mis Playlists</h2>
            <div className="create-playlist">
                <input placeholder="Nombre de nueva playlist"
                    value={newName} onChange={e => setNewName(e.target.value)} />
                <button onClick={handleCreate}>Crear</button>
            </div>
            <div className="playlists-grid">
                {playlists.map(pl => (
                    <div key={pl.id} className={`playlist-card ${selected?.id === pl.id ? 'active' : ''}`}
                        onClick={() => handleSelectPlaylist(pl)}>
                        <h3>📂 {pl.name}</h3>
                        <p>{pl.totalSongs} canciones</p>
                    </div>
                ))}
            </div>
            {selected && (
                <div className="playlist-detail">
                    <h3>Canciones en "{selected.name}"</h3>
                    {selected.songs.map(song => <SongCard key={song.id} song={song} />)}
                    <h3 style={{ marginTop: '20px' }}>Agregar canciones</h3>
                    {songs.filter(s => !selected.songs.find(ps => ps.id === s.id)).map(song => (
                        <div key={song.id} className="song-card" onClick={() => handleAddSong(song.id)}>
                            <div className="song-icon">➕</div>
                            <div className="song-info">
                                <p className="song-title">{song.title}</p>
                                <p className="song-artist">{song.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}