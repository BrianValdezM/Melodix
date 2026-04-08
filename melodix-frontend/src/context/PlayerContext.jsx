import { createContext, useContext, useState, useRef } from 'react';
import { streamUrl } from '../services/songService';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const audioRef = useRef(new Audio());

    const playSong = (song) => {
        audioRef.current.pause();
        audioRef.current.src = streamUrl(song.id);
        audioRef.current.play();
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s.id === currentSong.id);
        const next = queue[index + 1];
        if (next) playSong(next);
    };

    const playPrev = () => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s.id === currentSong.id);
        const prev = queue[index - 1];
        if (prev) playSong(prev);
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, togglePlay, playNext, playPrev, setQueue, audioRef }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);