import PropTypes from 'prop-types';
import { currencies } from '../currencies';

const ResultDisplay = ({ amount, currency }) => {
  const info = currencies[currency];

  return (
    <div className="result-block">
      <span className="result-label">{info ? info.name : currency}</span>
      <p className="result-display">
        <span className="result-amount">
          {amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: amount >= 1000 ? 2 : 4,
          })}
        </span>
        <span className="result-code">{currency}</span>
      </p>
    </div>
  );
};

ResultDisplay.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default ResultDisplay;