import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import auth from '../utils/auth';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [user, setUser] = useState(auth.getUser());
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'admin-overview' : 'my-bookings');
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminTrains, setAdminTrains] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // New Train Form (for admin)
  const [newTrainNum, setNewTrainNum] = useState('');
  const [newTrainName, setNewTrainName] = useState('');
  const [newFrom, setNewFrom] = useState('NDLS');
  const [newTo, setNewTo] = useState('BCT');

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.getUser()) {
      navigate('/login');
      return;
    }

    // Load initial data
    auth.fetch('/api/bookings/my').then(res => { if (res.success) setBookings(res.bookings); });
    auth.fetch('/api/food/orders/my').then(res => { if (res.success) setFoodOrders(res.orders); });
    auth.fetch('/api/notifications').then(res => { if (res.success) setNotifications(res.notifications); });

    if (user?.role === 'admin') {
      auth.fetch('/api/admin/stats').then(res => { if (res.success) setAdminStats(res); });
      auth.fetch('/api/trains/search').then(res => { if (res.success) setAdminTrains(res.trains); });
      auth.fetch('/api/admin/users').then(res => { if (res.success) setAdminUsers(res.users); });
    }
  }, [user, navigate]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this ticket? Standard refund rules apply.')) return;
    try {
      const res = await auth.fetch(`/api/bookings/${id}/cancel`, { method: 'POST' });
      if (res.success) {
        window.showToast('Booking cancelled. Refund credited to source.', 'success');
        auth.fetch('/api/bookings/my').then(r => setBookings(r.bookings));
      }
    } catch (e) {
      window.showToast('Cancellation error', 'danger');
    }
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      const res = await auth.fetch('/api/admin/trains', {
        method: 'POST',
        body: JSON.stringify({
          trainNumber: newTrainNum,
          trainName: newTrainName,
          fromStationCode: newFrom,
          fromStationName: newFrom,
          toStationCode: newTo,
          toStationName: newTo,
          departureTime: '06:00 AM',
          arrivalTime: '02:00 PM',
          durationHours: '8h 00m'
        })
      });
      if (res.success) {
        window.showToast('Train added successfully!', 'success');
        auth.fetch('/api/trains/search').then(r => setAdminTrains(r.trains));
        setNewTrainNum('');
        setNewTrainName('');
      }
    } catch (e) {
      window.showToast('Failed to add train', 'danger');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 12px 18px', borderBottom: '1px solid var(--border-color)', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 800, textTransform: 'uppercase' }}>
            {user?.role === 'admin' ? 'Railway Admin Hub' : 'Passenger Portal'}
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user?.name}</h3>
        </div>

        <ul className="sidebar-menu">
          {user?.role === 'admin' ? (
            <>
              <li className={`sidebar-menu-item ${activeTab === 'admin-overview' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('admin-overview')}><i className="fa-solid fa-chart-pie"></i> Analytics & Revenue</button>
              </li>
              <li className={`sidebar-menu-item ${activeTab === 'admin-trains' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('admin-trains')}><i className="fa-solid fa-train"></i> Train Fleet CRUD</button>
              </li>
              <li className={`sidebar-menu-item ${activeTab === 'admin-users' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('admin-users')}><i className="fa-solid fa-users"></i> Registered Drivers/Users</button>
              </li>
            </>
          ) : (
            <>
              <li className={`sidebar-menu-item ${activeTab === 'my-bookings' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('my-bookings')}><i className="fa-solid fa-ticket"></i> My Bookings & QR</button>
              </li>
              <li className={`sidebar-menu-item ${activeTab === 'food-orders' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('food-orders')}><i className="fa-solid fa-utensils"></i> e-Catering Orders</button>
              </li>
              <li className={`sidebar-menu-item ${activeTab === 'reminders' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('reminders')}><i className="fa-solid fa-bell"></i> Journey Reminders</button>
              </li>
              <li className={`sidebar-menu-item ${activeTab === 'security-logs' ? 'active' : ''}`}>
                <button onClick={() => setActiveTab('security-logs')}><i className="fa-solid fa-shield-halved"></i> Security & Device Logs</button>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-wrapper">
        {/* ================= USER: MY BOOKINGS ================= */}
        {activeTab === 'my-bookings' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>🎟️ My Train Bookings</h2>
            {bookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {bookings.map(b => (
                  <div key={b._id} className="train-card-white">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706' }}>PNR: {b.pnr}</span>
                        <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem' }}>{b.trainName} (#{b.trainNumber})</h3>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        background: b.status === 'CONFIRMED' ? '#dcfce7' : '#fee2e2',
                        color: b.status === 'CONFIRMED' ? '#15803d' : '#b91c1c'
                      }}>
                        {b.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '0.88rem' }}>
                      <div><span style={{ color: '#64748b' }}>Route:</span> <strong>{b.fromStation} ➔ {b.toStation}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Date:</span> <strong>{b.journeyDate}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Class:</span> <strong>{b.travelClass}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Total Fare:</span> <strong>₹{b.fareBreakdown.totalFare}</strong></div>
                    </div>

                    {b.status === 'CONFIRMED' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#0f172a', background: '#f1f5f9' }} onClick={() => navigate(`/pnr?pnr=${b.pnr}`)}>
                          <i className="fa-solid fa-qrcode"></i> View QR Pass
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#b91c1c', background: '#fee2e2' }} onClick={() => handleCancelBooking(b._id)}>
                          <i className="fa-solid fa-ban"></i> Cancel Ticket
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No active bookings found. Plan your journey today!</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Search Trains</button>
              </div>
            )}
          </div>
        )}

        {/* ================= USER: FOOD ORDERS ================= */}
        {activeTab === 'food-orders' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>🍱 My e-Catering Orders</h2>
            {foodOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {foodOrders.map(o => (
                  <div key={o._id} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>Order #{o.orderId}</strong>
                      <span style={{ color: '#00ff88', fontWeight: 800 }}>{o.status}</span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Restaurant: <strong>{o.restaurantName}</strong> • Delivery Station: <strong>{o.deliveryStationName}</strong>
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--primary-color)', fontWeight: 700 }}>
                      Coach {o.coachNumber} / Seat {o.seatNumber} • Total: ₹{o.totalAmount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No food orders placed yet.</p>
                <button className="btn btn-primary" onClick={() => navigate('/e-catering')}>Order Food</button>
              </div>
            )}
          </div>
        )}

        {/* ================= USER: JOURNEY REMINDERS ================= */}
        {activeTab === 'reminders' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-primary)' }}>🔔 Journey Reminders</h2>
              {notifications.some(n => !n.isRead) && (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={async () => {
                    const res = await auth.fetch('/api/notifications/read-all', { method: 'PATCH' });
                    if (res.success) {
                      auth.fetch('/api/notifications').then(r => { if (r.success) setNotifications(r.notifications); });
                    }
                  }}
                >
                  <i className="fa-solid fa-check-double"></i> Mark All Read
                </button>
              )}
            </div>

            {notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {notifications.map(n => (
                  <div
                    key={n._id}
                    className="glass-card"
                    style={{
                      borderLeft: n.isRead ? '4px solid #cbd5e1' : '4px solid var(--primary-color)',
                      opacity: n.isRead ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                        <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{n.message}</p>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No journey reminders yet. Reminders appear here 24 hours before your confirmed journeys.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= USER: SECURITY LOGS ================= */}
        {activeTab === 'security-logs' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>🛡️ Security & Login Device Logs</h2>
            <div className="glass-card">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
                RailSmart automatically tracks login sessions and alerts you of unusual device or browser connections.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user?.securityLogs?.map((log, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{log.device}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>IP: {log.ip} • Location: {log.location}</div>
                    </div>
                    <span style={{ color: '#00ff88', fontSize: '0.8rem', fontWeight: 700 }}>VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ADMIN: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'admin-overview' && adminStats && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>📊 IRCTC Admin Analytics & Revenue</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '30px' }}>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Revenue</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-color)' }}>₹{adminStats.stats.totalRevenue}.00</div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Bookings</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00ff88' }}>{adminStats.stats.totalBookings}</div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Trains</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8' }}>{adminStats.stats.totalTrains}</div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Registered Passengers</span>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#a855f7' }}>{adminStats.stats.totalUsers}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>7-Day Revenue Trend (₹)</h3>
                <div style={{ height: '240px' }}>
                  <Bar 
                    data={{
                      labels: adminStats.revenueTrend.map(r => r.day),
                      datasets: [{ label: 'Revenue (₹)', data: adminStats.revenueTrend.map(r => r.revenue), backgroundColor: '#f59e0b', borderRadius: 6 }]
                    }} 
                    options={{ responsive: true, maintainAspectRatio: false }} 
                  />
                </div>
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Class Wise Booking Share</h3>
                <div style={{ height: '240px' }}>
                  <Doughnut 
                    data={{
                      labels: adminStats.classDistribution.map(c => c.class),
                      datasets: [{ data: adminStats.classDistribution.map(c => c.percentage), backgroundColor: ['#f59e0b', '#38bdf8', '#10b981', '#a855f7'] }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ADMIN: TRAIN FLEET CRUD ================= */}
        {activeTab === 'admin-trains' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>🚆 Train Fleet Management</h2>
            
            {/* Add New Train Form */}
            <div className="glass-card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Add New Express / Vande Bharat Train</h3>
              <form onSubmit={handleAddTrain} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label className="railsmart-label">Train #</label>
                  <input type="text" className="railsmart-input" placeholder="e.g. 20901" value={newTrainNum} onChange={e => setNewTrainNum(e.target.value)} required />
                </div>
                <div>
                  <label className="railsmart-label">Train Name</label>
                  <input type="text" className="railsmart-input" placeholder="e.g. Mumbai - Gandhinagar Vande Bharat" value={newTrainName} onChange={e => setNewTrainName(e.target.value)} required />
                </div>
                <div>
                  <label className="railsmart-label">From</label>
                  <input type="text" className="railsmart-input" value={newFrom} onChange={e => setNewFrom(e.target.value)} required />
                </div>
                <div>
                  <label className="railsmart-label">To</label>
                  <input type="text" className="railsmart-input" value={newTo} onChange={e => setNewTo(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
                  <i className="fa-solid fa-plus"></i> Add
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {adminTrains.map(t => (
                <div key={t._id} style={{ padding: '14px 18px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{t.trainName} (#{t.trainNumber})</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.fromStationCode} ➔ {t.toStationCode} • {t.durationHours}</div>
                  </div>
                  <span className="train-type-badge">{t.trainType}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ADMIN: REGISTERED USERS ================= */}
        {activeTab === 'admin-users' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-primary)' }}>👥 Registered Passengers & Admin Accounts</h2>
            <div className="glass-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {adminUsers.map(u => (
                  <div key={u._id} style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email: {u.email} • Phone: {u.phone}</div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 800, background: u.role === 'admin' ? 'rgba(245,158,11,0.2)' : 'rgba(56,189,248,0.2)', color: u.role === 'admin' ? 'var(--primary-color)' : '#38bdf8' }}>
                      {u.role?.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;