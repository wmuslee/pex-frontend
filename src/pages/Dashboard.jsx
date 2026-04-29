import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarket } from '../contexts/MarketContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { stocks, createStock, updatePrice } = useMarket();

  const [ticker, setTicker] = useState('');
  const [initialPrice, setInitialPrice] = useState(50);
  const [newPrice, setNewPrice] = useState(50);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Находим свою акцию
  const myStock = stocks.find(stock => 
    stock.owner?._id === user?.id || stock.owner === user?.id
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!ticker.trim()) return alert('Введите тикер акции');
    
    setLoadingCreate(true);
    try {
      await createStock(ticker, Number(initialPrice));
      alert(`✅ Акция ${ticker.toUpperCase()} успешно создана!`);
      setTicker('');
      setInitialPrice(50);
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка создания акции');
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    if (!myStock) return;
    
    setLoadingUpdate(true);
    try {
      await updatePrice(myStock.ticker, Number(newPrice));
      alert(`✅ Цена акции ${myStock.ticker} обновлена до $${newPrice}`);
      setNewPrice(Number(newPrice)); // сохраняем новое значение
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления цены');
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
        Welcome, {user?.username}!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '40px' }}>
        Wallet: <strong>${(user?.walletBalance ?? 10000).toLocaleString()}</strong>
      </p>

      {!myStock ? (
        /* === ФОРМА СОЗДАНИЯ АКЦИИ === */
        <div className="card" style={{ maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '24px' }}>Create your company stock</h2>
          
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Ticker (e.g. KAMI)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              maxLength={8}
              style={{ marginBottom: '16px' }}
              required
            />
            <input
              type="number"
              placeholder="Initial Price"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              style={{ marginBottom: '24px' }}
            />
            <button
              type="submit"
              disabled={loadingCreate}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '17px' }}
            >
              {loadingCreate ? 'Creating...' : 'Create Stock'}
            </button>
          </form>
        </div>
      ) : (
        /* === УПРАВЛЕНИЕ СВОЕЙ АКЦИЕЙ === */
        <div className="card" style={{ maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '16px' }}>
            Your Stock: <strong>{myStock.ticker}</strong>
          </h2>
          <p style={{ fontSize: '28px', marginBottom: '24px' }}>
            Current Price: <strong>${myStock.currentPrice}</strong>
          </p>

          <form onSubmit={handleUpdatePrice} style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                New Price
              </label>
              <input
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loadingUpdate}
              className="btn btn-success"
              style={{ padding: '14px 32px', fontSize: '17px' }}
            >
              {loadingUpdate ? 'Updating...' : 'Update Price'}
            </button>
          </form>

          <p style={{ marginTop: '16px', fontSize: '14px', color: '#10b981' }}>
            ✅ Only you can change this price. All users will see the update instantly.
          </p>
        </div>
      )}
    </div>
  );
}