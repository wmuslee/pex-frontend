import { useAuth } from '../contexts/AuthContext';
import { useMarket } from '../contexts/MarketContext';

export default function Portfolio() {
  const { user } = useAuth();
  const { stocks, holdings } = useMarket();

  const wallet = user?.walletBalance ?? 10000;

  const netWorth = holdings.reduce((total, holding) => {
    const stock = stocks.find(s => s.ticker === holding.ticker);
    const price = stock ? stock.currentPrice : holding.currentPrice || 0;
    return total + (holding.shares * price);
  }, wallet);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>Portfolio</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
        Welcome, {user?.username}!
      </p>

      {/* Net Worth Card */}
      <div className="card" style={{ maxWidth: '600px', marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px' }}>
              Net Worth: <strong>${netWorth.toLocaleString()}</strong>
            </h2>
            <p style={{ margin: '8px 0 0', color: '#10b981', fontWeight: '600' }}>
              Real-time valuation
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>Wallet</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              ${wallet.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Your Holdings</h3>

      {holdings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
          <p style={{ fontSize: '18px' }}>You don't have any shares yet.</p>
          <p style={{ marginTop: '12px' }}>
            Go to <strong>Market</strong> and buy some stocks!
          </p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '16px 0' }}>Ticker</th>
                <th style={{ textAlign: 'right', padding: '16px 0' }}>Shares</th>
                <th style={{ textAlign: 'right', padding: '16px 0' }}>Current Price</th>
                <th style={{ textAlign: 'right', padding: '16px 0' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => {
                const stock = stocks.find(s => s.ticker === holding.ticker);
                const price = stock ? stock.currentPrice : holding.currentPrice || 0;
                const value = holding.shares * price;

                return (
                  <tr key={holding.ticker} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '18px 0', fontWeight: '600', fontSize: '18px' }}>
                      {holding.ticker}
                    </td>
                    <td style={{ padding: '18px 0', textAlign: 'right', fontSize: '18px' }}>
                      {holding.shares}
                    </td>
                    <td style={{ padding: '18px 0', textAlign: 'right', fontSize: '18px' }}>
                      ${price}
                    </td>
                    <td style={{ padding: '18px 0', textAlign: 'right', fontWeight: '600', fontSize: '18px' }}>
                      ${value.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}