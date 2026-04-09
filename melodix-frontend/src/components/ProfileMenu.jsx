import { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile, uploadAvatar } from '../services/userService';

export default function ProfileMenu() {
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ username: '', address: '', phone: '' });
    const [saved, setSaved] = useState(false);
    const menuRef = useRef();
    const fileRef = useRef();

    const fetchProfile = async () => {
        const res = await getProfile();
        setProfile(res.data);
        setForm({
            username: res.data.username || '',
            address: res.data.address || '',
            phone: res.data.phone || ''
        });
    };

    useEffect(() => {
        fetchProfile();
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
                setEditing(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSave = async () => {
        await updateProfile(form);
        await fetchProfile();
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await uploadAvatar(formData);
        await fetchProfile();
    };

    if (!profile) return null;

    return (
        <div className="profile-menu-wrapper" ref={menuRef}>
            {/* Botón del perfil */}
            <div className="profile-trigger" onClick={() => setOpen(!open)}>
                {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="avatar" className="avatar-img" />
                ) : (
                    <div className="avatar-placeholder">
                        {profile.username?.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="profile-name">{profile.username}</span>
                <span className="profile-arrow">{open ? '▲' : '▼'}</span>
            </div>

            {/* Menú desplegable */}
            {open && (
                <div className="profile-dropdown">
                    {/* Header del menú */}
                    <div className="profile-header">
                        <div className="avatar-container" onClick={() => fileRef.current.click()}>
                            {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="avatar" className="avatar-large" />
                            ) : (
                                <div className="avatar-large-placeholder">
                                    {profile.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="avatar-overlay">📷</div>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*"
                            style={{ display: 'none' }} onChange={handleAvatarChange} />
                        <div>
                            <p className="profile-username">{profile.username}</p>
                            <p className="profile-email">{profile.email}</p>
                        </div>
                    </div>

                    <div className="profile-divider" />

                    {/* Info o formulario */}
                    {!editing ? (
                        <div className="profile-info">
                            <div className="profile-field">
                                <span className="field-label">📧 Email</span>
                                <span className="field-value">{profile.email}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">📍 Dirección</span>
                                <span className="field-value">{profile.address || 'No registrada'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">📞 Teléfono</span>
                                <span className="field-value">{profile.phone || 'No registrado'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">💳 Facturación</span>
                                <span className="field-value field-badge">Plan Gratuito</span>
                            </div>
                            <button className="edit-btn" onClick={() => setEditing(true)}>
                                ✏️ Editar perfil
                            </button>
                        </div>
                    ) : (
                        <div className="profile-form">
                            <label>Nombre de usuario</label>
                            <input value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })} />
                            <label>Dirección</label>
                            <input value={form.address} placeholder="Tu dirección"
                                onChange={e => setForm({ ...form, address: e.target.value })} />
                            <label>Teléfono</label>
                            <input value={form.phone} placeholder="Tu teléfono"
                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <div className="form-actions">
                                <button className="cancel-btn" onClick={() => setEditing(false)}>
                                    Cancelar
                                </button>
                                <button className="save-btn" onClick={handleSave}>
                                    Guardar
                                </button>
                            </div>
                            {saved && <p className="saved-msg">✅ Guardado correctamente</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}