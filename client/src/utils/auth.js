const auth = {
  getToken() {
    return localStorage.getItem('railsmart_token');
  },

  getUser() {
    try {
      const u = localStorage.getItem('railsmart_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  login(token, user) {
    localStorage.setItem('railsmart_token', token);
    localStorage.setItem('railsmart_user', JSON.stringify(user));
    window.dispatchEvent(new Event('railsmart-auth-change'));
  },

  logout(redirect = true) {
    localStorage.removeItem('railsmart_token');
    localStorage.removeItem('railsmart_user');
    window.dispatchEvent(new Event('railsmart-auth-change'));
    if (redirect) {
      window.location.href = '/login';
    }
  },

  setUser(user) {
    localStorage.setItem('railsmart_user', JSON.stringify(user));
    window.dispatchEvent(new Event('railsmart-auth-change'));
  },

  async fetch(url, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 401) {
        // Token expired or invalid - clear session and redirect to login
        this.logout(false);
        window.showToast && window.showToast('Session expired. Please login again.', 'warning');
        setTimeout(() => { window.location.href = '/login'; }, 500);
        return { success: false, message: 'Not authorized' };
      }
      return await res.json();
    } catch (err) {
      console.error('API Fetch Error:', err);
      return { success: false, message: 'Network connection failed' };
    }
  }
};

export default auth;