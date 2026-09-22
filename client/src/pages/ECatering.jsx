import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import auth from '../utils/auth';

const ECatering = () => {
  const [searchParams] = useSearchParams();
  const stationParam = searchParams.get('station') || 'NDLS';
  const pnrParam = searchParams.get('pnr') || '';

  const [stationCode, setStationCode] = useState(stationParam);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [coachNum, setCoachNum] = useState('B2');
  const [seatNum, setSeatNum] = useState('34');
  const [passengerName, setPassengerName] = useState(auth.getUser()?.name || 'Rohan Verma');
  const [phone, setPhone] = useState(auth.getUser()?.phone || '+91 9876543210');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    auth.fetch(`/api/food/restaurants?station=${stationCode}`).then(res => {
      if (res.success && res.restaurants) {
        setRestaurants(res.restaurants);
        if (res.restaurants.length > 0) {
          handleSelectRestaurant(res.restaurants[0]);
        }
      }
    });
  }, [stationCode]);

  const handleSelectRestaurant = (rest) => {
    setSelectedRestaurant(rest);
    auth.fetch(`/api/food/restaurants/${rest._id}/menu`).then(res => {
      if (res.success) setMenuItems(res.items);
    });
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.foodItemId === item._id);
    if (existing) {
      setCart(cart.map(c => c.foodItemId === item._id ? { ...c, quantity: c.quantity + 1, total: (c.quantity + 1) * c.price } : c));
    } else {
      setCart([...cart, { foodItemId: item._id, name: item.name, price: item.price, quantity: 1, total: item.price }]);
    }
    window.showToast(`Added ${item.name} to cart`, 'success');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!auth.getUser()) {
      window.showToast('Please login to place food orders', 'info');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      window.showToast('Cart is empty', 'warning');
      return;
    }

    if (!selectedRestaurant) {
      window.showToast('Please select a restaurant', 'warning');
      return;
    }

    try {
      const data = await auth.fetch('/api/food/orders', {
        method: 'POST',
        body: JSON.stringify({
          pnr: pnrParam || '2458913456',
          restaurantId: selectedRestaurant._id,
          deliveryStationCode: stationCode,
          deliveryStationName: selectedRestaurant.stationName || selectedRestaurant.name || 'Selected Station',
          coachNumber: coachNum,
          seatNumber: seatNum,
          passengerName,
          passengerPhone: phone,
          items: cart,
          totalAmount: cartTotal
        })
      });

      if (data.success) {
        setOrderSuccess(data.order);
        setCart([]);
        window.showToast('🍱 Meal Order Placed & Delivery Tracker Active!', 'success');
      }
    } catch (e) {
      window.showToast('Order failed', 'danger');
    }
  };

  if (orderSuccess) {
    return (
      <div className="railsmart-section" style={{ minHeight: '80vh', maxWidth: '640px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍱</div>
          <h2 style={{ fontSize: '1.8rem', color: '#00ff88' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Order ID: <strong>{orderSuccess.orderId}</strong></p>
          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', margin: '20px 0', textAlign: 'left' }}>
            <div>Delivering To: <strong>Coach {orderSuccess.coachNumber}, Seat {orderSuccess.seatNumber}</strong></div>
            <div>Delivery Station: <strong>{orderSuccess.deliveryStationName}</strong></div>
            <div>Total Paid: <strong>₹{orderSuccess.totalAmount}.00</strong></div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            View in Dashboard <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="railsmart-section" style={{ minHeight: '80vh' }}>

      {/* Page Header */}
      <div className="section-header-center" style={{ marginBottom: '32px' }}>
        <div className="section-pill-tag">
          <i className="fa-solid fa-utensils"></i>
          <span>SEAT DELIVERY MEALS</span>
        </div>
        <h2 className="section-title">Railway e-Catering Portal</h2>
        <p className="section-subtitle">Fresh, hot food delivered directly to your train coach &amp; berth.</p>
      </div>

      {/* Restaurant Selector — full width bar */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '28px' }}>
        {restaurants.length > 0 ? restaurants.map(rest => (
          <div
            key={rest._id}
            onClick={() => handleSelectRestaurant(rest)}
            style={{
              background: selectedRestaurant?._id === rest._id ? 'rgba(245,158,11,0.12)' : 'var(--bg-card)',
              border: selectedRestaurant?._id === rest._id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '14px 20px',
              minWidth: '200px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{rest.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ⭐ {rest.rating} &nbsp;•&nbsp; 🕐 {rest.deliveryMinutes} mins
            </div>
          </div>
        )) : (
          <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>No restaurants available at {stationCode}.</div>
        )}
      </div>

      {/* Main 2-column: Menu (left) + Cart (right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '28px', alignItems: 'start' }}>

        {/* LEFT: Menu Items */}
        <div>
          {restaurants.length > 0 && (
            <>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
                <i className="fa-solid fa-bowl-food" style={{ color: 'var(--primary-color)', marginRight: '8px' }}></i>
                Menu Items
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {menuItems.length > 0 ? menuItems.map(item => (
                  <div key={item._id} style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'box-shadow 0.2s ease',
                  }}>
                    {/* Top row: veg badge + price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px',
                        background: item.isVeg ? '#dcfce7' : '#fee2e2',
                        color: item.isVeg ? '#15803d' : '#b91c1c', fontWeight: 800
                      }}>
                        {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                      </span>
                      <span style={{ fontWeight: 900, color: '#d97706', fontSize: '1.05rem' }}>₹{item.price}</span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>{item.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '9px', marginTop: '4px', fontSize: '0.88rem' }} onClick={() => addToCart(item)}>
                      <i className="fa-solid fa-plus"></i> Add to Cart
                    </button>
                  </div>
                )) : (
                  <div style={{ gridColumn: '1/-1', padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                    <i className="fa-solid fa-bowl-food" style={{ fontSize: '2rem', opacity: 0.3, display: 'block', marginBottom: '10px' }}></i>
                    No menu items available.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Cart */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-basket-shopping" style={{ color: 'var(--primary-color)' }}></i>
              Your Food Cart
            </h3>

            {cart.length > 0 ? (
              <form onSubmit={handlePlaceOrder}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '6px 0', borderBottom: '1px dashed var(--border-color)' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{item.name} <span style={{ color: 'var(--text-secondary)' }}>× {item.quantity}</span></span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹{item.total}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, marginBottom: '20px', padding: '10px 0', borderTop: '2px solid var(--primary-color)' }}>
                  <span>Total:</span>
                  <span style={{ color: 'var(--primary-color)' }}>₹{cartTotal}.00</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label className="railsmart-label">Coach #</label>
                    <input type="text" className="railsmart-input" value={coachNum} onChange={e => setCoachNum(e.target.value)} required />
                  </div>
                  <div>
                    <label className="railsmart-label">Seat #</label>
                    <input type="text" className="railsmart-input" value={seatNum} onChange={e => setSeatNum(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}>
                  <i className="fa-solid fa-bolt"></i> Pay &amp; Place Order
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <i className="fa-solid fa-cart-shopping" style={{ fontSize: '2rem', color: 'var(--border-color)', display: 'block', marginBottom: '12px' }}></i>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Cart is empty.<br />Add dishes from the menu.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ECatering;