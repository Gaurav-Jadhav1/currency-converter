import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyInput from './currency-input';
import ResultDisplay from './result-display';
import './currency-converter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(1);
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
        const nextRate = response.data?.rates?.[toCurrency];

        if (!nextRate) {
          throw new Error('Exchange rate not available for selected currencies.');
        }

        if (!ignore) {
          setExchangeRate(nextRate);
        }
      } catch (err) {
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

  const handleAmountChange = (newAmount) => setAmount(newAmount);
  const convertedAmount = Number.isFinite(amount * exchangeRate) ? amount * exchangeRate : 0;

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <CurrencyInput
        amount={amount}
        currency={fromCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={setFromCurrency}
      />
      <CurrencyInput
        amount={convertedAmount}
        currency={toCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={setToCurrency}
        readOnly
      />
      {isLoading && <p className="status-text">Loading rates...</p>}
      {error && <p className="error-text">{error}</p>}
      <ResultDisplay 
        amount={convertedAmount}
        toCurrency={toCurrency}
      />
    </div>
  );
};

export default CurrencyConverter;
