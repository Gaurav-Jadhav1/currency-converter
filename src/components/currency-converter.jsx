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

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      axios
        .get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => {
          setExchangeRate(response.data.rates[toCurrency]);
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (newAmount) => setAmount(newAmount);

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
        amount={amount * exchangeRate}
        currency={toCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={setToCurrency}
        readOnly
      />
      <ResultDisplay 
        amount={amount * exchangeRate}
        toCurrency={toCurrency}
      />
    </div>
  );
};

export default CurrencyConverter;
