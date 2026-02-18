
import React from 'react';
import { FaCube, FaMobileAlt, FaMobile, FaGamepad, FaLaptop, FaBook, FaChair, FaUserAstronaut } from 'react-icons/fa';

const PositionCard = ({ icon, name, sector, value }) => {
    return (
        <div className="position-card">
            <div className="pos-image">
                {icon}
            </div>
            <div className="pos-details">
                <div className="pos-header">
                    <div>
                        <div className="pos-name">{name}</div>
                        <div className="pos-sector">SECTOR: {sector}</div>
                    </div>
                    <div className="pos-value">৳{value}</div>
                </div>
                <div className="pos-actions">
                    <button className="btn-view">VIEW</button>
                    <button className="btn-small btn-liquidate-small">LIQUIDATE</button>
                </div>
            </div>
        </div>
    );
};

const PositionsGrid = () => {
    const positions = [
        { icon: <FaCube />, name: 'calculator', sector: 'ELECTRONICS', value: '4000' },
        { icon: <FaMobileAlt />, name: 'phone', sector: 'ELECTRONICS', value: '90000' },
        { icon: <FaMobile />, name: 'Phone2', sector: 'ELECTRONICS', value: '6000' },
        { icon: <FaGamepad />, name: 'Remote', sector: 'ELECTRONICS', value: '500' },
        { icon: <FaLaptop />, name: 'Phone', sector: 'ELECTRONICS', value: '600' },
        { icon: <FaBook />, name: 'wer', sector: 'BOOKS', value: '345' },
        { icon: <FaChair />, name: 'Sadman Saad', sector: 'FURNITURE', value: '2' },
        { icon: <FaUserAstronaut />, name: 'Freiren', sector: 'OTHER', value: '100000' },
    ];

    return (
        <section>
            <div className="section-header">
                <div className="section-title">ACTIVE POSITIONS (listings)</div>
                <div className="section-info">{positions.length} POSITIONS OPEN</div>
            </div>

            <div className="positions-grid">
                {positions.map((pos, index) => (
                    <PositionCard key={index} {...pos} />
                ))}
            </div>
        </section>
    );
};

export default PositionsGrid;
