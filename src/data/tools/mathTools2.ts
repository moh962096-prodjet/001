import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { Divide, Scale } from 'lucide-react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function registerMathTools2() {
  registerTool({
    slug: 'fraction-calculator',
    title: 'Fraction Calculator',
    description: 'Add, subtract, multiply, and divide fractions with step-by-step simplification.',
    metaDescription: 'Free fraction calculator. Add, subtract, multiply, and divide fractions. Shows simplified results with step-by-step reduction.',
    category: 'math-calculators',
    keywords: ['fraction calculator', 'add fractions', 'subtract fractions', 'multiply fractions', 'divide fractions', 'simplify fraction'],
    icon: Divide,
    fields: [
      { id: 'n1', label: 'Numerator 1', type: 'number', placeholder: '3' },
      { id: 'd1', label: 'Denominator 1', type: 'number', placeholder: '4' },
      { id: 'op', label: 'Operation', type: 'select', options: [
        { value: '+', label: 'Add (+)' },
        { value: '-', label: 'Subtract (−)' },
        { value: '*', label: 'Multiply (×)' },
        { value: '/', label: 'Divide (÷)' },
      ], defaultValue: '+' },
      { id: 'n2', label: 'Numerator 2', type: 'number', placeholder: '1' },
      { id: 'd2', label: 'Denominator 2', type: 'number', placeholder: '2' },
    ],
    calculate: ({ fields }) => {
      const n1 = parseInt(fields.n1 as string, 10);
      const d1 = parseInt(fields.d1 as string, 10);
      const n2 = parseInt(fields.n2 as string, 10);
      const d2 = parseInt(fields.d2 as string, 10);
      const op = fields.op as string;
      if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2) || d1 === 0 || d2 === 0) return null;

      let rn: number, rd: number;
      if (op === '+') { rn = n1 * d2 + n2 * d1; rd = d1 * d2; }
      else if (op === '-') { rn = n1 * d2 - n2 * d1; rd = d1 * d2; }
      else if (op === '*') { rn = n1 * n2; rd = d1 * d2; }
      else { if (n2 === 0) return { title: 'Fraction', value: 'Cannot divide by zero' }; rn = n1 * d2; rd = d1 * n2; }

      const divisor = gcd(rn, rd);
      const sn = rn / divisor;
      const sd = rd / divisor;
      const decimal = rn / rd;
      const whole = Math.floor(Math.abs(sn) / sd);
      const remainder = Math.abs(sn) % sd;

      let display = `${sn}/${sd}`;
      if (sd === 1) display = `${sn}`;
      else if (whole > 0 && remainder > 0) display = `${whole} ${remainder}/${sd}`;

      return {
        title: 'Result',
        value: display,
        summary: `${n1}/${d1} ${op} ${n2}/${d2} = ${sn}/${sd}${sn !== rn ? ` (simplified from ${rn}/${rd})` : ''}`,
        details: [
          { label: 'Raw result', value: `${rn}/${rd}` },
          { label: 'Simplified', value: sd === 1 ? `${sn}` : `${sn}/${sd}` },
          { label: 'Decimal', value: decimal.toFixed(4) },
          { label: 'Mixed number', value: whole > 0 && remainder > 0 ? `${whole} ${remainder}/${sd}` : (sd === 1 ? `${sn}` : `${sn}/${sd}`) },
        ],
      };
    },
    explanation: 'Fractions are calculated by finding a common denominator for addition and subtraction, then simplifying the result. For multiplication, multiply numerators and denominators directly. For division, multiply by the reciprocal of the second fraction. The result is simplified by dividing both numerator and denominator by their greatest common divisor (GCD).',
    faqs: [
      { question: 'How are fractions added?', answer: 'To add fractions, find a common denominator (the product of both denominators), convert each fraction, add the numerators, then simplify by dividing by the GCD.' },
      { question: 'How do I divide fractions?', answer: 'To divide, multiply the first fraction by the reciprocal (flipped version) of the second fraction. For example, 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2.' },
      { question: 'What does "simplified" mean?', answer: 'A simplified fraction has the smallest possible numerator and denominator with the same value. This is done by dividing both by their greatest common divisor (GCD).' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'ratio-calculator',
    title: 'Ratio Calculator',
    description: 'Solve and simplify ratios, find equivalent ratios, and solve ratio proportions.',
    metaDescription: 'Free ratio calculator. Simplify ratios, find equivalent ratios, and solve proportions (A:B = C:D). Perfect for recipes, scaling, and math.',
    category: 'math-calculators',
    keywords: ['ratio calculator', 'simplify ratio', 'equivalent ratio', 'proportion calculator', 'ratio solver'],
    icon: Scale,
    fields: [
      { id: 'mode', label: 'Calculation Mode', type: 'select', options: [
        { value: 'simplify', label: 'Simplify a ratio (A:B)' },
        { value: 'proportion', label: 'Solve proportion (A:B = C:D)' },
      ], defaultValue: 'simplify' },
      { id: 'a', label: 'A', type: 'number', placeholder: '12' },
      { id: 'b', label: 'B', type: 'number', placeholder: '8' },
      { id: 'c', label: 'C', type: 'number', placeholder: '3', hint: 'Only for proportion mode' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;
      const a = parseFloat(fields.a as string);
      const b = parseFloat(fields.b as string);
      if (isNaN(a) || isNaN(b) || b === 0) return null;

      if (mode === 'simplify') {
        const divisor = gcd(a, b);
        const sa = a / divisor;
        const sb = b / divisor;
        return {
          title: 'Simplified Ratio',
          value: `${formatNumber(sa, 0)} : ${formatNumber(sb, 0)}`,
          summary: `The ratio ${a}:${b} simplifies to ${formatNumber(sa, 0)}:${formatNumber(sb, 0)} (divided by ${formatNumber(divisor, 0)}).`,
          details: [
            { label: 'Original ratio', value: `${a} : ${b}` },
            { label: 'Simplified ratio', value: `${formatNumber(sa, 0)} : ${formatNumber(sb, 0)}` },
            { label: 'GCD', value: `${formatNumber(divisor, 0)}` },
            { label: 'Decimal (A/B)', value: (a / b).toFixed(4) },
          ],
        };
      }

      const c = parseFloat(fields.c as string);
      if (isNaN(c)) return null;
      const d = (b * c) / a;
      return {
        title: 'Proportion Solved',
        value: `${a} : ${b} = ${c} : ${formatNumber(d, 2)}`,
        summary: `If ${a}:${b} = ${c}:D, then D = ${formatNumber(d, 2)}.`,
        details: [
          { label: 'A : B', value: `${a} : ${b}` },
          { label: 'C : D', value: `${c} : ${formatNumber(d, 2)}` },
          { label: 'D value', value: `${formatNumber(d, 2)}` },
        ],
      };
    },
    explanation: 'A ratio compares two quantities. To simplify a ratio, divide both numbers by their greatest common divisor (GCD). For a proportion (A:B = C:D), if three values are known, the fourth is found by cross-multiplication: D = (B × C) / A. Ratios are commonly used in recipes, scaling, finance, and engineering.',
    faqs: [
      { question: 'How do I simplify a ratio?', answer: 'Divide both parts of the ratio by their greatest common divisor (GCD). For example, 12:8 has a GCD of 4, so the simplified ratio is 3:2.' },
      { question: 'What is a proportion?', answer: 'A proportion is an equation stating that two ratios are equal: A:B = C:D. If you know three of the four values, you can solve for the fourth.' },
      { question: 'How do I solve for D in a proportion?', answer: 'Use cross-multiplication: D = (B × C) / A. For example, if 2:3 = 6:D, then D = (3 × 6) / 2 = 9.' },
    ],
    recentlyAdded: true,
  });
}
