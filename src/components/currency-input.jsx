import PropTypes from 'prop-types';
import { currencies } from '../currencies';

const CurrencyInput = ({ label, amount, currency, onAmountChange, onCurrencyChange, readOnly }) => (
  <div className="currency-field">
    <span className="currency-field-label">{label}</span>
    <input
      type="number"
      min="0"
      step="any"
      value={amount}
      onChange={(e) => {
        const value = parseFloat(e.target.value);
        onAmountChange(Number.isFinite(value) && value >= 0 ? value : 0);
      }}
      readOnly={readOnly}
      placeholder="0.00"
    />
    <select
      value={currency}
      onChange={(e) => onCurrencyChange(e.target.value)}
      title={currencies[currency]?.name}
    >
      {Object.entries(currencies)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([code, info]) => (
          <option key={code} value={code}>
            {code} — {info.name}
          </option>
        ))}
    </select>
  </div>
);

CurrencyInput.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

export default CurrencyInput;