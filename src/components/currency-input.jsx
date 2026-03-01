import React from 'react';

const CurrencyInput = ({ amount, currency, onAmountChange, onCurrencyChange, readOnly }) => (
  <div className="currency-input">
    <input
      type="number"
      value={amount}
      onChange={(e) => {
        const value = parseFloat(e.target.value);
        onAmountChange(Number.isFinite(value) ? value : 0);
      }}
      readOnly={readOnly}
    />
    <select value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
      <option value="INR">INR</option>
    </select>
  </div>
);

export default CurrencyInput;
