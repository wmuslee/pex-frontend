import { useEffect, useState } from 'react';

export default function PriceTicker({ ticker, price }) {
  const [prevPrice, setPrevPrice] = useState(price);
  const [isUp, setIsUp] = useState(true);

  useEffect(() => {
    if (price > prevPrice) setIsUp(true);
    if (price < prevPrice) setIsUp(false);
    setPrevPrice(price);
  }, [price]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#fff',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        marginBottom: '12px',
      }}
    >
      <strong style={{ fontSize: '20px', minWidth: '80px' }}>{ticker}</strong>
      <span
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: isUp ? '#10b981' : '#ef4444',
          transition: 'color 0.3s',
        }}
      >
        ${price}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: isUp ? '#10b981' : '#ef4444',
        }}
      >
        {isUp ? '▲' : '▼'}
      </span>
    </div>
  );
}