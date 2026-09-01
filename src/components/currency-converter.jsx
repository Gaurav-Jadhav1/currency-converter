import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CurrencyInput from './currency-input';
import ResultDisplay from './result-display';
import { currencies } from '../currencies';
import './currency-converter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchRate = async () => {
      if (!fromCurrency || !toCurrency) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);

        if (response.data?.result === 'error') {
          throw new Error(response.data['error-type'] || 'Invalid currency.');
        }

        const nextRate = response.data?.rates?.[toCurrency];

        if (!nextRate) {
          throw new Error('Exchange rate not available for selected currencies.');
        }

        if (!ignore) {
          setExchangeRate(nextRate);
          setLastUpdated(
            response.data.time_last_update_utc
              ? new Date(response.data.time_last_update_utc)
              : null
          );
        }
      } catch {
        if (!ignore) {
          setError('Could not fetch exchange rates. Please try again in a moment.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchRate();

    return () => {
      ignore = true;
    };
  }, [fromCurrency, toCurrency]);

  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const convertedAmount = Number.isFinite(amount * (exchangeRate ?? 1))
    ? amount * (exchangeRate ?? 1)
    : 0;

  const fromInfo = currencies[fromCurrency];

  return (
    <div className="currency-converter">
      <header className="converter-header">
        <h1>Currency Converter</h1>
        <p className="subtitle">Live exchange rates powered by open.er-api.com</p>
      </header>

      <div className="converter-card">
        <CurrencyInput
          label="You have"
          amount={amount}
          currency={fromCurrency}
          onAmountChange={setAmount}
          onCurrencyChange={setFromCurrency}
        />

        <div className="swap-row">
          <span className="rate-info">
            <span className="rate-pair">
              {fromInfo?.symbol}1 {fromCurrency} ={' '}
              {exchangeRate ? exchangeRate.toFixed(4) : '—'} {toCurrency}
            </span>
            {isLoading && <span className="spinner" aria-label="Loading" />}
            {error && <span className="error-text">{error}</span>}
            {lastUpdated instanceof Date && (
              <span className="updated-text">
                Updated {lastUpdated.toLocaleString()}
              </span>
            )}
          </span>
          <button
            type="button"
            className="swap-button"
            onClick={handleSwap}
            aria-label="Swap currencies"
            title="Swap currencies"
          >
            ⇅
          </button>
        </div>

        <CurrencyInput
          label="You get"
          amount={convertedAmount}
          currency={toCurrency}
          onAmountChange={setAmount}
          onCurrencyChange={setToCurrency}
          readOnly
        />

        <ResultDisplay amount={convertedAmount} currency={toCurrency} />
      </div>
    </div>
  );
};

export default CurrencyConverter;