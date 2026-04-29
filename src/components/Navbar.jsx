import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#1e2937', color: 'white', padding: '16px 0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Link to="/" style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>PEX</Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/market" style={{ color: 'white', textDecoration: 'none' }}>Market</Link>
            <Link to="/portfolio" style={{ color: 'white', textDecoration: 'none' }}>Portfolio</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              💰 <strong>${(user?.walletBalance ?? 10000).toLocaleString()}</strong>
            </div>

            <span style={{ fontWeight: '600' }}>{user.username}</span>

            <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}