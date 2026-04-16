import { useState } from 'react';
import { uploadSong } from '../services/songService';

export default function UploadSong({ onUploaded }) {
    const [form, setForm] = useState({ title: '', artist: '', album: '', genre: '', duration: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!file || !form.title || !form.artist) {
            setError('Titulo, artista y archivo son obligatorios');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', form.title);
            formData.append('artist', form.artist);
            if (form.album) formData.append('album', form.album);
            if (form.genre) formData.append('genre', form.genre);
            if (form.duration) formData.append('duration', form.duration);
            await uploadSong(formData);
            setSuccess('Cancion subida correctamente, pendiente de aprobacion');
            setForm({ title: '', artist: '', album: '', genre: '', duration: '' });
            setFile(null);
            if (onUploaded) onUploaded();
        } catch {
            setError('Error al subir la cancion');
        }
        setLoading(false);
    };

    return (
        <div className="upload-form">
            <h3>🎵 Subir nueva cancion</h3>
            {success && <p className="saved-msg">{success}</p>}
            {error && <p className="error">{error}</p>}
            <div className="upload-grid">
                <input placeholder="Titulo *" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })} />
                <input placeholder="Artista *" value={form.artist}
                    onChange={e => setForm({ ...form, artist: e.target.value })} />
                <input placeholder="Album" value={form.album}
                    onChange={e => setForm({ ...form, album: e.target.value })} />
                <input placeholder="Genero" value={form.genre}
                    onChange={e => setForm({ ...form, genre: e.target.value })} />
                <input placeholder="Duracion (segundos)" type="number" value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })} />
                <div className="file-input-wrapper">
                    <label className="file-label">
                        {file ? `📁 ${file.name}` : '📁 Seleccionar MP3'}
                        <input type="file" accept=".mp3,audio/*"
                            style={{ display: 'none' }}
                            onChange={e => setFile(e.target.files[0])} />
                    </label>
                </div>
            </div>
            <button className="upload-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Subiendo...' : 'Subir cancion'}
            </button>
        </div>
    );
}