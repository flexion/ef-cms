import { state } from 'cerebral';

/**
 * Calculates penalties from the current calculate penalties modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function to retrieve state values
 * @returns {number} total computed value from penalty values
 */
export const calculatePenaltiesAction = ({ get }) => {
  let { penalties } = get(state.modal);

  penalties = penalties.map(penalty => {
    return penalty.irsPenaltyAmount;
  });

  const parseCurrency = value => Number(value).toFixed(2);

  const penaltyAggregator = (sum, penality) =>
    Number(sum) + Number(penality.irsPenaltyAmount);

  const total = parseCurrency(penalties.reduce(penaltyAggregator, 0));

  return {
    totalPenalties: total,
  };
};
