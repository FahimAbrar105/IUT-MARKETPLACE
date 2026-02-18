import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaShieldAlt, FaKey } from 'react-icons/fa';
import '../styles/Auth.css';

const VerifyOtp = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/auth/verify', { email, otp });
            if (res.data.token) { // Check for token or success message
                navigate('/dashboard');
            } else if (res.data.message) {
                // Sometimes backend might return just a message if session based, but we expect token
                if (res.data.token) {
                    navigate('/dashboard');
                } else {
                    // If just verified but no token returned (unlikely based on controller, but safety)
                    navigate('/login');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Invalid or expired code.');
        } finally {
            setLoading(false);
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
                    <div className="window-title">SECURITY_LAYER_V1.0</div>
                </div>

                {/* Content */}
                <div className="auth-content">
                    <FaShieldAlt className="auth-icon" style={{ color: '#e6edf3' }} />

                    <h2>O.T.P. VERIFICATION</h2>
                    <div className="subtitle">ENTER SECURITY CODE SENT TO YOUR EMAIL</div>

                    {error && <div style={{ color: '#da3633', marginBottom: '15px', fontSize: '0.8rem' }}>{error}</div>}

                    <div style={{ marginBottom: '20px', fontSize: '0.8rem', color: '#8b949e' }}>
                        VERIFYING ID: <span style={{ color: '#2f81f7' }}>{email}</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ACCESS_CODE (OTP)</label>
                            <div className="input-wrapper">
                                <FaKey className="input-icon" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    required
                                    style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'VERIFYING...' : 'CONFIRM IDENTITY'}
                        </button>
                    </form>

                    <div className="form-footer">
                        DIDN'T RECEIVE IT?
                        <span className="link" style={{ cursor: 'pointer' }} onClick={() => alert('Resend feature not implemented yet')}>RESEND SIGNAL</span>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="status-bar">
                    <span>ENCRYPTION: <span style={{ color: '#238636' }}>AES-256</span></span>
                    <span>ATTEMPTS: <span style={{ color: '#e6edf3' }}>0/3</span></span>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
