const RULES_BY_YEAR = {
  // irs.gov/retirement-plans/plan-participant-employee/amount-of-roth-ira-contributions-that-you-can-make-for-2022 
  '2022': {
    max: 6000,
    'married-jointly': { min: 204_000, max: 214_000 },
    'married-separately': { min: 0, max: 10_000 },
    'individual': { min: 129_000, max: 144_000 }
  },
  // irs.gov/retirement-plans/amount-of-roth-ira-contributions-that-you-can-make-for-2023
  '2023': {
    max: 6500,
    'married-jointly': { min: 218_000, max: 228_000 },
    'married-separately': { min: 0, max: 10_000 },
    'individual': { min: 138_000, max: 153_000 }
  }
}

/**
 * Gets Roth IRA contribution limit for a given income
 * See {@link https://www.irs.gov/retirement-plans/plan-participant-employee/amount-of-roth-ira-contributions-that-you-can-make-for-2022}
 * @param {number} magi: Modified Adjusted Gross Income to get limit for
 * @returns {number} Contribution Limit
 */
function getContributionLimit(magi, status, year) {
  const rules = RULES_BY_YEAR[year]
  const phaseOut = rules[status]

  if(magi < phaseOut.min) return rules.max
  if(magi >= phaseOut.max) return 0

  // irs.gov/retirement-plans/amount-of-roth-ira-contributions-that-you-can-make-for-2023
  return rules.max * (1 - ((magi - phaseOut.min) / 10_000))
}

document.addEventListener("submit", function(event) {
  event.preventDefault();  
  const magi = document.getElementById("magi").value;
  
  if(magi === '' || isNaN(magi)){
    return document.getElementById("error-message").textContent = 'Please enter a valid number for MAGI';
  }
  if(magi < 0){
    return document.getElementById("error-message").textContent = 'MAGI cannot be negative';
  }
  document.getElementById("error-message").textContent = '';

  const status = document.getElementById("filing-status").value;
  const year = document.getElementById("year").value;
  const limit = getContributionLimit(magi, status, year);
  
  document.getElementById("result").textContent = "Your IRA contribution limit is $" + limit;
});