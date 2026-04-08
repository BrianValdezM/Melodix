import { usePlayer } from '../context/PlayerContext';
import { toggleFavorite } from '../services/favoriteService';

export default function SongCard({ song, onFavoriteChange }) {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const isActive = currentSong?.id === song.id;

    const handleFavorite = async (e) => {
        e.stopPropagation();
        await toggleFavorite(song.id);
        if (onFavoriteChange) onFavoriteChange();
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '--:--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`song-card ${isActive ? 'active' : ''}`} onClick={() => playSong(song)}>
            <div className="song-icon">{isActive && isPlaying ? '🎵' : '🎶'}</div>
            <div className="song-info">
                <p className="song-title">{song.title}</p>
                <p className="song-artist">{song.artist}</p>
            </div>
            <p className="song-genre">{song.genre}</p>
            <p className="song-duration">{formatDuration(song.duration)}</p>
            <button className="fav-btn" onClick={handleFavorite}>♥</button>
        </div>
    );
}