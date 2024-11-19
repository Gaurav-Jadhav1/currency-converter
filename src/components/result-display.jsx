import React from 'react';

const ResultDisplay = ({ amount, toCurrency }) => (
  <p className="result-display">
    {amount.toFixed(2)} {toCurrency}
  </p>
);

export default ResultDisplay;
