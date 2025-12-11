import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: 'USER'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8084/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const responseText = await response.text();
      
      if (response.ok && responseText.includes('success')) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed: ' + responseText);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'}}>
      <section className="container-fluid">
        <article className="row justify-content-center">
          <section className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-6">
            <form className="card shadow-lg border-0" style={{borderRadius: '20px', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)'}} onSubmit={handleSubmit}>
              <header className="card-body p-3 p-md-4 p-lg-5">
                <div className="text-center mb-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px', background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', boxShadow: '0 8px 32px rgba(255, 154, 158, 0.3)'}}>
                    <span className="text-white" style={{fontSize: '2rem'}}>👤</span>
                  </div>
                  <h2 className="fw-bold" style={{color: '#d63384'}}>Create Account</h2>
                  <p className="text-muted">Join us today and start your journey</p>
                </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control form-control-lg"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control form-control-lg"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phoneNumber" className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        className="form-control form-control-lg"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label fw-semibold">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        className="form-select form-select-lg"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">👨 Male</option>
                        <option value="Female">👩 Female</option>
                        <option value="Other">⚧ Other</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="role" className="form-label fw-semibold">Select Role</label>
                      <select
                        id="role"
                        name="role"
                        className="form-select form-select-lg"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        style={{borderRadius: '10px'}}
                      >
                        <option value="USER">👤 User</option>
                        <option value="ADMIN">👑 Admin</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-lg w-100 mb-3" style={{borderRadius: '12px', background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', border: 'none', boxShadow: '0 4px 15px rgba(255, 154, 158, 0.4)', color: 'white'}}>
                    <span className="me-2">✨</span>Create Account
                  </button>

                <div className="text-center">
                  <p className="mb-0">Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{color: '#d63384'}}>Sign In</Link></p>
                </div>
              </header>
            </form>
          </section>
        </article>
      </section>
    </main>
  );
};

export default Register;