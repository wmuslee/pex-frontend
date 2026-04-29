import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const { user, updateWallet } = useAuth();

  const fetchStocks = async () => {
    if (!user) return;
    try {
      const res = await api.get('/stocks');
      setStocks(res.data);
    } catch (err) {}
  };

  const fetchHoldings = async () => {
    if (!user) return;
    try {
      const res = await api.get('/trade/holdings');
      setHoldings(res.data);
    } catch (err) {
      if (err.response?.status === 404) setHoldings([]);
    }
  };

  const buyStock = async (ticker, shares) => {
    const res = await api.post('/trade/buy', { ticker, shares });
    updateWallet(res.data.newBalance);           // обновляем кошелёк
    await Promise.all([fetchStocks(), fetchHoldings()]);
    return res.data;
  };

  const createStock = async (ticker, initialPrice = 50) => {
    const res = await api.post('/stocks/create', { ticker: ticker.toUpperCase(), initialPrice });
    await fetchStocks();
    return res.data;
  };

  const updatePrice = async (ticker, price) => {
    await api.put(`/stocks/${ticker}/price`, { price });
    await fetchStocks();
  };

  useEffect(() => {
    if (!user) {
      setStocks([]);
      setHoldings([]);
      return;
    }

    fetchStocks();
    fetchHoldings();

    const token = localStorage.getItem('token');
    const socket = new WebSocket('wss://backend-dxzl.onrender.com/ws', token);

    socket.onopen = () => console.log('✅ WebSocket connected');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "TICKER_UPDATE") {
        setStocks(prev => prev.map(stock =>
          stock.ticker === data.payload.ticker
            ? { ...stock, currentPrice: data.payload.price }
            : stock
        ));
      }
    };

    return () => socket.close();
  }, [user]);

  return (
    <MarketContext.Provider value={{ stocks, holdings, buyStock, createStock, updatePrice }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);