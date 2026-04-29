import { useState } from 'react';
import { useMarket } from '../contexts/MarketContext';

export default function StockCard({ stock }) {
  const { buyStock } = useMarket();
  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (shares < 1) return;
    setLoading(true);
    try {
      await buyStock(stock.ticker, parseInt(shares));
      alert(`✅ Куплено ${shares} шт. ${stock.ticker}`);
      setShares(1);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка покупки');
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '24px' }}>{stock.ticker}</h3>
        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '22px' }}>
          ${stock.currentPrice}
        </span>
      </div>

      <p style={{ margin: '8px 0 16px', color: '#6b7280' }}>
        Владелец: <strong>{stock.owner?.username || 'Unknown'}</strong>
      </p>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            min="1"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            style={{ width: '80px', textAlign: 'center' }}
          />
          <button
            onClick={handleBuy}
            disabled={loading}
            className="btn btn-success"
            style={{ flex: 1 }}
          >
            {loading ? 'Покупка...' : 'Купить'}
          </button>
        </div>
      </div>
    </div>
  );
}