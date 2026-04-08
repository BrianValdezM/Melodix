import { useEffect, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function Player() {
    const { currentSong, isPlaying, togglePlay, playNext, playPrev, audioRef } = usePlayer();
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [audioRef]);

    const handleSeek = (e) => {
        const audio = audioRef.current;
        audio.currentTime = (e.target.value / 100) * audio.duration;
        setProgress(e.target.value);
    };

    const handleVolume = (e) => {
        audioRef.current.volume = e.target.value;
        setVolume(e.target.value);
    };

    if (!currentSong) return (
        <div className="player empty">
            <p>🎵 Selecciona una canción para reproducir</p>
        </div>
    );

    return (
        <div className="player">
            <div className="player-info">
                <span className="player-title">{currentSong.title}</span>
                <span className="player-artist">{currentSong.artist}</span>
            </div>
            <div className="player-controls">
                <button onClick={playPrev}>⏮</button>
                <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? '⏸' : '▶️'}
                </button>
                <button onClick={playNext}>⏭</button>
            </div>
            <div className="player-progress">
                <input type="range" min="0" max="100"
                    value={progress} onChange={handleSeek} />
            </div>
            <div className="player-volume">
                🔊 <input type="range" min="0" max="1" step="0.1"
                    value={volume} onChange={handleVolume} />
            </div>
        </div>
    );
}