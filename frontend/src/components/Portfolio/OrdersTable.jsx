
import React from 'react';
import { FaTrash, FaCheckCircle, FaCube } from 'react-icons/fa';

const OrdersTable = () => {
    return (
        <section>
            <div className="section-header">
                <div className="section-title">OPEN ORDERS (bids)</div>
                <div className="section-info">2 ORDERS PENDING</div>
            </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th width="20%">DATE</th>
                            <th width="20%">SECTOR</th>
                            <th width="20%">MAX STRIKE PRICE</th>
                            <th width="20%">STATUS</th>
                            <th width="20%" style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1/31/2026 <span className="text-muted" style={{ fontSize: '0.7rem' }}>12:55 AM</span></td>
                            <td style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>FURNITURE</td>
                            <td style={{ fontWeight: 'bold' }}>৳500</td>
                            <td><span className="order-status status-filled">FILLED</span></td>
                            <td style={{ textAlign: 'right' }}><button className="btn-icon"><FaTrash /></button></td>
                        </tr>

                        <tr className="match-row">
                            <td colSpan="5">
                                <div className="match-content">
                                    <div className="match-indicator"><FaCheckCircle /> MATCHING ASSETS FOUND (1)</div>
                                    <div className="match-item">
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <FaCube style={{ color: '#555' }} />
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>Table</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>৳450</div>
                                            </div>
                                        </div>
                                        <button className="btn-view" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>VIEW</button>
                                    </div>
                                </div>
                            </td>
                        </tr>


                        <tr>
                            <td>1/31/2026 <span className="text-muted" style={{ fontSize: '0.7rem' }}>12:54 AM</span></td>
                            <td style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>FURNITURE</td>
                            <td style={{ fontWeight: 'bold' }}>৳20</td>
                            <td><span className="order-status status-active">ACTIVE</span></td>
                            <td style={{ textAlign: 'right' }}><button className="btn-icon"><FaTrash /></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default OrdersTable;
