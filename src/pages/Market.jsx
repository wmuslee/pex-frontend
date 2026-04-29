import { useMarket } from '../contexts/MarketContext';
import StockCard from '../components/StockCard';

export default function Market() {
  const { stocks } = useMarket();

  if (stocks.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Live Market 📈</h1>
        <p>Пока никто не создал акции...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>
        Live Market 📈
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {stocks.map((stock) => (
          <StockCard key={stock.ticker} stock={stock} />
        ))}
      </div>
    </div>
  );
}