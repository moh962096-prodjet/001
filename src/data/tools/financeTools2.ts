import { registerTool } from '../toolRegistry';
import { formatNumber, formatCurrency } from '../../utils/format';
import { TrendingUp, PiggyBank, LineChart, Umbrella, Percent } from 'lucide-react';

export function registerFinanceTools2() {
  registerTool({
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest and see how your money grows over time with regular contributions.',
    metaDescription: 'Free compound interest calculator. Calculate how your investment grows with compound interest, including regular contributions and various compounding frequencies.',
    category: 'finance-calculators',
    keywords: ['compound interest calculator', 'interest calculator', 'compound growth', 'investment growth', 'compounding'],
    icon: TrendingUp,
    fields: [
      { id: 'principal', label: 'Initial Investment ($)', type: 'number', placeholder: '10000', min: 0 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '7', min: 0, step: 0.01 },
      { id: 'years', label: 'Time Period (years)', type: 'number', placeholder: '10', min: 1 },
      { id: 'freq', label: 'Compounding Frequency', type: 'select', options: [
        { value: '1', label: 'Annually (1×/year)' },
        { value: '2', label: 'Semi-annually (2×/year)' },
        { value: '4', label: 'Quarterly (4×/year)' },
        { value: '12', label: 'Monthly (12×/year)' },
        { value: '365', label: 'Daily (365×/year)' },
      ], defaultValue: '12' },
      { id: 'contribution', label: 'Regular Contribution ($)', type: 'number', placeholder: '100', min: 0, defaultValue: '0' },
      { id: 'contribFreq', label: 'Contribution Frequency', type: 'select', options: [
        { value: '12', label: 'Monthly' },
        { value: '4', label: 'Quarterly' },
        { value: '1', label: 'Annually' },
      ], defaultValue: '12' },
    ],
    calculate: ({ fields }) => {
      const p = parseFloat(fields.principal as string) || 0;
      const r = (parseFloat(fields.rate as string) || 0) / 100;
      const years = parseFloat(fields.years as string);
      const n = parseInt(fields.freq as string, 10);
      const contrib = parseFloat(fields.contribution as string) || 0;
      const contribFreq = parseInt(fields.contribFreq as string, 10);
      if (!years || years <= 0) return null;

      let amount = p;
      const totalPeriods = n * years;
      const periodRate = r / n;
      const contribPerPeriod = contrib * (contribFreq / n);

      for (let i = 0; i < totalPeriods; i++) {
        amount = amount * (1 + periodRate) + contribPerPeriod;
      }

      const totalContributions = p + contrib * contribFreq * years;
      const interest = amount - totalContributions;

      return {
        title: 'Investment Growth',
        value: formatCurrency(amount),
        summary: `Your investment grows to ${formatCurrency(amount)} after ${formatNumber(years, 0)} years. You earned ${formatCurrency(interest)} in interest.`,
        details: [
          { label: 'Final balance', value: formatCurrency(amount) },
          { label: 'Total contributions', value: formatCurrency(totalContributions) },
          { label: 'Interest earned', value: formatCurrency(interest) },
          { label: 'Initial investment', value: formatCurrency(p) },
        ],
      };
    },
    explanation: 'Compound interest is interest earned on both the initial principal and accumulated interest. The formula is A = P(1 + r/n)^(nt), where P is principal, r is the annual rate, n is compounding frequency, and t is years. With regular contributions, each contribution also compounds. More frequent compounding and earlier contributions lead to greater growth — this is the power of compounding.',
    faqs: [
      { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on the initial principal plus all previously earned interest. This creates exponential growth over time, as your interest earns its own interest.' },
      { question: 'How does compounding frequency affect growth?', answer: 'More frequent compounding (e.g., monthly vs. annually) results in slightly more interest because interest is calculated and added more often. Over long periods, this difference becomes significant.' },
      { question: 'How do regular contributions help?', answer: 'Regular contributions add to your principal, and each contribution begins compounding. Starting contributions early gives them more time to grow, which is why consistent investing is powerful.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'savings-calculator',
    title: 'Savings Calculator',
    description: 'Find out how much you can save over time with a monthly savings goal and interest rate.',
    metaDescription: 'Free savings calculator. Calculate how much your savings will grow with monthly deposits and interest. Set savings goals and see your timeline.',
    category: 'finance-calculators',
    keywords: ['savings calculator', 'savings goal', 'monthly savings', 'savings growth', 'savings plan'],
    icon: PiggyBank,
    fields: [
      { id: 'initial', label: 'Current Savings ($)', type: 'number', placeholder: '5000', min: 0, defaultValue: '0' },
      { id: 'monthly', label: 'Monthly Deposit ($)', type: 'number', placeholder: '500', min: 0 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '4', min: 0, step: 0.01, defaultValue: '4' },
      { id: 'years', label: 'Time Period (years)', type: 'number', placeholder: '10', min: 1 },
    ],
    calculate: ({ fields }) => {
      const initial = parseFloat(fields.initial as string) || 0;
      const monthly = parseFloat(fields.monthly as string) || 0;
      const r = (parseFloat(fields.rate as string) || 0) / 100 / 12;
      const years = parseFloat(fields.years as string);
      if (!years || years <= 0) return null;
      const n = years * 12;

      let futureValue: number;
      if (r === 0) {
        futureValue = initial + monthly * n;
      } else {
        futureValue = initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
      }

      const totalDeposits = initial + monthly * n;
      const interest = futureValue - totalDeposits;

      return {
        title: 'Savings Growth',
        value: formatCurrency(futureValue),
        summary: `After ${formatNumber(years, 0)} years, your savings will reach ${formatCurrency(futureValue)}. You will have deposited ${formatCurrency(totalDeposits)} and earned ${formatCurrency(interest)} in interest.`,
        details: [
          { label: 'Future value', value: formatCurrency(futureValue) },
          { label: 'Total deposits', value: formatCurrency(totalDeposits) },
          { label: 'Interest earned', value: formatCurrency(interest) },
          { label: 'Monthly deposit', value: formatCurrency(monthly) },
        ],
      };
    },
    explanation: 'This calculator uses the future value of an annuity formula: FV = P(1+r)^n + PMT × ((1+r)^n − 1)/r, where P is the initial amount, PMT is the monthly deposit, r is the monthly interest rate, and n is the number of months. It shows how consistent saving combined with compound interest grows your money over time.',
    faqs: [
      { question: 'How much should I save each month?', answer: 'A common guideline is to save 20% of your income. Use this calculator to test different monthly amounts and see how they affect your long-term savings goal.' },
      { question: 'What interest rate should I use?', answer: 'For a savings account, 3–5% is realistic in most markets. For investments, 6–8% reflects a conservative long-term average. Use a rate that matches your savings vehicle.' },
      { question: 'Should I include inflation?', answer: 'This calculator shows nominal growth. To account for inflation, subtract the inflation rate (typically 2–3%) from your interest rate to see real purchasing power.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'investment-calculator',
    title: 'Investment Calculator',
    description: 'Project the future value of your investments with different return rates and time horizons.',
    metaDescription: 'Free investment calculator. Project the future value of your investments with different return rates, time horizons, and contribution levels.',
    category: 'finance-calculators',
    keywords: ['investment calculator', 'investment growth', 'future value', 'investment return', 'portfolio calculator'],
    icon: LineChart,
    fields: [
      { id: 'initial', label: 'Initial Investment ($)', type: 'number', placeholder: '10000', min: 0 },
      { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', placeholder: '500', min: 0, defaultValue: '0' },
      { id: 'rate', label: 'Expected Annual Return (%)', type: 'number', placeholder: '8', min: 0, step: 0.1, defaultValue: '8' },
      { id: 'years', label: 'Investment Period (years)', type: 'number', placeholder: '20', min: 1 },
    ],
    calculate: ({ fields }) => {
      const initial = parseFloat(fields.initial as string) || 0;
      const monthly = parseFloat(fields.monthly as string) || 0;
      const r = (parseFloat(fields.rate as string) || 0) / 100 / 12;
      const years = parseFloat(fields.years as string);
      if (!years || years <= 0) return null;
      const n = years * 12;

      let fv: number;
      if (r === 0) fv = initial + monthly * n;
      else fv = initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);

      const totalInvested = initial + monthly * n;
      const growth = fv - totalInvested;
      const roi = totalInvested > 0 ? (growth / totalInvested) * 100 : 0;

      return {
        title: 'Investment Projection',
        value: formatCurrency(fv),
        summary: `Your investment could grow to ${formatCurrency(fv)} in ${formatNumber(years, 0)} years, with ${formatCurrency(growth)} in returns (${formatNumber(roi, 1)}% ROI on contributions).`,
        details: [
          { label: 'Projected value', value: formatCurrency(fv) },
          { label: 'Total invested', value: formatCurrency(totalInvested) },
          { label: 'Investment growth', value: formatCurrency(growth) },
          { label: 'Return on investment', value: `${formatNumber(roi, 1)}%` },
        ],
      };
    },
    explanation: 'This calculator projects investment growth using the future value formula with monthly compounding. The expected annual return is your assumed average yearly growth rate. Historically, diversified stock market investments have averaged 7–10% annually before inflation, but returns vary year to year. This is an estimate, not a guarantee.',
    faqs: [
      { question: 'What return rate should I use?', answer: 'Historically, the S&P 500 has averaged about 10% annually before inflation (7% after). For bonds, use 3–5%. For a mixed portfolio, 6–8% is reasonable. Past performance does not guarantee future results.' },
      { question: 'Is this investment growth guaranteed?', answer: 'No. This is a projection based on a constant return rate. Real investments fluctuate year to year. Use this as a planning tool, not a prediction.' },
      { question: 'How do monthly contributions affect growth?', answer: 'Monthly contributions add to your principal regularly, and each contribution compounds from the moment it is invested. This dollar-cost averaging approach reduces timing risk and significantly boosts long-term growth.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description: 'Estimate how much you need to save for retirement and whether you are on track.',
    metaDescription: 'Free retirement calculator. Estimate your retirement savings needs, project your nest egg, and see if you are on track to retire comfortably.',
    category: 'finance-calculators',
    keywords: ['retirement calculator', 'retirement savings', 'nest egg', 'retirement planning', 'how much to save for retirement'],
    icon: Umbrella,
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'number', placeholder: '35', min: 18, max: 80 },
      { id: 'retireAge', label: 'Retirement Age', type: 'number', placeholder: '65', min: 40, max: 85 },
      { id: 'currentSavings', label: 'Current Savings ($)', type: 'number', placeholder: '50000', min: 0 },
      { id: 'monthly', label: 'Monthly Contribution ($)', type: 'number', placeholder: '500', min: 0 },
      { id: 'rate', label: 'Expected Annual Return (%)', type: 'number', placeholder: '7', min: 0, step: 0.1, defaultValue: '7' },
      { id: 'desiredIncome', label: 'Desired Annual Income in Retirement ($)', type: 'number', placeholder: '60000', min: 0 },
    ],
    calculate: ({ fields }) => {
      const currentAge = parseFloat(fields.currentAge as string);
      const retireAge = parseFloat(fields.retireAge as string);
      const currentSavings = parseFloat(fields.currentSavings as string) || 0;
      const monthly = parseFloat(fields.monthly as string) || 0;
      const r = (parseFloat(fields.rate as string) || 0) / 100 / 12;
      const desiredIncome = parseFloat(fields.desiredIncome as string) || 0;
      if (!currentAge || !retireAge || retireAge <= currentAge) return null;

      const years = retireAge - currentAge;
      const n = years * 12;

      let nestEgg: number;
      if (r === 0) nestEgg = currentSavings + monthly * n;
      else nestEgg = currentSavings * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);

      const totalContributions = currentSavings + monthly * n;
      const growth = nestEgg - totalContributions;
      const annualWithdrawal = nestEgg * 0.04;
      const meetsGoal = desiredIncome > 0 ? annualWithdrawal >= desiredIncome : null;

      return {
        title: 'Retirement Projection',
        value: formatCurrency(nestEgg),
        summary: `At age ${retireAge}, you could have ${formatCurrency(nestEgg)} saved. Using the 4% rule, that provides ${formatCurrency(annualWithdrawal)}/year${meetsGoal !== null ? (meetsGoal ? ' — meeting your goal!' : ' — below your desired income.') : '.'}`,
        details: [
          { label: 'Projected nest egg', value: formatCurrency(nestEgg) },
          { label: 'Years to retirement', value: `${formatNumber(years, 0)} years` },
          { label: 'Total contributions', value: formatCurrency(totalContributions) },
          { label: 'Investment growth', value: formatCurrency(growth) },
          { label: 'Annual income (4% rule)', value: formatCurrency(annualWithdrawal) },
        ],
      };
    },
    explanation: 'This calculator projects your retirement savings using compound growth on your current savings plus monthly contributions. The "4% rule" is a common guideline suggesting you can withdraw 4% of your nest egg annually in retirement with a reasonable expectation it will last 30 years. If your projected annual income (4% of nest egg) meets or exceeds your desired income, you are on track.',
    faqs: [
      { question: 'What is the 4% rule?', answer: 'The 4% rule suggests withdrawing 4% of your retirement savings in the first year, then adjusting for inflation. Historically, this provides a high probability of a portfolio lasting 30 years.' },
      { question: 'What return rate should I use?', answer: 'For pre-retirement investments, 6–8% is reasonable for a diversified portfolio. In retirement, you may shift to more conservative investments (4–6%). Adjust based on your risk tolerance.' },
      { question: 'How much do I need to retire?', answer: 'A common rule is 25× your annual expenses (equivalent to the 4% rule). If you need $60,000/year, aim for $1.5 million. Use this calculator to see if your savings plan gets you there.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'profit-margin-calculator',
    title: 'Profit Margin Calculator',
    description: 'Calculate gross, operating, and net profit margins from your revenue and costs.',
    metaDescription: 'Free profit margin calculator. Calculate gross profit, operating profit, and net profit margins from revenue and cost figures for your business.',
    category: 'finance-calculators',
    keywords: ['profit margin calculator', 'gross margin', 'net margin', 'profitability', 'business calculator', 'markup'],
    icon: Percent,
    fields: [
      { id: 'revenue', label: 'Total Revenue ($)', type: 'number', placeholder: '100000', min: 0 },
      { id: 'cogs', label: 'Cost of Goods Sold ($)', type: 'number', placeholder: '40000', min: 0 },
      { id: 'opex', label: 'Operating Expenses ($)', type: 'number', placeholder: '20000', min: 0, defaultValue: '0' },
      { id: 'tax', label: 'Taxes & Interest ($)', type: 'number', placeholder: '5000', min: 0, defaultValue: '0' },
    ],
    calculate: ({ fields }) => {
      const revenue = parseFloat(fields.revenue as string);
      const cogs = parseFloat(fields.cogs as string) || 0;
      const opex = parseFloat(fields.opex as string) || 0;
      const tax = parseFloat(fields.tax as string) || 0;
      if (!revenue || revenue <= 0) return null;

      const grossProfit = revenue - cogs;
      const grossMargin = (grossProfit / revenue) * 100;
      const operatingProfit = grossProfit - opex;
      const operatingMargin = (operatingProfit / revenue) * 100;
      const netProfit = operatingProfit - tax;
      const netMargin = (netProfit / revenue) * 100;

      return {
        title: 'Profit Margins',
        value: `${formatNumber(netMargin, 1)}% net margin`,
        summary: `Your net profit is ${formatCurrency(netProfit)} (${formatNumber(netMargin, 1)}% margin). Gross margin is ${formatNumber(grossMargin, 1)}% and operating margin is ${formatNumber(operatingMargin, 1)}%.`,
        details: [
          { label: 'Gross profit', value: formatCurrency(grossProfit) },
          { label: 'Gross margin', value: `${formatNumber(grossMargin, 1)}%` },
          { label: 'Operating profit', value: formatCurrency(operatingProfit) },
          { label: 'Operating margin', value: `${formatNumber(operatingMargin, 1)}%` },
          { label: 'Net profit', value: formatCurrency(netProfit) },
          { label: 'Net margin', value: `${formatNumber(netMargin, 1)}%` },
        ],
      };
    },
    explanation: 'Profit margin measures how much profit a business makes from its revenue. Gross margin = (revenue − COGS) / revenue. Operating margin = (revenue − COGS − operating expenses) / revenue. Net margin = (revenue − all costs including taxes and interest) / revenue. Higher margins indicate better profitability and efficiency. Compare your margins to industry benchmarks for context.',
    faqs: [
      { question: 'What is a good profit margin?', answer: 'It varies by industry. Retail typically has 2–5% net margins, software 15–25%, and services 10–20%. Compare to your industry average. A net margin above 10% is generally considered strong.' },
      { question: 'What is the difference between gross and net margin?', answer: 'Gross margin only subtracts the cost of goods sold (COGS). Net margin subtracts all expenses including operating costs, taxes, and interest. Net margin shows true bottom-line profitability.' },
      { question: 'How do I improve my profit margins?', answer: 'Increase prices, reduce COGS by negotiating with suppliers, cut unnecessary operating expenses, or focus on higher-margin products. Even small margin improvements compound significantly over time.' },
    ],
    recentlyAdded: true,
  });
}
