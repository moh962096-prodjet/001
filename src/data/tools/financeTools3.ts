import { registerTool } from '../toolRegistry';
import { formatNumber, formatCurrency, formatPercent } from '../../utils/format';
import { Receipt, Landmark, BadgePercent, Utensils, TrendingUp, Target, Scale, BadgeDollarSign, Wallet, PieChart } from 'lucide-react';

export function registerFinanceTools3() {
  registerTool({
    slug: 'vat-calculator',
    title: 'VAT Calculator',
    description: 'Add or remove VAT from any amount with a customizable VAT rate.',
    metaDescription: 'Free VAT calculator. Add VAT to or remove VAT from any amount with a custom VAT rate. Supports inclusive and exclusive VAT calculations.',
    category: 'finance-calculators',
    keywords: ['vat calculator', 'value added tax', 'tax inclusive', 'tax exclusive', 'vat rate'],
    icon: Receipt,
    fields: [
      { id: 'amount', label: 'Amount ($)', type: 'number', placeholder: '100', min: 0 },
      { id: 'rate', label: 'VAT Rate (%)', type: 'number', placeholder: '20', min: 0, step: 0.01, defaultValue: '20' },
      { id: 'mode', label: 'Calculation Mode', type: 'select', options: [
        { value: 'add', label: 'Add VAT (amount is net)' },
        { value: 'remove', label: 'Remove VAT (amount is gross)' },
      ], defaultValue: 'add' },
    ],
    calculate: ({ fields }) => {
      const amount = parseFloat(fields.amount as string);
      const rate = parseFloat(fields.rate as string) || 0;
      const mode = fields.mode as string;
      if (!amount || amount <= 0) return null;

      let net: number;
      let vat: number;
      let gross: number;
      if (mode === 'add') {
        net = amount;
        vat = amount * (rate / 100);
        gross = net + vat;
      } else {
        gross = amount;
        net = amount / (1 + rate / 100);
        vat = gross - net;
      }

      return {
        title: 'VAT Result',
        value: formatCurrency(vat),
        summary: mode === 'add'
          ? `Adding ${formatPercent(rate, 2)} VAT to ${formatCurrency(net)} gives a gross amount of ${formatCurrency(gross)}.`
          : `Removing ${formatPercent(rate, 2)} VAT from ${formatCurrency(gross)} leaves a net amount of ${formatCurrency(net)}.`,
        details: [
          { label: 'Net amount', value: formatCurrency(net) },
          { label: 'VAT amount', value: formatCurrency(vat) },
          { label: 'Gross amount', value: formatCurrency(gross) },
          { label: 'VAT rate', value: formatPercent(rate, 2) },
        ],
      };
    },
    explanation: 'Value Added Tax (VAT) is a consumption tax levied on goods and services. To add VAT, multiply the net amount by the rate: VAT = net × (rate/100), then gross = net + VAT. To remove VAT from a gross amount, divide by (1 + rate/100) to find the net, and the difference is the VAT. Common VAT rates range from 5% to 25% depending on the country.',
    faqs: [
      { question: 'What is VAT?', answer: 'VAT (Value Added Tax) is a consumption tax placed on products whenever value is added at each stage of the supply chain, from production to sale. It is included in the final price paid by consumers.' },
      { question: 'How do I remove VAT from a gross price?', answer: 'Divide the gross amount by (1 + VAT rate/100). For example, with 20% VAT, a gross price of $120 gives a net price of $120 / 1.20 = $100, and the VAT is $20.' },
      { question: 'What is a typical VAT rate?', answer: 'Standard VAT rates vary by country: 20% in the UK, 19% in Germany, 21% in Spain, 5% in Canada (GST). Some countries have reduced rates for essentials like food and books.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator',
    description: 'Calculate sales tax on any purchase with a customizable tax rate.',
    metaDescription: 'Free sales tax calculator. Calculate sales tax on any amount with a custom tax rate. Find the total cost including tax for any purchase.',
    category: 'finance-calculators',
    keywords: ['sales tax calculator', 'tax calculator', 'purchase tax', 'sales tax rate', 'tax inclusive'],
    icon: Landmark,
    fields: [
      { id: 'amount', label: 'Purchase Amount ($)', type: 'number', placeholder: '50', min: 0 },
      { id: 'rate', label: 'Sales Tax Rate (%)', type: 'number', placeholder: '7.25', min: 0, step: 0.001, defaultValue: '7.25' },
    ],
    calculate: ({ fields }) => {
      const amount = parseFloat(fields.amount as string);
      const rate = parseFloat(fields.rate as string) || 0;
      if (!amount || amount <= 0) return null;

      const tax = amount * (rate / 100);
      const total = amount + tax;

      return {
        title: 'Sales Tax Result',
        value: formatCurrency(total),
        summary: `Sales tax on ${formatCurrency(amount)} at ${formatPercent(rate, 2)} is ${formatCurrency(tax)}, for a total of ${formatCurrency(total)}.`,
        details: [
          { label: 'Subtotal', value: formatCurrency(amount) },
          { label: 'Sales tax', value: formatCurrency(tax) },
          { label: 'Total cost', value: formatCurrency(total) },
          { label: 'Tax rate', value: formatPercent(rate, 2) },
        ],
      };
    },
    explanation: 'Sales tax is a consumption tax imposed by governments on the sale of goods and services. It is calculated as a percentage of the purchase price: tax = price × (rate/100). The total cost is the purchase price plus the sales tax. Rates vary by state, county, and city, and some regions have no sales tax at all.',
    faqs: [
      { question: 'How is sales tax calculated?', answer: 'Sales tax is calculated by multiplying the purchase price by the tax rate (as a decimal). For example, a $100 purchase with 7% tax costs $100 × 0.07 = $7 in tax, for a $107 total.' },
      { question: 'Which states have no sales tax?', answer: 'Five U.S. states have no state-level sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, local municipalities in Alaska may still charge local sales taxes.' },
      { question: 'What is the difference between sales tax and VAT?', answer: 'Sales tax is charged only at the final point of sale to the consumer, while VAT is charged at each stage of production. Both are ultimately paid by the consumer but collected differently.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'Calculate the final price after a discount and see how much you save.',
    metaDescription: 'Free discount calculator. Calculate the final price after a percentage discount and see exactly how much you save on any purchase.',
    category: 'finance-calculators',
    keywords: ['discount calculator', 'percent off', 'sale price', 'savings calculator', 'discount price'],
    icon: BadgePercent,
    fields: [
      { id: 'price', label: 'Original Price ($)', type: 'number', placeholder: '80', min: 0 },
      { id: 'discount', label: 'Discount (%)', type: 'number', placeholder: '25', min: 0, max: 100, step: 0.1 },
    ],
    calculate: ({ fields }) => {
      const price = parseFloat(fields.price as string);
      const discount = parseFloat(fields.discount as string) || 0;
      if (!price || price <= 0) return null;

      const savings = price * (discount / 100);
      const finalPrice = price - savings;

      return {
        title: 'Discount Result',
        value: formatCurrency(finalPrice),
        summary: `A ${formatPercent(discount, 1)} discount on ${formatCurrency(price)} saves you ${formatCurrency(savings)}. You pay ${formatCurrency(finalPrice)}.`,
        details: [
          { label: 'Original price', value: formatCurrency(price) },
          { label: 'Discount amount', value: formatCurrency(savings) },
          { label: 'Final price', value: formatCurrency(finalPrice) },
          { label: 'Discount rate', value: formatPercent(discount, 1) },
        ],
      };
    },
    explanation: 'A discount reduces the original price by a percentage. The savings are calculated as original price × (discount/100), and the final price is the original price minus those savings. For example, a 25% discount on an $80 item saves $20, making the final price $60. This calculator helps you quickly evaluate sale prices and compare deals.',
    faqs: [
      { question: 'How do I calculate a discount?', answer: 'Multiply the original price by the discount percentage (as a decimal) to find the savings, then subtract that from the original price. For 30% off $50: savings = $50 × 0.30 = $15, final price = $50 − $15 = $35.' },
      { question: 'How do I calculate the original price from a discounted price?', answer: 'Divide the discounted price by (1 − discount/100). For example, if you paid $35 after a 30% discount, the original price was $35 / 0.70 = $50.' },
      { question: 'What is a good discount percentage?', answer: 'Retail discounts of 20–50% are common during sales. For big-ticket items, even 10% can be significant. Always compare the final price, not just the percentage off.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'tip-calculator',
    title: 'Tip Calculator',
    description: 'Calculate the tip amount and total bill for any tip percentage.',
    metaDescription: 'Free tip calculator. Calculate the tip and total bill for any tip percentage. Split the bill among multiple people and round up easily.',
    category: 'everyday-calculators',
    keywords: ['tip calculator', 'gratuity calculator', 'restaurant tip', 'bill split', 'tip percentage'],
    icon: Utensils,
    fields: [
      { id: 'bill', label: 'Bill Amount ($)', type: 'number', placeholder: '45', min: 0 },
      { id: 'tipPercent', label: 'Tip Percentage (%)', type: 'number', placeholder: '18', min: 0, step: 0.5, defaultValue: '18' },
      { id: 'people', label: 'Number of People', type: 'number', placeholder: '1', min: 1, defaultValue: '1' },
    ],
    calculate: ({ fields }) => {
      const bill = parseFloat(fields.bill as string);
      const tipPercent = parseFloat(fields.tipPercent as string) || 0;
      const people = parseInt(fields.people as string, 10) || 1;
      if (!bill || bill <= 0) return null;

      const tip = bill * (tipPercent / 100);
      const total = bill + tip;
      const perPerson = total / people;
      const tipPerPerson = tip / people;

      return {
        title: 'Tip Result',
        value: formatCurrency(total),
        summary: `A ${formatPercent(tipPercent, 1)} tip on a ${formatCurrency(bill)} bill is ${formatCurrency(tip)}. Total: ${formatCurrency(total)}${people > 1 ? ` (${formatCurrency(perPerson)} per person)` : ''}.`,
        details: [
          { label: 'Bill amount', value: formatCurrency(bill) },
          { label: 'Tip amount', value: formatCurrency(tip) },
          { label: 'Total bill', value: formatCurrency(total) },
          { label: 'Tip per person', value: formatCurrency(tipPerPerson) },
          { label: 'Total per person', value: formatCurrency(perPerson) },
        ],
      };
    },
    explanation: 'A tip (or gratuity) is a voluntary payment to a service worker, typically calculated as a percentage of the bill. The tip amount is bill × (tip%/100), and the total is the bill plus the tip. Common tip rates are 15–20% in the United States. When splitting the bill, divide the total by the number of people.',
    faqs: [
      { question: 'How much should I tip?', answer: 'In the U.S., 15–20% is standard for good restaurant service. For poor service, 10% is acceptable. In many European countries, service is included, so rounding up or 5–10% is common.' },
      { question: 'Should I tip before or after tax?', answer: 'Most people tip on the pre-tax subtotal, but tipping on the total including tax is also common. The difference is small; either approach is acceptable.' },
      { question: 'How do I split the bill?', answer: 'Divide the total (bill plus tip) by the number of people. This calculator does that automatically when you enter the number of people.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'inflation-calculator',
    title: 'Inflation Calculator',
    description: 'See how much a past amount is worth today, or project future purchasing power.',
    metaDescription: 'Free inflation calculator. Calculate how inflation affects the value of money over time. Find the future or past equivalent value of any amount.',
    category: 'finance-calculators',
    keywords: ['inflation calculator', 'purchasing power', 'future value', 'real value', 'cost of living'],
    icon: TrendingUp,
    fields: [
      { id: 'amount', label: 'Amount ($)', type: 'number', placeholder: '1000', min: 0 },
      { id: 'rate', label: 'Average Annual Inflation Rate (%)', type: 'number', placeholder: '3', min: 0, step: 0.01, defaultValue: '3' },
      { id: 'years', label: 'Number of Years', type: 'number', placeholder: '10', min: 1 },
      { id: 'mode', label: 'Direction', type: 'select', options: [
        { value: 'future', label: 'Future value (money loses value)' },
        { value: 'past', label: 'Past equivalent (what it was worth)' },
      ], defaultValue: 'future' },
    ],
    calculate: ({ fields }) => {
      const amount = parseFloat(fields.amount as string);
      const rate = parseFloat(fields.rate as string) || 0;
      const years = parseFloat(fields.years as string);
      const mode = fields.mode as string;
      if (!amount || amount <= 0 || !years || years <= 0) return null;

      let result: number;
      if (mode === 'future') {
        result = amount * Math.pow(1 + rate / 100, years);
      } else {
        result = amount / Math.pow(1 + rate / 100, years);
      }

      return {
        title: 'Inflation Result',
        value: formatCurrency(result),
        summary: mode === 'future'
          ? `${formatCurrency(amount)} today will have the purchasing power equivalent of ${formatCurrency(result)} in ${formatNumber(years, 0)} years at ${formatPercent(rate, 2)} annual inflation.`
          : `${formatCurrency(amount)} today was worth ${formatCurrency(result)} in today's terms ${formatNumber(years, 0)} years ago at ${formatPercent(rate, 2)} annual inflation.`,
        details: [
          { label: 'Original amount', value: formatCurrency(amount) },
          { label: 'Equivalent amount', value: formatCurrency(result) },
          { label: 'Inflation rate', value: formatPercent(rate, 2) },
          { label: 'Time period', value: `${formatNumber(years, 0)} years` },
        ],
      };
    },
    explanation: 'Inflation measures how prices rise over time, reducing the purchasing power of money. To find a future equivalent, multiply by (1 + rate/100)^years. To find what a current amount was worth in the past, divide by the same factor. A 3% average annual inflation rate is a common long-term estimate for many economies.',
    faqs: [
      { question: 'What is inflation?', answer: 'Inflation is the rate at which the general level of prices rises over time, causing each unit of currency to buy less. Central banks typically target around 2% annual inflation.' },
      { question: 'What inflation rate should I use?', answer: 'Historically, U.S. inflation has averaged about 3% per year. Use 2–3% for long-term planning in developed economies. For shorter periods, check recent official inflation figures.' },
      { question: 'Why does money lose value over time?', answer: 'As prices rise, each dollar buys fewer goods and services. This is why $100 today will not buy the same amount in 10 years — you need more dollars to purchase the same things.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Calculate return on investment as a percentage, including annualized return.',
    metaDescription: 'Free ROI calculator. Calculate return on investment as a percentage and annualized return. Compare investment performance easily.',
    category: 'finance-calculators',
    keywords: ['roi calculator', 'return on investment', 'investment return', 'annualized return', 'investment performance'],
    icon: Target,
    fields: [
      { id: 'initial', label: 'Initial Investment ($)', type: 'number', placeholder: '5000', min: 0 },
      { id: 'final', label: 'Final Value ($)', type: 'number', placeholder: '7500', min: 0 },
      { id: 'years', label: 'Time Period (years)', type: 'number', placeholder: '3', min: 0, step: 0.1 },
    ],
    calculate: ({ fields }) => {
      const initial = parseFloat(fields.initial as string);
      const final = parseFloat(fields.final as string);
      const years = parseFloat(fields.years as string);
      if (!initial || initial <= 0 || final === undefined || isNaN(final)) return null;

      const gain = final - initial;
      const roi = (gain / initial) * 100;
      const annualized = years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0;

      return {
        title: 'ROI Result',
        value: formatPercent(roi, 2),
        summary: `Your investment ${gain >= 0 ? 'gained' : 'lost'} ${formatCurrency(Math.abs(gain))}, a ${formatPercent(roi, 2)} return${years > 0 ? ` over ${formatNumber(years, 1)} years (${formatPercent(annualized, 2)} annualized)` : ''}.`,
        details: [
          { label: 'Initial investment', value: formatCurrency(initial) },
          { label: 'Final value', value: formatCurrency(final) },
          { label: 'Total gain/loss', value: formatCurrency(gain) },
          { label: 'Total ROI', value: formatPercent(roi, 2) },
          ...(years > 0 ? [{ label: 'Annualized return', value: formatPercent(annualized, 2) }] : []),
        ],
      };
    },
    explanation: 'Return on Investment (ROI) measures the profitability of an investment. Total ROI = (final value − initial investment) / initial investment × 100. Annualized return accounts for time: ((final/initial)^(1/years) − 1) × 100. This lets you compare investments of different durations on equal footing.',
    faqs: [
      { question: 'What is a good ROI?', answer: 'A 7–10% annual return is considered good for stock market investments. Real estate might target 8–12%. Compare your ROI to a benchmark like the S&P 500 average or a risk-free rate like government bonds.' },
      { question: 'What is annualized return?', answer: 'Annualized return converts a multi-year return into an equivalent yearly rate, making it easy to compare investments held for different periods. It accounts for compounding.' },
      { question: 'Does ROI account for risk?', answer: 'No. ROI measures return only, not risk. Two investments with the same ROI may have very different risk profiles. Always consider volatility and risk-adjusted measures like the Sharpe ratio.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'break-even-calculator',
    title: 'Break-even Calculator',
    description: 'Find the sales volume or revenue needed to cover your fixed and variable costs.',
    metaDescription: 'Free break-even calculator. Calculate the break-even point in units and revenue. Find how many sales you need to cover fixed and variable costs.',
    category: 'finance-calculators',
    keywords: ['break-even calculator', 'break-even point', 'fixed costs', 'variable costs', 'business profitability'],
    icon: Scale,
    fields: [
      { id: 'fixedCosts', label: 'Total Fixed Costs ($)', type: 'number', placeholder: '10000', min: 0 },
      { id: 'price', label: 'Price per Unit ($)', type: 'number', placeholder: '25', min: 0 },
      { id: 'variableCost', label: 'Variable Cost per Unit ($)', type: 'number', placeholder: '10', min: 0 },
    ],
    calculate: ({ fields }) => {
      const fixedCosts = parseFloat(fields.fixedCosts as string) || 0;
      const price = parseFloat(fields.price as string);
      const variableCost = parseFloat(fields.variableCost as string) || 0;
      if (!price || price <= 0) return null;

      const contributionMargin = price - variableCost;
      if (contributionMargin <= 0) {
        return {
          title: 'Break-even Result',
          value: 'Not possible',
          summary: `Your variable cost per unit (${formatCurrency(variableCost)}) exceeds your price (${formatCurrency(price)}). You cannot break even — each unit sold increases your loss.`,
          details: [
            { label: 'Price per unit', value: formatCurrency(price) },
            { label: 'Variable cost per unit', value: formatCurrency(variableCost) },
            { label: 'Contribution margin', value: formatCurrency(contributionMargin) },
          ],
        };
      }

      const breakEvenUnits = fixedCosts / contributionMargin;
      const breakEvenRevenue = breakEvenUnits * price;

      return {
        title: 'Break-even Result',
        value: `${formatNumber(breakEvenUnits, 0)} units`,
        summary: `You need to sell ${formatNumber(breakEvenUnits, 0)} units (${formatCurrency(breakEvenRevenue)} in revenue) to break even. Each unit contributes ${formatCurrency(contributionMargin)} toward covering fixed costs.`,
        details: [
          { label: 'Fixed costs', value: formatCurrency(fixedCosts) },
          { label: 'Price per unit', value: formatCurrency(price) },
          { label: 'Variable cost per unit', value: formatCurrency(variableCost) },
          { label: 'Contribution margin per unit', value: formatCurrency(contributionMargin) },
          { label: 'Break-even point (units)', value: formatNumber(breakEvenUnits, 0) },
          { label: 'Break-even revenue', value: formatCurrency(breakEvenRevenue) },
        ],
      };
    },
    explanation: 'The break-even point is where total revenue equals total costs — no profit, no loss. It is calculated as fixed costs divided by the contribution margin per unit (price minus variable cost). Each unit sold contributes its margin toward covering fixed costs. Once fixed costs are covered, each additional unit sold generates profit equal to the contribution margin.',
    faqs: [
      { question: 'What is the break-even point?', answer: 'It is the sales volume where total revenue exactly equals total costs. Below this point, you lose money; above it, you profit. It helps businesses set sales targets and price products.' },
      { question: 'What are fixed vs. variable costs?', answer: 'Fixed costs stay the same regardless of production (rent, salaries, insurance). Variable costs change with each unit produced (materials, packaging, shipping). The difference matters for break-even analysis.' },
      { question: 'How can I lower my break-even point?', answer: 'Increase price, reduce variable costs per unit, or reduce fixed costs. Any of these increases the contribution margin or reduces the fixed costs you need to cover, lowering the break-even volume.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'commission-calculator',
    title: 'Commission Calculator',
    description: 'Calculate sales commission from sales amount and commission rate or structure.',
    metaDescription: 'Free commission calculator. Calculate sales commission from sales amount and commission rate. Supports flat-rate and tiered commission structures.',
    category: 'finance-calculators',
    keywords: ['commission calculator', 'sales commission', 'commission rate', 'sales earnings', 'commission structure'],
    icon: BadgeDollarSign,
    fields: [
      { id: 'sales', label: 'Total Sales ($)', type: 'number', placeholder: '50000', min: 0 },
      { id: 'rate', label: 'Commission Rate (%)', type: 'number', placeholder: '5', min: 0, step: 0.01 },
      { id: 'base', label: 'Base Salary ($)', type: 'number', placeholder: '3000', min: 0, defaultValue: '0' },
    ],
    calculate: ({ fields }) => {
      const sales = parseFloat(fields.sales as string);
      const rate = parseFloat(fields.rate as string) || 0;
      const base = parseFloat(fields.base as string) || 0;
      if (!sales || sales <= 0) return null;

      const commission = sales * (rate / 100);
      const total = base + commission;

      return {
        title: 'Commission Result',
        value: formatCurrency(commission),
        summary: `At ${formatPercent(rate, 2)} commission on ${formatCurrency(sales)} in sales, you earn ${formatCurrency(commission)} in commission${base > 0 ? ` plus ${formatCurrency(base)} base salary, for ${formatCurrency(total)} total` : ''}.`,
        details: [
          { label: 'Total sales', value: formatCurrency(sales) },
          { label: 'Commission rate', value: formatPercent(rate, 2) },
          { label: 'Commission earned', value: formatCurrency(commission) },
          { label: 'Base salary', value: formatCurrency(base) },
          { label: 'Total earnings', value: formatCurrency(total) },
        ],
      };
    },
    explanation: 'Sales commission is a payment to a salesperson based on the value of sales made, usually calculated as a percentage of total sales: commission = sales × (rate/100). Some roles also include a base salary. Total earnings = base salary + commission. Commission structures can be flat-rate, tiered (higher rates for higher sales), or based on profit margin rather than revenue.',
    faqs: [
      { question: 'What is a typical commission rate?', answer: 'Commission rates vary widely by industry: 2–5% for real estate, 5–15% for retail sales, 20–50% for software sales. Higher-ticket or harder-to-sell products often have higher commission rates.' },
      { question: 'What is the difference between base salary plus commission and commission-only?', answer: 'Base + commission provides a guaranteed minimum income plus incentive. Commission-only roles pay only for sales made, offering higher earning potential but more income risk.' },
      { question: 'How do tiered commissions work?', answer: 'Tiered commissions pay higher rates as sales increase. For example, 5% on the first $10,000, 7% on $10,001–$25,000, and 10% above. This calculator uses a flat rate; for tiered structures, calculate each tier separately.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'salary-calculator',
    title: 'Salary Calculator',
    description: 'Convert between hourly, daily, weekly, monthly, and annual salary figures.',
    metaDescription: 'Free salary calculator. Convert between hourly wage, annual salary, monthly, weekly, and daily pay. See how pay rates compare across time periods.',
    category: 'finance-calculators',
    keywords: ['salary calculator', 'hourly to annual', 'annual to hourly', 'wage converter', 'pay calculator'],
    icon: Wallet,
    fields: [
      { id: 'amount', label: 'Amount ($)', type: 'number', placeholder: '25', min: 0 },
      { id: 'period', label: 'Pay Period', type: 'select', options: [
        { value: 'hourly', label: 'Per Hour' },
        { value: 'daily', label: 'Per Day' },
        { value: 'weekly', label: 'Per Week' },
        { value: 'monthly', label: 'Per Month' },
        { value: 'annual', label: 'Per Year' },
      ], defaultValue: 'hourly' },
      { id: 'hoursPerWeek', label: 'Hours per Week', type: 'number', placeholder: '40', min: 1, defaultValue: '40' },
      { id: 'daysPerWeek', label: 'Days per Week', type: 'number', placeholder: '5', min: 1, defaultValue: '5' },
    ],
    calculate: ({ fields }) => {
      const amount = parseFloat(fields.amount as string);
      const period = fields.period as string;
      const hoursPerWeek = parseFloat(fields.hoursPerWeek as string) || 40;
      const daysPerWeek = parseFloat(fields.daysPerWeek as string) || 5;
      if (!amount || amount <= 0) return null;

      let hourly: number;
      if (period === 'hourly') hourly = amount;
      else if (period === 'daily') hourly = amount / (hoursPerWeek / daysPerWeek);
      else if (period === 'weekly') hourly = amount / hoursPerWeek;
      else if (period === 'monthly') hourly = (amount * 12) / (hoursPerWeek * 52);
      else hourly = amount / (hoursPerWeek * 52);

      const daily = hourly * (hoursPerWeek / daysPerWeek);
      const weekly = hourly * hoursPerWeek;
      const monthly = (hourly * hoursPerWeek * 52) / 12;
      const annual = hourly * hoursPerWeek * 52;

      return {
        title: 'Salary Conversion',
        value: formatCurrency(annual),
        summary: `An input of ${formatCurrency(amount)} ${period} equals approximately ${formatCurrency(hourly)}/hour, ${formatCurrency(weekly)}/week, ${formatCurrency(monthly)}/month, and ${formatCurrency(annual)}/year.`,
        details: [
          { label: 'Hourly', value: formatCurrency(hourly) },
          { label: 'Daily', value: formatCurrency(daily) },
          { label: 'Weekly', value: formatCurrency(weekly) },
          { label: 'Monthly', value: formatCurrency(monthly) },
          { label: 'Annual', value: formatCurrency(annual) },
        ],
      };
    },
    explanation: 'This calculator converts pay between time periods using a standard 52-week year. Annual = hourly × hours per week × 52. Monthly = annual / 12. Weekly = hourly × hours per week. Daily = weekly / days per week. Adjusting hours and days per week lets the calculator reflect part-time work or non-standard schedules.',
    faqs: [
      { question: 'How many work hours are in a year?', answer: 'A standard full-time year has 2,080 hours (40 hours × 52 weeks). Some calculations use 2,000 hours to account for holidays and vacation, giving a slightly lower annual figure.' },
      { question: 'How do I convert hourly to annual salary?', answer: 'Multiply the hourly rate by hours worked per week, then by 52 weeks. For example, $25/hour × 40 hours × 52 weeks = $52,000/year.' },
      { question: 'Does this account for taxes?', answer: 'No. This calculator shows gross pay before taxes, deductions, or benefits. Your take-home (net) pay will be lower after income tax, Social Security, Medicare, and any other deductions.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'budget-calculator',
    title: 'Budget Calculator',
    description: 'Split your monthly income into needs, wants, and savings using the 50/30/20 rule.',
    metaDescription: 'Free budget calculator. Split your monthly income into needs, wants, and savings using the 50/30/20 budgeting rule. Plan your spending easily.',
    category: 'finance-calculators',
    keywords: ['budget calculator', '50/30/20 rule', 'budgeting', 'monthly budget', 'spending plan', 'savings rate'],
    icon: PieChart,
    fields: [
      { id: 'income', label: 'Monthly Income ($)', type: 'number', placeholder: '5000', min: 0 },
      { id: 'needsPct', label: 'Needs (%)', type: 'number', placeholder: '50', min: 0, max: 100, defaultValue: '50' },
      { id: 'wantsPct', label: 'Wants (%)', type: 'number', placeholder: '30', min: 0, max: 100, defaultValue: '30' },
      { id: 'savingsPct', label: 'Savings (%)', type: 'number', placeholder: '20', min: 0, max: 100, defaultValue: '20' },
    ],
    calculate: ({ fields }) => {
      const income = parseFloat(fields.income as string);
      const needsPct = parseFloat(fields.needsPct as string) || 0;
      const wantsPct = parseFloat(fields.wantsPct as string) || 0;
      const savingsPct = parseFloat(fields.savingsPct as string) || 0;
      if (!income || income <= 0) return null;

      const totalPct = needsPct + wantsPct + savingsPct;
      if (totalPct === 0) return null;

      const needs = income * (needsPct / 100);
      const wants = income * (wantsPct / 100);
      const savings = income * (savingsPct / 100);

      return {
        title: 'Budget Breakdown',
        value: formatCurrency(income),
        summary: totalPct === 100
          ? `Of your ${formatCurrency(income)} monthly income, allocate ${formatCurrency(needs)} to needs, ${formatCurrency(wants)} to wants, and ${formatCurrency(savings)} to savings.`
          : `Your categories total ${formatPercent(totalPct, 0)} of income (should be 100%). At current rates: ${formatCurrency(needs)} needs, ${formatCurrency(wants)} wants, ${formatCurrency(savings)} savings.`,
        details: [
          { label: 'Monthly income', value: formatCurrency(income) },
          { label: 'Needs', value: `${formatCurrency(needs)} (${formatPercent(needsPct, 0)})` },
          { label: 'Wants', value: `${formatCurrency(wants)} (${formatPercent(wantsPct, 0)})` },
          { label: 'Savings', value: `${formatCurrency(savings)} (${formatPercent(savingsPct, 0)})` },
          { label: 'Total allocated', value: formatPercent(totalPct, 0) },
        ],
      };
    },
    explanation: 'The 50/30/20 rule is a popular budgeting framework: 50% of income to needs (rent, groceries, utilities, insurance), 30% to wants (entertainment, dining, hobbies), and 20% to savings and debt repayment. You can adjust these percentages to fit your situation — for example, saving more in high-income years or allocating more to needs in expensive cities.',
    faqs: [
      { question: 'What is the 50/30/20 rule?', answer: 'It is a simple budgeting guideline popularized by Senator Elizabeth Warren. Allocate 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.' },
      { question: 'What counts as needs vs. wants?', answer: 'Needs are essentials: housing, groceries, utilities, transportation, insurance, minimum debt payments. Wants are non-essentials: dining out, entertainment, vacations, hobbies, subscriptions.' },
      { question: 'What if my needs exceed 50%?', answer: 'In high-cost areas, needs may take more than 50%. Reduce wants first, then look for ways to lower fixed costs. If needs consistently exceed 60–70%, consider increasing income or relocating.' },
    ],
    recentlyAdded: true,
  });
}
