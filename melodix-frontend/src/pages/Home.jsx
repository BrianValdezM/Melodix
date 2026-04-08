import { useEffect, useState } from 'react';
import { getAllSongs, searchSongs } from '../services/songService';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';

export default function Home() {
    const [songs, setSongs] = useState([]);
    const [query, setQuery] = useState('');
    const { setQueue } = usePlayer();

    const fetchSongs = async () => {
        const res = await getAllSongs();
        setSongs(res.data);
        setQueue(res.data);
    };

    const handleSearch = async (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 1) {
            const res = await searchSongs(val);
            setSongs(res.data);
        } else {
            fetchSongs();
        }
    };

    useEffect(() => { fetchSongs(); }, []);

    return (
        <div className="page">
            <h2>🎵 Todas las canciones</h2>
            <input className="search-input" placeholder="Buscar canciones..."
                value={query} onChange={handleSearch} />
            <div className="song-list">
                {songs.length === 0 && <p>No hay canciones aun.</p>}
                {songs.map(song => <SongCard key={song.id} song={song} onFavoriteChange={fetchSongs} />)}
            </div>
        </div>
    );
}