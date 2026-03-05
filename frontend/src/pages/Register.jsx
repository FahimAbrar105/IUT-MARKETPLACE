import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        studentId: '',
        contactNumber: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [searchParams] = useSearchParams();
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        } else {
            setAvatarPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend strict check for IUT email just as a UX improvement
        if (!formData.email.endsWith('@iut-dhaka.edu')) {
            return setError('Please use a valid @iut-dhaka.edu email');
        }

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            if (avatar) {
                data.append('avatar', avatar);
            }

            const res = await register(data);

            if (res.redirect) {
                if (res.email) {
                    navigate(res.redirect + `?email=${res.email}`);
                } else {
                    navigate(res.redirect);
                }
            } else {
                // Fallback
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
