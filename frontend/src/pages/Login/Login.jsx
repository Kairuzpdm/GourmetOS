import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { AuthService } from '../../services/AuthService';
import './Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { user, token } = await AuthService.login(username, password);
            login(user, token);
        } catch (err) {
            setError(err.response?.data?.message || 'Error de conexión con el servidor');
        }
    };

    return (
        <div className="login-container">
            <div className="animated-background"></div>
            <div className="glass-card">
                <div className="card-header">
                    <h1 className="brand-title">Gourmet<span className="accent">OS</span></h1>
                    <p className="subtitle">Gestión de Restaurante</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Ingrese su usuario..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-badge">{error}</div>}
                    <button type="submit" className="btn-primary">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}
