import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7f0 100%)',
      }}
    >
      <div className="card" style={{ width: '420px', padding: '40px 30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Create your company</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '32px' }}>
          Join PEX and become a listed company
        </p>

        {error && (
          <p
            style={{
              color: '#ef4444',
              background: '#fee2e2',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username (your company name)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            maxLength="20"
            style={{ marginBottom: '16px' }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '16px' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={{ marginBottom: '24px' }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '17px' }}
          >
            {loading ? 'Creating account...' : 'Register & Start Trading'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none' }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}