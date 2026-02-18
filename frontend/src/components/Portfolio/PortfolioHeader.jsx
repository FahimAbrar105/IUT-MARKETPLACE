
import React from 'react';

const PortfolioHeader = () => {
    return (
        <header className="section-header" style={{ borderBottom: 'none' }}>
            <div>
                <div className="section-title" style={{ fontSize: '1.5rem', borderLeft: 'none', paddingLeft: '0' }}>
                    PORTFOLIO MANAGER
                </div>
                <div className="section-info">ACCOUNT: ADNAN // ID: 220041115</div>
            </div>
            <div className="header-stats">
                <div className="stat-item">
                    <div className="stat-label">Credit Rating</div>
                    <div className="stat-value rating-nice">AAA <span style={{ fontSize: '0.7rem', fontWeight: 'normal', color: '#888' }}>(PRIME)</span></div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Assets Under Management</div>
                    <div className="stat-value">৳201,447</div>
                </div>
                <button className="btn-ipo">+ INITIATE IPO</button>
            </div>
        </header>
    );
};

export default PortfolioHeader;
