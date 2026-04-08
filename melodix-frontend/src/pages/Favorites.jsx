import { useEffect, useState } from 'react';
import { getFavorites } from '../services/favoriteService';
import SongCard from '../components/SongCard';

export default function Favorites() {
    const [songs, setSongs] = useState([]);

    const fetchFavorites = async () => {
        const res = await getFavorites();
        setSongs(res.data);
    };

    useEffect(() => { fetchFavorites(); }, []);

    return (
        <div className="page">
            <h2>❤️ Mis Favoritos</h2>
            <div className="song-list">
                {songs.length === 0 && <p>No tienes favoritos aun.</p>}
                {songs.map(song => <SongCard key={song.id} song={song} onFavoriteChange={fetchFavorites} />)}
            </div>
        </div>
    );
}