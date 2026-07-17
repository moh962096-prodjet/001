import { registerTool } from '../toolRegistry';
import { formatNumber, formatCurrency } from '../../utils/format';
import { CalendarDays, HeartPulse, Flame, Percent, Landmark, Home, Coins } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

export function registerHealthTools() {
  registerTool({
    slug: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days from your date of birth.',
    metaDescription: 'Free online age calculator. Find your exact age in years, months, weeks, days, hours and minutes from your date of birth.',
    category: 'health-calculators',
    keywords: ['age calculator', 'date of birth', 'how old am i', 'age in days'],
    icon: CalendarDays,
    fields: [
      { id: 'dob', label: 'Date of Birth', type: 'date' },
      { id: 'asOf', label: 'Age at Date', type: 'date', defaultValue: today },
    ],
    calculate: ({ fields }) => {
      const dob = fields.dob as string;
      const asOf = (fields.asOf as string) || today;
      if (!dob) return null;
      const birth = new Date(dob);
      const target = new Date(asOf);
      if (birth > target) return { title: 'Age', value: 'Invalid dates', summary: 'Date of birth must be before the target date.' };
      let years = target.getFullYear() - birth.getFullYear();
      let months = target.getMonth() - birth.getMonth();
      let days = target.getDate() - birth.getDate();
      if (days < 0) {
        months--;
        days += new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86400000);
      return {
        title: 'Your Age',
        value: `${years} years, ${months} months, ${days} days`,
        summary: `You have been alive for ${formatNumber(totalDays, 0)} days.`,
        details: [
          { label: 'In months', value: `${formatNumber(years * 12 + months, 0)} months` },
          { label: 'In weeks', value: `${formatNumber(Math.floor(totalDays / 7), 0)} weeks` },
          { label: 'In days', value: `${formatNumber(totalDays, 0)} days` },
          { label: 'In hours', value: `${formatNumber(totalDays * 24, 0)} hours` },
        ],
      };
    },
    explanation: 'Your age is calculated from your date of birth to the target date. The result accounts for varying month lengths and leap years, giving you an exact breakdown in years, months, and days, plus the total number of days you have been alive.',
    faqs: [
      { question: 'How is age calculated?', answer: 'Age is the difference between your date of birth and the target date, broken down into years, months, and days with calendar accuracy.' },
      { question: 'Does this account for leap years?', answer: 'Yes. The calculator uses actual calendar dates, so leap years and varying month lengths are handled automatically.' },
      { question: 'Can I calculate age at a future date?', answer: 'Yes. Change the "Age at Date" field to any future date to see how old you will be then.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) and see what weight category you fall into.',
    metaDescription: 'Free BMI calculator. Calculate your Body Mass Index from height and weight in metric or imperial units and see your weight category.',
    category: 'health-calculators',
    keywords: ['bmi calculator', 'body mass index', 'weight calculator', 'healthy weight'],
    icon: HeartPulse,
    fields: [
      { id: 'unit', label: 'Unit System', type: 'select', options: [{ value: 'metric', label: 'Metric (cm, kg)' }, { value: 'imperial', label: 'Imperial (in, lb)' }], defaultValue: 'metric' },
      { id: 'height', label: 'Height', type: 'number', placeholder: '170', hint: 'cm (metric) or inches (imperial)' },
      { id: 'weight', label: 'Weight', type: 'number', placeholder: '70', hint: 'kg (metric) or lbs (imperial)' },
    ],
    calculate: ({ fields }) => {
      const unit = (fields.unit as string) || 'metric';
      const height = parseFloat(fields.height as string);
      const weight = parseFloat(fields.weight as string);
      if (!height || !weight) return null;
      let bmi: number;
      if (unit === 'metric') {
        bmi = weight / Math.pow(height / 100, 2);
      } else {
        bmi = (weight / Math.pow(height, 2)) * 703;
      }
      if (!isFinite(bmi) || bmi <= 0) return null;
      let category: string;
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal weight';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
      return {
        title: 'Your BMI',
        value: `${bmi.toFixed(1)} — ${category}`,
        summary: `A BMI between 18.5 and 24.9 is considered a healthy range for most adults.`,
        details: [
          { label: 'BMI value', value: bmi.toFixed(1) },
          { label: 'Category', value: category },
          { label: 'Healthy weight range', value: unit === 'metric' ? `${(18.5 * Math.pow(height / 100, 2)).toFixed(1)} kg – ${(24.9 * Math.pow(height / 100, 2)).toFixed(1)} kg` : `${(18.5 * Math.pow(height, 2) / 703).toFixed(1)} lb – ${(24.9 * Math.pow(height, 2) / 703).toFixed(1)} lb` },
        ],
      };
    },
    explanation: 'BMI (Body Mass Index) estimates body fat based on height and weight. It is calculated as weight divided by height squared (kg/m² in metric). While BMI does not directly measure body fat, it correlates well with body fat for most people and is widely used as a screening tool for weight categories.',
    faqs: [
      { question: 'What is a healthy BMI range?', answer: 'A BMI between 18.5 and 24.9 is generally considered healthy for adults. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obese.' },
      { question: 'Is BMI accurate for athletes?', answer: 'BMI may overestimate body fat in muscular individuals like athletes, since muscle weighs more than fat. It is a screening tool, not a diagnostic.' },
      { question: 'Does BMI apply to children?', answer: 'BMI for children and teens is calculated the same way but interpreted using age- and sex-specific percentiles, not the adult categories.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'calorie-calculator',
    title: 'Calorie Calculator',
    description: 'Estimate your daily calorie needs (TDEE) based on your age, gender, height, weight, and activity level.',
    metaDescription: 'Free calorie calculator. Estimate your daily calorie needs (TDEE and BMR) based on age, gender, height, weight, and activity level to help manage your weight.',
    category: 'health-calculators',
    keywords: ['calorie calculator', 'tdee', 'bmr', 'daily calories', 'maintenance calories'],
    icon: Flame,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'age', label: 'Age', type: 'number', placeholder: '30', min: 1, max: 120 },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
      { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75' },
      { id: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary (little or no exercise)' },
        { value: '1.375', label: 'Lightly active (1–3 days/week)' },
        { value: '1.55', label: 'Moderately active (3–5 days/week)' },
        { value: '1.725', label: 'Very active (6–7 days/week)' },
        { value: '1.9', label: 'Extra active (physical job)' },
      ], defaultValue: '1.55' },
    ],
    calculate: ({ fields }) => {
      const gender = fields.gender as string;
      const age = parseFloat(fields.age as string);
      const height = parseFloat(fields.height as string);
      const weight = parseFloat(fields.weight as string);
      const activity = parseFloat(fields.activity as string);
      if (!age || !height || !weight) return null;
      let bmr: number;
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      const tdee = bmr * activity;
      return {
        title: 'Daily Calorie Needs',
        value: `${formatNumber(tdee, 0)} kcal/day`,
        summary: `Your BMR is ${formatNumber(bmr, 0)} kcal. To maintain your current weight, eat about ${formatNumber(tdee, 0)} kcal per day.`,
        details: [
          { label: 'BMR (at rest)', value: `${formatNumber(bmr, 0)} kcal/day` },
          { label: 'Maintain weight', value: `${formatNumber(tdee, 0)} kcal/day` },
          { label: 'Lose 0.5 kg/week', value: `${formatNumber(tdee - 500, 0)} kcal/day` },
          { label: 'Gain 0.5 kg/week', value: `${formatNumber(tdee + 500, 0)} kcal/day` },
        ],
      };
    },
    explanation: 'Your Total Daily Energy Expenditure (TDEE) is the number of calories you burn each day. It is calculated from your Basal Metabolic Rate (BMR) — the energy your body uses at rest — multiplied by an activity factor. To lose weight, eat fewer calories than your TDEE; to gain weight, eat more.',
    faqs: [
      { question: 'What is BMR?', answer: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic functions like breathing and circulation at complete rest.' },
      { question: 'How accurate is the calorie calculator?', answer: 'It uses the Mifflin-St Jeor equation, one of the most accurate formulas. However, individual metabolism varies, so treat the result as an estimate.' },
      { question: 'How many calories to lose weight?', answer: 'A deficit of about 500 kcal/day typically leads to roughly 0.5 kg (1 lb) of weight loss per week. Always consult a healthcare professional before starting a diet.' },
    ],
    popular: true,
  });
}

export function registerMathTools() {
  registerTool({
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, and what percent one number is of another.',
    metaDescription: 'Free percentage calculator. Calculate what is X% of Y, percentage increase/decrease, and what percent one number is of another.',
    category: 'math-calculators',
    keywords: ['percentage calculator', 'percent change', 'percentage increase', 'percentage of number'],
    icon: Percent,
    fields: [
      { id: 'mode', label: 'Calculation Type', type: 'select', options: [
        { value: 'of', label: 'What is X% of Y?' },
        { value: 'isWhat', label: 'X is what % of Y?' },
        { value: 'change', label: '% change from X to Y' },
      ], defaultValue: 'of' },
      { id: 'x', label: 'Value X', type: 'number', placeholder: '25' },
      { id: 'y', label: 'Value Y', type: 'number', placeholder: '200' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;
      const x = parseFloat(fields.x as string);
      const y = parseFloat(fields.y as string);
      if (isNaN(x) || isNaN(y)) return null;
      let value: string;
      let summary: string;
      if (mode === 'of') {
        const result = (x / 100) * y;
        value = `${x}% of ${y} = ${formatNumber(result)}`;
        summary = `${x}% of ${y} is ${formatNumber(result)}.`;
      } else if (mode === 'isWhat') {
        if (y === 0) return { title: 'Percentage', value: 'Cannot divide by zero' };
        const result = (x / y) * 100;
        value = `${x} is ${formatNumber(result, 2)}% of ${y}`;
        summary = `${x} is ${formatNumber(result, 2)}% of ${y}.`;
      } else {
        if (x === 0) return { title: 'Percentage Change', value: 'Cannot divide by zero' };
        const result = ((y - x) / Math.abs(x)) * 100;
        const direction = result >= 0 ? 'increase' : 'decrease';
        value = `${formatNumber(result, 2)}% ${direction}`;
        summary = `From ${x} to ${y} is a ${formatNumber(Math.abs(result), 2)}% ${direction}.`;
      }
      return { title: 'Result', value, summary };
    },
    explanation: 'A percentage expresses a number as a fraction of 100. "What is X% of Y" multiplies Y by X/100. "X is what % of Y" divides X by Y and multiplies by 100. Percentage change measures the difference between two values relative to the original.',
    faqs: [
      { question: 'How do I calculate a percentage?', answer: 'To find X% of Y, multiply Y by X and divide by 100. To find what percent X is of Y, divide X by Y and multiply by 100.' },
      { question: 'How is percentage change calculated?', answer: 'Percentage change = ((new value − old value) / |old value|) × 100. A positive result is an increase; negative is a decrease.' },
      { question: 'What is a percentage point?', answer: 'A percentage point is the arithmetic difference between two percentages. For example, going from 10% to 15% is a 5 percentage point increase, not a 5% increase.' },
    ],
    popular: true,
  });
}

export function registerFinanceTools() {
  registerTool({
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and total cost for any fixed-rate loan.',
    metaDescription: 'Free loan calculator. Estimate monthly payments, total interest, and total cost for personal, auto, or student loans with a fixed interest rate.',
    category: 'finance-calculators',
    keywords: ['loan calculator', 'monthly payment', 'interest', 'personal loan', 'auto loan'],
    icon: Landmark,
    fields: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', placeholder: '20000', min: 0 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '7.5', min: 0, step: 0.01 },
      { id: 'term', label: 'Loan Term (months)', type: 'number', placeholder: '60', min: 1 },
    ],
    calculate: ({ fields }) => {
      const p = parseFloat(fields.amount as string);
      const r = parseFloat(fields.rate as string) / 100 / 12;
      const n = parseInt(fields.term as string, 10);
      if (!p || !n) return null;
      let monthly: number;
      if (r === 0) {
        monthly = p / n;
      } else {
        monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      const total = monthly * n;
      const interest = total - p;
      return {
        title: 'Loan Summary',
        value: `${formatCurrency(monthly)} / month`,
        summary: `You will pay ${formatCurrency(monthly)} per month for ${n} months.`,
        details: [
          { label: 'Monthly payment', value: formatCurrency(monthly) },
          { label: 'Total interest', value: formatCurrency(interest) },
          { label: 'Total paid', value: formatCurrency(total) },
        ],
      };
    },
    explanation: 'The monthly payment for a fixed-rate loan is calculated using the amortization formula: M = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate, and n is the number of payments. The total cost is the monthly payment multiplied by the number of payments.',
    faqs: [
      { question: 'What is an amortized loan?', answer: 'An amortized loan is repaid in equal monthly installments that cover both principal and interest, with the balance reaching zero at the end of the term.' },
      { question: 'How is interest calculated?', answer: 'The annual interest rate is divided by 12 to get the monthly rate. Interest accrues on the remaining balance each month.' },
      { question: 'Can I use this for any loan type?', answer: 'Yes. This calculator works for any fixed-rate, fixed-term loan including personal, auto, and student loans.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment including principal, interest, taxes, and insurance.',
    metaDescription: 'Free mortgage calculator. Estimate your monthly mortgage payment including principal, interest, property taxes, and home insurance.',
    category: 'finance-calculators',
    keywords: ['mortgage calculator', 'home loan', 'monthly mortgage payment', 'PITI'],
    icon: Home,
    fields: [
      { id: 'price', label: 'Home Price ($)', type: 'number', placeholder: '400000', min: 0 },
      { id: 'down', label: 'Down Payment ($)', type: 'number', placeholder: '80000', min: 0 },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', placeholder: '6.5', min: 0, step: 0.01 },
      { id: 'term', label: 'Loan Term (years)', type: 'number', placeholder: '30', min: 1 },
      { id: 'tax', label: 'Property Tax ($/year)', type: 'number', placeholder: '4800', min: 0 },
      { id: 'insurance', label: 'Home Insurance ($/year)', type: 'number', placeholder: '1400', min: 0 },
    ],
    calculate: ({ fields }) => {
      const price = parseFloat(fields.price as string);
      const down = parseFloat(fields.down as string) || 0;
      const rate = parseFloat(fields.rate as string) / 100 / 12;
      const years = parseInt(fields.term as string, 10);
      const tax = parseFloat(fields.tax as string) || 0;
      const insurance = parseFloat(fields.insurance as string) || 0;
      if (!price || !years) return null;
      const p = price - down;
      const n = years * 12;
      let pi: number;
      if (rate === 0) pi = p / n;
      else pi = (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      const monthlyTax = tax / 12;
      const monthlyIns = insurance / 12;
      const total = pi + monthlyTax + monthlyIns;
      const totalInterest = pi * n - p;
      return {
        title: 'Mortgage Payment',
        value: `${formatCurrency(total)} / month`,
        summary: `Your estimated monthly payment is ${formatCurrency(total)}, including principal, interest, taxes, and insurance.`,
        details: [
          { label: 'Principal & Interest', value: `${formatCurrency(pi)} / mo` },
          { label: 'Property Tax', value: `${formatCurrency(monthlyTax)} / mo` },
          { label: 'Home Insurance', value: `${formatCurrency(monthlyIns)} / mo` },
          { label: 'Loan amount', value: formatCurrency(p) },
          { label: 'Total interest', value: formatCurrency(totalInterest) },
        ],
      };
    },
    explanation: 'Your monthly mortgage payment (PITI) includes Principal and Interest (PI), plus Property Tax and Insurance. The PI portion is calculated using the standard amortization formula on the loan amount (home price minus down payment). Taxes and insurance are added as monthly amounts.',
    faqs: [
      { question: 'What is PITI?', answer: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a typical monthly mortgage payment.' },
      { question: 'Does this include PMI?', answer: 'This calculator does not include Private Mortgage Insurance (PMI). If your down payment is less than 20%, you will likely need to add PMI to your monthly payment.' },
      { question: 'How does the down payment affect my payment?', answer: 'A larger down payment reduces the loan amount, which lowers both your monthly payment and the total interest paid over the life of the loan.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Calculate your Equated Monthly Installment (EMI) for any loan with a fixed interest rate.',
    metaDescription: 'Free EMI calculator. Calculate your Equated Monthly Installment for home, car, or personal loans with principal, interest, and total cost breakdown.',
    category: 'finance-calculators',
    keywords: ['emi calculator', 'equated monthly installment', 'loan emi', 'monthly installment'],
    icon: Coins,
    fields: [
      { id: 'amount', label: 'Loan Amount', type: 'number', placeholder: '500000', min: 0 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: '9.5', min: 0, step: 0.01 },
      { id: 'term', label: 'Loan Tenure (months)', type: 'number', placeholder: '60', min: 1 },
    ],
    calculate: ({ fields }) => {
      const p = parseFloat(fields.amount as string);
      const r = parseFloat(fields.rate as string) / 100 / 12;
      const n = parseInt(fields.term as string, 10);
      if (!p || !n) return null;
      let emi: number;
      if (r === 0) emi = p / n;
      else emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      const interest = total - p;
      return {
        title: 'EMI Result',
        value: `${formatNumber(emi)} / month`,
        summary: `Your monthly EMI is ${formatNumber(emi)} for ${n} months.`,
        details: [
          { label: 'Monthly EMI', value: formatNumber(emi) },
          { label: 'Total interest', value: formatNumber(interest) },
          { label: 'Total payable', value: formatNumber(total) },
        ],
      };
    },
    explanation: 'EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender each month. It consists of both principal and interest components. The formula is EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate, and n is the number of monthly installments.',
    faqs: [
      { question: 'What is EMI?', answer: 'EMI stands for Equated Monthly Installment — the fixed amount you pay each month toward a loan. Each payment covers part of the principal and part of the interest.' },
      { question: 'How is EMI different from a regular loan payment?', answer: 'EMI and amortized loan payments are the same concept. EMI is the term commonly used in India and some other countries for fixed monthly loan repayments.' },
      { question: 'Does the interest rate affect EMI significantly?', answer: 'Yes. Even a small change in the interest rate can have a meaningful impact on your monthly EMI and the total interest paid over the loan tenure.' },
    ],
    recentlyAdded: true,
  });
}
