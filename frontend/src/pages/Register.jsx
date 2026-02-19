import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaGoogle, FaGithub, FaCamera, FaUser, FaEnvelope, FaIdCard, FaPhone, FaLock } from 'react-icons/fa';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        contactNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, studentId, contactNumber, password, confirmPassword } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Note: Avatar upload is not implemented in this frontend form version yet as per screenshot
            const res = await axios.post('/auth/register', {
                name,
                email,
                studentId,
                contactNumber,
                password
            });

            if (res.data.action === 'verify-otp') {
                navigate(`/verify-otp?email=${email}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '550px' }}>
                <div className="scan-line"></div>

                <div className="window-header">
                    <div className="window-controls">
                        <div className="control-dot red"></div>
                        <div className="control-dot yellow"></div>
                        <div className="control-dot green"></div>
                    </div>
                    <div className="window-title">REGISTRATION_MODULE</div>
                </div>

                <div className="auth-content">
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <FaUserPlus className="auth-icon green" />
                    </div>

                    <h2>NEW USER REGISTRATION</h2>
                    <div className="subtitle">CREATE SECURE IDENTITY FOR MARKETPLACE ACCESS</div>

                    <div className="social-buttons">
                        <button className="social-btn google" onClick={() => window.location.href = 'http://localhost:5000/auth/google'}>
                            <FaGoogle /> GOOGLE
                        </button>
                        <button className="social-btn" onClick={() => window.location.href = 'http://localhost:5000/auth/github'}>
                            <FaGithub /> GITHUB
                        </button>
                    </div>

                    <div className="upload-box">
                        <FaCamera style={{ fontSize: '1.5rem', marginBottom: '10px', opacity: 0.7 }} />
                        <span style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>UPLOAD ID PHOTO</span>
                        <input type="file" className="file-input" />
                    </div>

                    {error && <div style={{ color: '#da3633', marginBottom: '15px', fontSize: '0.8rem' }}>{error}</div>}

                    <form onSubmit={onSubmit}>
                        <div className="grid-row">
                            <div className="form-group">
                                <label>FULL NAME</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        placeholder="Fahim Abrar"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>EMAIL ADDR</label>
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        placeholder="student@iut-dhaka.edu"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid-row">
                            <div className="form-group">
                                <label>STUDENT ID</label>
                                <div className="input-wrapper">
                                    <FaIdCard className="input-icon" />
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={studentId}
                                        onChange={onChange}
                                        placeholder="220041105"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>CONTACT NO</label>
                                <div className="input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={contactNumber}
                                        onChange={onChange}
                                        placeholder="01712345678"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>PASSWORD</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>CONFIRM PASSWORD</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary btn-success" disabled={loading}>
                            {loading ? 'PROCESSING...' : 'CREATE IDENTITY'}
                        </button>
                    </form>

                    <div className="form-footer">
                        ALREADY REGISTERED?
                        <Link to="/login" className="link">LOGIN HERE</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
