import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaFingerprint, FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            if (res.data.token) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Access Denied');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="scan-line"></div>

                {/* Header */}
                <div className="window-header">
                    <div className="window-controls">
                        <div className="control-dot red"></div>
                        <div className="control-dot yellow"></div>
                        <div className="control-dot green"></div>
                    </div>
                    <div className="window-title">AUTH_PROTOCOL_V2.0</div>
                </div>

                {/* Content */}
                <div className="auth-content">
                    <FaFingerprint className="auth-icon" />

                    <h2>ACCESS TERMINAL</h2>
                    <div className="subtitle">ENTER CREDENTIALS TO INITIALIZE SESSION</div>

                    <div className="social-buttons">
                        <button className="social-btn google" onClick={() => window.location.href = 'http://localhost:5000/auth/google'}>
                            <FaGoogle /> GOOGLE
                        </button>
                        <button className="social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/github'}>
                            <FaGithub /> GITHUB
                        </button>
                    </div>

                    <div className="divider">OR USE ACCESS KEY</div>

                    {error && <div style={{ color: '#da3633', marginBottom: '15px', fontSize: '0.8rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>USER_ID / EMAIL</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@iut-dhaka.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>ACCESS_CODE</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            INITIALIZE LINK
                        </button>
                    </form>

                    <div className="form-footer">
                        NO CLEARANCE?
                        <Link to="/register" className="link">REQUEST ACCESS</Link>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="status-bar">
                    <span>SYS.STATUS: <span style={{ color: '#238636' }}>STABLE</span></span>
                    <span>CNX: <span style={{ color: '#2f81f7' }}>SECURE</span></span>
                </div>
            </div>
        </div>
    );
};

export default Login;
