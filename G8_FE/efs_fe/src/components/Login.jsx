{"id":"59201","variant":"standard","title":"Responsive Login.jsx"}
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:8084/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseText = await response.text();

      if (response.ok && responseText.includes('success')) {
        localStorage.setItem('user', JSON.stringify({
          name: formData.email.split('@')[0],
          email: formData.email,
          role: 'USER'
        }));

        localStorage.setItem('authToken', 'authenticated_' + Date.now());

        alert('✅ Login successful!');
        navigate('/home');
      } else {
        alert('Invalid email or password');
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-wrapper">
        <section className="auth-card-container">
          <form className="card shadow-lg border-0 login-card" onSubmit={handleSubmit}>
            <header className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 circle-icon">
                  <span>🔒</span>
                </div>
                <h2 className="fw-bold page-title">Welcome Back</h2>
                <p className="text-muted">Sign in to continue your journey</p>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-lg w-100 login-btn">
                <span className="me-2">🚀</span>Sign In
              </button>

              <div className="text-center">
                <p className="mb-0">Don't have an account?
                  <Link to="/register" className="fw-semibold text-decoration-none ms-1 login-link">
                    Create Account
                  </Link>
                </p>
              </div>
            </header>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;