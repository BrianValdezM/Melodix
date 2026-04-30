import { useEffect, useState } from 'react';
import { getMembership, subscribe, getPaymentHistory, cancelMembership } from '../services/membershipService';

export default function Membership() {
    const [membership, setMembership] = useState(null);
    const [history, setHistory] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('PREMIUM_MONTHLY');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showCancel, setShowCancel] = useState(false);

    const [form, setForm] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const fetchData = async () => {
        const [m, h] = await Promise.all([getMembership(), getPaymentHistory()]);
        setMembership(m.data);
        setHistory(h.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubscribe = async () => {
        if (!form.cardholderName || !form.cardNumber || !form.expiryDate || !form.cvv) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (form.cardNumber.length !== 16) {
            setError('El numero de tarjeta debe tener 16 digitos');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await subscribe({ ...form, plan: selectedPlan });
            setSuccess('Pago exitoso, bienvenido a Premium!');
            setShowForm(false);
            setForm({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
            fetchData();
        } catch (e) {
            setError(e.response?.data?.message || 'Error al procesar el pago');
        }
        setLoading(false);
    };

    const handleCancel = async () => {
        await cancelMembership();
        setShowCancel(false);
        fetchData();
    };

    const formatCard = (val) => {
        return val.replace(/\D/g, '').slice(0, 16)
            .replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        return val.replace(/\D/g, '').slice(0, 4)
            .replace(/(.{2})/, '$1/');
    };

    if (!membership) return <div className="page"><p>Cargando...</p></div>;

    const progressPercent = membership.isPremium
        ? Math.min(100, (membership.daysRemaining / (selectedPlan === 'PREMIUM_ANNUAL' ? 365 : 30)) * 100)
        : 0;

    return (
        <div className="page">
            <h2>💎 Membresia</h2>

            {/* Estado actual */}
            <div className="membership-status-card">
                {membership.isPremium ? (
                    <>
                        <div className="premium-badge">✨ PREMIUM ACTIVO</div>
                        <div className="membership-info-grid">
                            <div className="membership-stat">
                                <span className="stat-number">{membership.daysRemaining}</span>
                                <span className="stat-label">dias restantes</span>
                            </div>
                            <div className="membership-stat">
                                <span className="stat-number">
                                    {membership.plan === 'PREMIUM_MONTHLY' ? 'Mensual' : 'Anual'}
                                </span>
                                <span className="stat-label">plan actual</span>
                            </div>
                            <div className="membership-stat">
                                <span className="stat-number">
                                    {new Date(membership.membershipEnd).toLocaleDateString('es-MX')}
                                </span>
                                <span className="stat-label">fecha de vencimiento</span>
                            </div>
                        </div>
                        <div className="progress-bar-wrapper">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <p className="progress-label">
                                {membership.daysRemaining} dias restantes de tu membresia
                            </p>
                        </div>
                        <div className="premium-actions">
                            <button className="renew-btn"
                                onClick={() => { setShowForm(true); setSuccess(''); }}>
                                Renovar membresia
                            </button>
                            <button className="cancel-membership-btn"
                                onClick={() => setShowCancel(true)}>
                                Cancelar membresia
                            </button>
                        </div>
                        {showCancel && (
                            <div className="cancel-confirm">
                                <p>Estas seguro? Perderás todos los beneficios Premium.</p>
                                <div className="form-actions">
                                    <button className="cancel-btn"
                                        onClick={() => setShowCancel(false)}>No, mantener</button>
                                    <button className="reject-btn"
                                        onClick={handleCancel}>Si, cancelar</button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="free-badge">🎵 PLAN GRATUITO</div>
                        <p className="free-desc">
                            Actualiza a Premium y disfruta de la mejor experiencia musical
                        </p>
                    </>
                )}
            </div>

            {success && <p className="saved-msg" style={{ marginBottom: 20 }}>✅ {success}</p>}

            {/* Planes */}
            {!membership.isPremium && !showForm && (
                <>
                    <h3 style={{ marginBottom: 15 }}>Elige tu plan</h3>
                    <div className="plans-grid">
                        {/* Plan Mensual */}
                        <div className={`plan-card ${selectedPlan === 'PREMIUM_MONTHLY' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('PREMIUM_MONTHLY')}>
                            <div className="plan-header">
                                <h3>Mensual</h3>
                                <div className="plan-price">
                                    <span className="price-amount">${membership.monthlyPrice}</span>
                                    <span className="price-period">/mes</span>
                                </div>
                            </div>
                            <ul className="plan-benefits">
                                <li>✅ Sin anuncios</li>
                                <li>✅ Calidad de audio superior</li>
                                <li>✅ Sube tus canciones como artista</li>
                                <li>✅ Cancela cuando quieras</li>
                            </ul>
                            {selectedPlan === 'PREMIUM_MONTHLY' && (
                                <div className="plan-selected-badge">Seleccionado</div>
                            )}
                        </div>

                        {/* Plan Anual */}
                        <div className={`plan-card ${selectedPlan === 'PREMIUM_ANNUAL' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('PREMIUM_ANNUAL')}>
                            <div className="plan-popular">MAS POPULAR</div>
                            <div className="plan-header">
                                <h3>Anual</h3>
                                <div className="plan-price">
                                    <span className="price-amount">${membership.annualPrice}</span>
                                    <span className="price-period">/año</span>
                                </div>
                                <p className="plan-saving">
                                    Ahorra ${(membership.monthlyPrice * 12 - membership.annualPrice).toFixed(0)} vs mensual
                                </p>
                            </div>
                            <ul className="plan-benefits">
                                <li>✅ Sin anuncios</li>
                                <li>✅ Calidad de audio superior</li>
                                <li>✅ Sube tus canciones como artista</li>
                                <li>✅ 2 meses gratis vs mensual</li>
                                <li>✅ Soporte prioritario</li>
                            </ul>
                            {selectedPlan === 'PREMIUM_ANNUAL' && (
                                <div className="plan-selected-badge">Seleccionado</div>
                            )}
                        </div>
                    </div>

                    <button className="subscribe-btn"
                        onClick={() => { setShowForm(true); setError(''); }}>
                        Suscribirse ahora →
                    </button>
                </>
            )}

            {/* Formulario de pago */}
            {showForm && (
                <div className="payment-form">
                    <div className="payment-form-header">
                        <h3>💳 Datos de pago</h3>
                        <span className="payment-plan-badge">
                            {selectedPlan === 'PREMIUM_MONTHLY'
                                ? `Mensual — $${membership.monthlyPrice}/mes`
                                : `Anual — $${membership.annualPrice}/año`}
                        </span>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div className="card-preview">
                        <div className="card-chip">💳</div>
                        <p className="card-number-preview">
                            {form.cardNumber
                                ? form.cardNumber.replace(/\d(?=\d{4})/g, '•').replace(/(.{4})/g, '$1 ').trim()
                                : '•••• •••• •••• ••••'}
                        </p>
                        <div className="card-bottom">
                            <span>{form.cardholderName || 'NOMBRE APELLIDO'}</span>
                            <span>{form.expiryDate || 'MM/AA'}</span>
                        </div>
                    </div>

                    <div className="payment-fields">
                        <div className="payment-field full">
                            <label>Nombre del titular</label>
                            <input placeholder="Como aparece en la tarjeta"
                                value={form.cardholderName}
                                onChange={e => setForm({ ...form, cardholderName: e.target.value.toUpperCase() })} />
                        </div>
                        <div className="payment-field full">
                            <label>Numero de tarjeta</label>
                            <input placeholder="1234 5678 9012 3456"
                                value={formatCard(form.cardNumber)}
                                onChange={e => setForm({ ...form, cardNumber: e.target.value.replace(/\s/g, '') })}
                                maxLength={19} />
                        </div>
                        <div className="payment-field">
                            <label>Fecha de vencimiento</label>
                            <input placeholder="MM/AA"
                                value={form.expiryDate}
                                onChange={e => setForm({ ...form, expiryDate: formatExpiry(e.target.value) })}
                                maxLength={5} />
                        </div>
                        <div className="payment-field">
                            <label>CVV</label>
                            <input placeholder="123" type="password"
                                value={form.cvv}
                                onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                maxLength={4} />
                        </div>
                    </div>

                    <p className="payment-secure">🔒 Pago seguro y encriptado</p>

                    <div className="form-actions">
                        <button className="cancel-btn" onClick={() => setShowForm(false)}>
                            Cancelar
                        </button>
                        <button className="save-btn" onClick={handleSubscribe} disabled={loading}>
                            {loading ? 'Procesando...' : `Pagar $${selectedPlan === 'PREMIUM_MONTHLY'
                                ? membership.monthlyPrice
                                : membership.annualPrice}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Historial de pagos */}
            {history.length > 0 && (
                <div className="payment-history">
                    <h3>📋 Historial de pagos</h3>
                    {history.map(p => (
                        <div key={p.id} className="history-item">
                            <div>
                                <p className="history-plan">
                                    {p.plan === 'PREMIUM_MONTHLY' ? 'Plan Mensual' : 'Plan Anual'}
                                </p>
                                <p className="history-card">
                                    **** **** **** {p.lastFourDigits} · {p.cardholderName}
                                </p>
                                <p className="history-date">
                                    {new Date(p.paidAt).toLocaleDateString('es-MX', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="history-right">
                                <p className="history-amount">${p.amount}</p>
                                <span className="history-status">✅ Completado</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}