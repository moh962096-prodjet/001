import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { FunctionSquare, Grid3x3, Spline, Binary, Sigma, Layers, BarChart3, Dices, Hash, Type } from 'lucide-react';

function gcd(a: number, b: number): number {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n: number): boolean {
  n = Math.trunc(n);
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

// --- Safe expression evaluator (shunting-yard) for Scientific Calculator ---
type Token = { type: 'num' | 'op' | 'func' | 'lparen' | 'rparen' | 'comma'; value: string };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const funcs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs', 'exp'];
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c >= '0' && c <= '9' || c === '.') {
      let num = '';
      while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) { num += expr[i]; i++; }
      if (i < expr.length && (expr[i] === 'e' || expr[i] === 'E')) {
        num += expr[i]; i++;
        if (i < expr.length && (expr[i] === '+' || expr[i] === '-')) { num += expr[i]; i++; }
        while (i < expr.length && expr[i] >= '0' && expr[i] <= '9') { num += expr[i]; i++; }
      }
      tokens.push({ type: 'num', value: num });
      continue;
    }
    if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
      let name = '';
      while (i < expr.length && /[a-zA-Z0-9]/.test(expr[i])) { name += expr[i]; i++; }
      if (funcs.includes(name.toLowerCase())) {
        tokens.push({ type: 'func', value: name.toLowerCase() });
      } else if (name.toLowerCase() === 'pi') {
        tokens.push({ type: 'num', value: String(Math.PI) });
      } else if (name.toLowerCase() === 'e') {
        tokens.push({ type: 'num', value: String(Math.E) });
      } else {
        throw new Error(`Unknown function or variable: ${name}`);
      }
      continue;
    }
    if (c === '(') { tokens.push({ type: 'lparen', value: c }); i++; continue; }
    if (c === ')') { tokens.push({ type: 'rparen', value: c }); i++; continue; }
    if (c === ',') { tokens.push({ type: 'comma', value: c }); i++; continue; }
    if ('+-*/^%'.includes(c)) {
      // Handle unary minus/plus
      if ((c === '+' || c === '-') && (tokens.length === 0 || tokens[tokens.length - 1].type === 'op' || tokens[tokens.length - 1].type === 'lparen' || tokens[tokens.length - 1].type === 'comma')) {
        tokens.push({ type: 'num', value: '0' });
      }
      tokens.push({ type: 'op', value: c });
      i++;
      continue;
    }
    if (c === '×') { tokens.push({ type: 'op', value: '*' }); i++; continue; }
    if (c === '÷') { tokens.push({ type: 'op', value: '/' }); i++; continue; }
    throw new Error(`Unexpected character: ${c}`);
  }
  return tokens;
}

const opPrecedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
const opRightAssoc: Record<string, boolean> = { '^': true };

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];
  for (const t of tokens) {
    if (t.type === 'num') { output.push(t); continue; }
    if (t.type === 'func') { stack.push(t); continue; }
    if (t.type === 'comma') {
      while (stack.length && stack[stack.length - 1].type !== 'lparen') output.push(stack.pop()!);
      continue;
    }
    if (t.type === 'op') {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === 'op' && (opPrecedence[top.value] > opPrecedence[t.value] || (opPrecedence[top.value] === opPrecedence[t.value] && !opRightAssoc[t.value]))) {
          output.push(stack.pop()!);
        } else if (top.type === 'func') {
          output.push(stack.pop()!);
        } else break;
      }
      stack.push(t);
      continue;
    }
    if (t.type === 'lparen') { stack.push(t); continue; }
    if (t.type === 'rparen') {
      while (stack.length && stack[stack.length - 1].type !== 'lparen') output.push(stack.pop()!);
      if (!stack.length) throw new Error('Mismatched parentheses');
      stack.pop();
      if (stack.length && stack[stack.length - 1].type === 'func') output.push(stack.pop()!);
      continue;
    }
  }
  while (stack.length) {
    const t = stack.pop()!;
    if (t.type === 'lparen' || t.type === 'rparen') throw new Error('Mismatched parentheses');
    output.push(t);
  }
  return output;
}

function evalRPN(rpn: Token[]): number {
  const stack: number[] = [];
  const toRad = (d: number) => d;
  for (const t of rpn) {
    if (t.type === 'num') { stack.push(parseFloat(t.value)); continue; }
    if (t.type === 'func') {
      const a = stack.pop();
      if (a === undefined) throw new Error('Invalid expression');
      switch (t.value) {
        case 'sin': stack.push(Math.sin(toRad(a))); break;
        case 'cos': stack.push(Math.cos(toRad(a))); break;
        case 'tan': stack.push(Math.tan(toRad(a))); break;
        case 'asin': stack.push(Math.asin(a)); break;
        case 'acos': stack.push(Math.acos(a)); break;
        case 'atan': stack.push(Math.atan(a)); break;
        case 'log': stack.push(Math.log10(a)); break;
        case 'ln': stack.push(Math.log(a)); break;
        case 'sqrt': stack.push(Math.sqrt(a)); break;
        case 'abs': stack.push(Math.abs(a)); break;
        case 'exp': stack.push(Math.exp(a)); break;
        default: throw new Error(`Unknown function: ${t.value}`);
      }
      continue;
    }
    if (t.type === 'op') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid expression');
      switch (t.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
        case '%': stack.push(a % b); break;
        case '^': stack.push(Math.pow(a, b)); break;
      }
    }
  }
  if (stack.length !== 1) throw new Error('Invalid expression');
  return stack[0];
}

function evaluateExpression(expr: string): number {
  const tokens = tokenize(expr);
  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}

// --- Matrix parsing ---
function parseMatrix(text: string): number[][] | null {
  const rows = text.trim().split(/[\n;]+/).map((r) => r.trim()).filter(Boolean);
  if (rows.length === 0) return null;
  const matrix: number[][] = [];
  for (const row of rows) {
    const cols = row.split(/[\s,\t]+/).map((c) => parseFloat(c));
    if (cols.some(isNaN)) return null;
    matrix.push(cols);
  }
  const cols = matrix[0].length;
  if (matrix.some((r) => r.length !== cols)) return null;
  return matrix;
}

function matrixToString(m: number[][]): string {
  return m.map((row) => row.map((v) => formatNumber(v, 4)).join('  ')).join('\n');
}

function determinant(m: number[][]): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = m.slice(1).map((row) => row.filter((_, idx) => idx !== j));
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(minor);
  }
  return det;
}

function transpose(m: number[][]): number[][] {
  return m[0].map((_, i) => m.map((row) => row[i]));
}

function matrixMultiply(a: number[][], b: number[][]): number[][] | null {
  if (a[0].length !== b.length) return null;
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, val, k) => sum + val * b[k][j], 0)));
}

// --- Roman numeral conversion ---
function intToRoman(num: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  let n = Math.trunc(num);
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function romanToInt(s: string): number | null {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const str = s.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(str)) return null;
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = map[str[i]];
    const next = i + 1 < str.length ? map[str[i + 1]] : 0;
    if (cur < next) total -= cur;
    else total += cur;
  }
  return total;
}

export function registerMathTools3() {
  registerTool({
    slug: 'scientific-calculator',
    title: 'Scientific Calculator',
    description: 'Evaluate complex expressions with trigonometry, logarithms, exponents, and more.',
    metaDescription: 'Free scientific calculator. Evaluate math expressions with sin, cos, tan, log, ln, square root, exponents, factorial, and constants like pi and e.',
    category: 'math-calculators',
    keywords: ['scientific calculator', 'trigonometry calculator', 'log calculator', 'exponent calculator', 'math expression', 'sin cos tan'],
    icon: FunctionSquare,
    fields: [
      { id: 'expression', label: 'Expression', type: 'text', placeholder: 'sin(0.5) + 2^3 * sqrt(16)', hint: 'Supports: + - * / ^ %, sin, cos, tan, asin, acos, atan, log, ln, sqrt, abs, exp, pi, e' },
      { id: 'angleMode', label: 'Angle Mode', type: 'select', options: [
        { value: 'rad', label: 'Radians' },
        { value: 'deg', label: 'Degrees' },
      ], defaultValue: 'rad' },
    ],
    calculate: ({ fields }) => {
      const expr = (fields.expression as string).trim();
      const angleMode = fields.angleMode as string;
      if (!expr) return null;
      try {
        let processedExpr = expr;
        if (angleMode === 'deg') {
          // Convert degree arguments to radians for trig functions
          processedExpr = processedExpr.replace(/(sin|cos|tan)\(/g, '$1((pi/180)*');
        }
        const result = evaluateExpression(processedExpr);
        if (!isFinite(result)) return { title: 'Result', value: 'Infinity or undefined' };
        return {
          title: 'Result',
          value: formatNumber(result, 10),
          summary: `${expr} = ${formatNumber(result, 10)}`,
          details: [
            { label: 'Expression', value: expr },
            { label: 'Result', value: formatNumber(result, 10) },
            { label: 'Angle mode', value: angleMode === 'deg' ? 'Degrees' : 'Radians' },
          ],
        };
      } catch (e) {
        return { title: 'Error', value: (e as Error).message };
      }
    },
    explanation: 'A scientific calculator evaluates mathematical expressions using the order of operations (PEMDAS). It supports trigonometric functions (sin, cos, tan and their inverses), logarithms (log base 10, natural ln), square roots, exponents, and constants like pi and e. Trigonometric functions use radians by default; switch to degrees to input angles in degrees.',
    faqs: [
      { question: 'What functions does this calculator support?', answer: 'It supports +, -, *, /, ^ (power), % (modulo), sin, cos, tan, asin, acos, atan, log (base 10), ln (natural), sqrt, abs, exp, and the constants pi and e.' },
      { question: 'What is the difference between radians and degrees?', answer: 'Radians and degrees are two units for measuring angles. 360 degrees = 2π radians. Trigonometric functions in most programming contexts use radians. Switch the angle mode to degrees if your input is in degrees.' },
      { question: 'How does the calculator handle order of operations?', answer: 'It follows PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right). Use parentheses to override the default order.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'matrix-calculator',
    title: 'Matrix Calculator',
    description: 'Compute the determinant, transpose, and product of matrices.',
    metaDescription: 'Free matrix calculator. Calculate matrix determinant, transpose, and multiply matrices. Enter matrices in a simple row-by-row format.',
    category: 'math-calculators',
    keywords: ['matrix calculator', 'determinant calculator', 'transpose matrix', 'matrix multiplication', 'linear algebra'],
    icon: Grid3x3,
    fields: [
      { id: 'mode', label: 'Operation', type: 'select', options: [
        { value: 'det', label: 'Determinant' },
        { value: 'transpose', label: 'Transpose' },
        { value: 'multiply', label: 'Multiply A × B' },
      ], defaultValue: 'det' },
      { id: 'matrixA', label: 'Matrix A (rows separated by new lines or semicolons, values by spaces or commas)', type: 'textarea', placeholder: '1 2 3\n4 5 6\n7 8 9', hint: 'Example: 1 2 3\\n4 5 6\\n7 8 9' },
      { id: 'matrixB', label: 'Matrix B (for multiplication)', type: 'textarea', placeholder: '1 0 0\n0 1 0\n0 0 1', hint: 'Only used for multiplication' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;
      const matrixA = parseMatrix(fields.matrixA as string);
      if (!matrixA) return null;

      if (mode === 'det') {
        if (matrixA.length !== matrixA[0].length) return { title: 'Error', value: 'Determinant requires a square matrix' };
        const det = determinant(matrixA);
        return {
          title: 'Determinant',
          value: formatNumber(det, 6),
          summary: `The determinant of the ${matrixA.length}×${matrixA.length} matrix is ${formatNumber(det, 6)}.`,
          details: [
            { label: 'Matrix size', value: `${matrixA.length}×${matrixA[0].length}` },
            { label: 'Determinant', value: formatNumber(det, 6) },
          ],
        };
      }

      if (mode === 'transpose') {
        const t = transpose(matrixA);
        return {
          title: 'Transpose',
          value: `${t.length}×${t[0].length}`,
          summary: `The transpose of the ${matrixA.length}×${matrixA[0].length} matrix is a ${t.length}×${t[0].length} matrix.`,
          details: [
            { label: 'Original', value: matrixToString(matrixA) },
            { label: 'Transposed', value: matrixToString(t) },
          ],
        };
      }

      if (mode === 'multiply') {
        const matrixB = parseMatrix(fields.matrixB as string);
        if (!matrixB) return { title: 'Error', value: 'Please enter Matrix B for multiplication' };
        const product = matrixMultiply(matrixA, matrixB);
        if (!product) return { title: 'Error', value: 'Columns of A must equal rows of B' };
        return {
          title: 'Product',
          value: `${product.length}×${product[0].length}`,
          summary: `The product of A (${matrixA.length}×${matrixA[0].length}) and B (${matrixB.length}×${matrixB[0].length}) is a ${product.length}×${product[0].length} matrix.`,
          details: [
            { label: 'Matrix A', value: matrixToString(matrixA) },
            { label: 'Matrix B', value: matrixToString(matrixB) },
            { label: 'A × B', value: matrixToString(product) },
          ],
        };
      }

      return null;
    },
    explanation: 'A matrix is a rectangular array of numbers arranged in rows and columns. The determinant is a scalar value computed from a square matrix, used in linear algebra to solve systems of equations. The transpose swaps rows and columns. Matrix multiplication combines two matrices where the number of columns in the first equals the number of rows in the second.',
    faqs: [
      { question: 'How do I enter a matrix?', answer: 'Enter each row on a new line (or separated by semicolons). Within a row, separate values with spaces or commas. For example, a 2×2 matrix: "1 2\\n3 4".' },
      { question: 'What is a determinant?', answer: 'The determinant is a single number computed from a square matrix. For a 2×2 matrix [[a,b],[c,d]], the determinant is ad − bc. It is zero for singular (non-invertible) matrices.' },
      { question: 'When can I multiply two matrices?', answer: 'You can multiply A × B only when the number of columns in A equals the number of rows in B. The result has the same number of rows as A and columns as B.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'quadratic-equation-calculator',
    title: 'Quadratic Equation Calculator',
    description: 'Solve ax² + bx + c = 0 using the quadratic formula with real and complex roots.',
    metaDescription: 'Free quadratic equation calculator. Solve ax² + bx + c = 0 using the quadratic formula. Shows real and complex roots, discriminant, and step-by-step solution.',
    category: 'math-calculators',
    keywords: ['quadratic equation calculator', 'quadratic formula', 'roots of equation', 'discriminant', 'solve quadratic'],
    icon: Spline,
    fields: [
      { id: 'a', label: 'Coefficient a', type: 'number', placeholder: '1' },
      { id: 'b', label: 'Coefficient b', type: 'number', placeholder: '-5' },
      { id: 'c', label: 'Coefficient c', type: 'number', placeholder: '6' },
    ],
    calculate: ({ fields }) => {
      const a = parseFloat(fields.a as string);
      const b = parseFloat(fields.b as string);
      const c = parseFloat(fields.c as string);
      if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
      if (a === 0) return { title: 'Error', value: 'Coefficient a cannot be zero (not a quadratic equation)' };

      const discriminant = b * b - 4 * a * c;

      if (discriminant > 0) {
        const sqrtD = Math.sqrt(discriminant);
        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);
        return {
          title: 'Two Real Roots',
          value: `x = ${formatNumber(x1, 6)}, x = ${formatNumber(x2, 6)}`,
          summary: `The equation ${formatNumber(a, 0)}x² + ${formatNumber(b, 0)}x + ${formatNumber(c, 0)} = 0 has two real roots: x₁ = ${formatNumber(x1, 6)} and x₂ = ${formatNumber(x2, 6)}.`,
          details: [
            { label: 'Discriminant (b² − 4ac)', value: formatNumber(discriminant, 6) },
            { label: 'Root x₁', value: formatNumber(x1, 6) },
            { label: 'Root x₂', value: formatNumber(x2, 6) },
            { label: 'Sum of roots', value: formatNumber(x1 + x2, 6) },
            { label: 'Product of roots', value: formatNumber(x1 * x2, 6) },
          ],
        };
      }

      if (discriminant === 0) {
        const x = -b / (2 * a);
        return {
          title: 'One Real Root (Repeated)',
          value: `x = ${formatNumber(x, 6)}`,
          summary: `The equation has one repeated real root: x = ${formatNumber(x, 6)}.`,
          details: [
            { label: 'Discriminant', value: '0' },
            { label: 'Root x', value: formatNumber(x, 6) },
          ],
        };
      }

      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      return {
        title: 'Two Complex Roots',
        value: `x = ${formatNumber(realPart, 6)} ± ${formatNumber(imagPart, 6)}i`,
        summary: `The discriminant is negative (${formatNumber(discriminant, 6)}), so the equation has two complex conjugate roots: x = ${formatNumber(realPart, 6)} ± ${formatNumber(imagPart, 6)}i.`,
        details: [
          { label: 'Discriminant (b² − 4ac)', value: formatNumber(discriminant, 6) },
          { label: 'Real part', value: formatNumber(realPart, 6) },
          { label: 'Imaginary part', value: formatNumber(imagPart, 6) },
          { label: 'Root x₁', value: `${formatNumber(realPart, 6)} + ${formatNumber(imagPart, 6)}i` },
          { label: 'Root x₂', value: `${formatNumber(realPart, 6)} − ${formatNumber(imagPart, 6)}i` },
        ],
      };
    },
    explanation: 'A quadratic equation has the form ax² + bx + c = 0 (a ≠ 0). The quadratic formula gives the roots: x = (−b ± √(b² − 4ac)) / 2a. The discriminant (b² − 4ac) determines the nature of the roots: positive means two real roots, zero means one repeated real root, and negative means two complex conjugate roots.',
    faqs: [
      { question: 'What is the quadratic formula?', answer: 'x = (−b ± √(b² − 4ac)) / 2a. It gives the solutions (roots) of any quadratic equation ax² + bx + c = 0.' },
      { question: 'What is the discriminant?', answer: 'The discriminant is b² − 4ac. If positive, there are two real roots. If zero, one repeated real root. If negative, two complex roots.' },
      { question: 'What are complex roots?', answer: 'When the discriminant is negative, the square root of a negative number produces an imaginary component. The roots are complex conjugates of the form a ± bi, where i = √(−1).' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'prime-number-checker',
    title: 'Prime Number Checker',
    description: 'Check whether a number is prime and find its prime factorization if it is not.',
    metaDescription: 'Free prime number checker. Test if any number is prime and view its prime factorization. Learn about prime numbers and divisibility.',
    category: 'math-calculators',
    keywords: ['prime number checker', 'prime checker', 'is prime', 'prime factorization', 'prime numbers'],
    icon: Binary,
    fields: [
      { id: 'number', label: 'Number', type: 'number', placeholder: '97', min: 0 },
    ],
    calculate: ({ fields }) => {
      const n = parseInt(fields.number as string, 10);
      if (isNaN(n)) return null;

      if (n < 2) {
        return {
          title: 'Not Prime',
          value: `${n} is not prime`,
          summary: `${n} is not a prime number. Prime numbers must be greater than 1.`,
          details: [
            { label: 'Input', value: String(n) },
            { label: 'Result', value: 'Not prime (less than 2)' },
          ],
        };
      }

      if (isPrime(n)) {
        return {
          title: 'Prime',
          value: `${n} is prime`,
          summary: `${n} is a prime number — it has exactly two divisors: 1 and itself.`,
          details: [
            { label: 'Input', value: String(n) },
            { label: 'Result', value: 'Prime' },
            { label: 'Divisors', value: '1, ' + n },
          ],
        };
      }

      // Prime factorization
      const factors: number[] = [];
      let num = n;
      for (let d = 2; d * d <= num; d++) {
        while (num % d === 0) { factors.push(d); num /= d; }
      }
      if (num > 1) factors.push(num);

      const factorStr = factors.join(' × ');
      return {
        title: 'Not Prime',
        value: `${n} is not prime`,
        summary: `${n} is not a prime number. Its prime factorization is: ${factorStr}.`,
        details: [
          { label: 'Input', value: String(n) },
          { label: 'Result', value: 'Not prime' },
          { label: 'Prime factorization', value: factorStr },
          { label: 'Number of factors', value: String(factors.length) },
        ],
      };
    },
    explanation: 'A prime number is a natural number greater than 1 that has exactly two positive divisors: 1 and itself. Numbers with more than two divisors are composite. To check primality, test divisibility by all integers from 2 up to the square root of the number. If none divide evenly, the number is prime.',
    faqs: [
      { question: 'What is a prime number?', answer: 'A prime number is a whole number greater than 1 whose only divisors are 1 and itself. Examples include 2, 3, 5, 7, 11, 13, and 17.' },
      { question: 'Is 1 a prime number?', answer: 'No. By definition, a prime number must have exactly two distinct divisors. Since 1 has only one divisor (itself), it is not considered prime.' },
      { question: 'What is prime factorization?', answer: 'Prime factorization expresses a composite number as a product of prime numbers. For example, 12 = 2 × 2 × 3. Every composite number has a unique prime factorization.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'lcm-calculator',
    title: 'LCM Calculator',
    description: 'Find the Least Common Multiple of two or more numbers.',
    metaDescription: 'Free LCM calculator. Find the Least Common Multiple (LCM) of two or more numbers quickly and accurately with step-by-step explanation.',
    category: 'math-calculators',
    keywords: ['lcm calculator', 'least common multiple', 'lcm', 'common multiple', 'lcm finder'],
    icon: Layers,
    fields: [
      { id: 'numbers', label: 'Numbers (separated by commas)', type: 'text', placeholder: '12, 18, 24' },
    ],
    calculate: ({ fields }) => {
      const input = (fields.numbers as string).trim();
      if (!input) return null;
      const nums = input.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
      if (nums.length < 2) return { title: 'Error', value: 'Enter at least 2 positive numbers' };

      let result = nums[0];
      for (let i = 1; i < nums.length; i++) {
        result = lcm(result, nums[i]);
      }

      return {
        title: 'LCM Result',
        value: String(result),
        summary: `The Least Common Multiple of ${nums.join(', ')} is ${result}.`,
        details: [
          { label: 'Input numbers', value: nums.join(', ') },
          { label: 'LCM', value: String(result) },
        ],
      };
    },
    explanation: 'The Least Common Multiple (LCM) is the smallest positive integer that is divisible by all given numbers. It is calculated using the relationship LCM(a, b) = |a × b| / GCF(a, b). For more than two numbers, compute the LCM iteratively. The LCM is useful for finding common denominators in fractions and solving scheduling problems.',
    faqs: [
      { question: 'What is the LCM?', answer: 'The Least Common Multiple is the smallest number that all given numbers divide into evenly. For example, LCM(4, 6) = 12, since 12 is the smallest number divisible by both 4 and 6.' },
      { question: 'How is LCM related to GCF?', answer: 'LCM(a, b) = |a × b| / GCF(a, b). This relationship means if you know the GCF, you can find the LCM and vice versa.' },
      { question: 'Where is LCM used?', answer: 'LCM is commonly used to find a common denominator when adding or subtracting fractions, and in scheduling problems to find when repeating events will coincide.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'gcf-calculator',
    title: 'GCF Calculator',
    description: 'Find the Greatest Common Factor (GCD) of two or more numbers.',
    metaDescription: 'Free GCF calculator. Find the Greatest Common Factor (GCF), also known as GCD, of two or more numbers using the Euclidean algorithm.',
    category: 'math-calculators',
    keywords: ['gcf calculator', 'greatest common factor', 'gcd calculator', 'greatest common divisor', 'hcf'],
    icon: Sigma,
    fields: [
      { id: 'numbers', label: 'Numbers (separated by commas)', type: 'text', placeholder: '24, 36, 48' },
    ],
    calculate: ({ fields }) => {
      const input = (fields.numbers as string).trim();
      if (!input) return null;
      const nums = input.split(',').map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n) && n > 0);
      if (nums.length < 2) return { title: 'Error', value: 'Enter at least 2 positive numbers' };

      let result = nums[0];
      for (let i = 1; i < nums.length; i++) {
        result = gcd(result, nums[i]);
      }

      return {
        title: 'GCF Result',
        value: String(result),
        summary: `The Greatest Common Factor of ${nums.join(', ')} is ${result}.`,
        details: [
          { label: 'Input numbers', value: nums.join(', ') },
          { label: 'GCF', value: String(result) },
        ],
      };
    },
    explanation: 'The Greatest Common Factor (GCF), also called the Greatest Common Divisor (GCD), is the largest positive integer that divides all given numbers without a remainder. It is computed using the Euclidean algorithm: repeatedly replace the larger number with the remainder of dividing the larger by the smaller until the remainder is zero. The GCF is used to simplify fractions and find common divisors.',
    faqs: [
      { question: 'What is the GCF?', answer: 'The Greatest Common Factor is the largest number that divides all given numbers evenly. For example, GCF(24, 36) = 12, since 12 is the largest number dividing both 24 and 36.' },
      { question: 'What is the Euclidean algorithm?', answer: 'It is an efficient method for finding the GCF. Repeatedly divide the larger number by the smaller and take the remainder, until the remainder is zero. The last non-zero remainder is the GCF.' },
      { question: 'Are GCF and GCD the same?', answer: 'Yes. GCF (Greatest Common Factor) and GCD (Greatest Common Divisor) are two names for the same concept. Some also call it HCF (Highest Common Factor).' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'standard-deviation-calculator',
    title: 'Standard Deviation Calculator',
    description: 'Calculate standard deviation, variance, and range for any dataset.',
    metaDescription: 'Free standard deviation calculator. Calculate population and sample standard deviation, variance, mean, and range from any dataset.',
    category: 'math-calculators',
    keywords: ['standard deviation calculator', 'variance calculator', 'statistics calculator', 'population standard deviation', 'sample standard deviation'],
    icon: BarChart3,
    fields: [
      { id: 'data', label: 'Data Values (separated by commas)', type: 'textarea', placeholder: '4, 8, 15, 16, 23, 42' },
      { id: 'type', label: 'Standard Deviation Type', type: 'select', options: [
        { value: 'sample', label: 'Sample (divide by n−1)' },
        { value: 'population', label: 'Population (divide by n)' },
      ], defaultValue: 'sample' },
    ],
    calculate: ({ fields }) => {
      const input = (fields.data as string).trim();
      const type = fields.type as string;
      if (!input) return null;
      const nums = input.split(',').map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
      if (nums.length < 2) return { title: 'Error', value: 'Enter at least 2 numbers' };

      const n = nums.length;
      const mean = nums.reduce((a, b) => a + b, 0) / n;
      const squaredDiffs = nums.map((x) => (x - mean) ** 2);
      const divisor = type === 'sample' ? n - 1 : n;
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
      const stdDev = Math.sqrt(variance);
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const range = max - min;

      return {
        title: 'Standard Deviation',
        value: formatNumber(stdDev, 6),
        summary: `The ${type} standard deviation is ${formatNumber(stdDev, 6)} with a variance of ${formatNumber(variance, 6)} and a mean of ${formatNumber(mean, 6)}.`,
        details: [
          { label: 'Count (n)', value: String(n) },
          { label: 'Mean', value: formatNumber(mean, 6) },
          { label: 'Variance', value: formatNumber(variance, 6) },
          { label: 'Standard deviation', value: formatNumber(stdDev, 6) },
          { label: 'Minimum', value: formatNumber(min, 6) },
          { label: 'Maximum', value: formatNumber(max, 6) },
          { label: 'Range', value: formatNumber(range, 6) },
        ],
      };
    },
    explanation: 'Standard deviation measures how spread out data values are from the mean. A low standard deviation means values cluster near the mean; a high one means they are spread widely. It is calculated as the square root of the variance. Sample standard deviation divides by n−1 (for a sample of a population), while population standard deviation divides by n (for the entire population).',
    faqs: [
      { question: 'What is the difference between sample and population standard deviation?', answer: 'Sample standard deviation divides the squared differences by n−1 (Bessel\'s correction) to better estimate the population from a sample. Population standard deviation divides by n when you have data for the entire population.' },
      { question: 'What is variance?', answer: 'Variance is the average of the squared differences from the mean. Standard deviation is the square root of variance, expressed in the same units as the original data.' },
      { question: 'What does a high standard deviation mean?', answer: 'A high standard deviation indicates that data points are spread out over a wide range of values. A low standard deviation means they are clustered closely around the mean.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'mean-median-mode-calculator',
    title: 'Mean, Median & Mode Calculator',
    description: 'Calculate the mean, median, mode, and other statistics for any dataset.',
    metaDescription: 'Free mean, median, and mode calculator. Calculate arithmetic mean, median, mode, range, and other descriptive statistics for any dataset.',
    category: 'math-calculators',
    keywords: ['mean median mode calculator', 'average calculator', 'statistics calculator', 'central tendency', 'median calculator'],
    icon: BarChart3,
    fields: [
      { id: 'data', label: 'Data Values (separated by commas)', type: 'textarea', placeholder: '5, 10, 15, 10, 20, 10, 25' },
    ],
    calculate: ({ fields }) => {
      const input = (fields.data as string).trim();
      if (!input) return null;
      const nums = input.split(',').map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
      if (nums.length === 0) return { title: 'Error', value: 'Enter at least one number' };

      const n = nums.length;
      const sorted = [...nums].sort((a, b) => a - b);
      const mean = nums.reduce((a, b) => a + b, 0) / n;

      let median: number;
      if (n % 2 === 0) {
        median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      } else {
        median = sorted[Math.floor(n / 2)];
      }

      // Mode
      const freq: Record<number, number> = {};
      for (const num of nums) freq[num] = (freq[num] || 0) + 1;
      const maxFreq = Math.max(...Object.values(freq));
      const modes = Object.entries(freq)
        .filter(([, count]) => count === maxFreq)
        .map(([num]) => parseFloat(num));
      const modeStr = maxFreq === 1 ? 'No mode' : modes.length === 1 ? String(modes[0]) : modes.join(', ');

      const min = sorted[0];
      const max = sorted[n - 1];
      const range = max - min;

      return {
        title: 'Statistics Result',
        value: formatNumber(mean, 6),
        summary: `Mean: ${formatNumber(mean, 6)}, Median: ${formatNumber(median, 6)}, Mode: ${modeStr}.`,
        details: [
          { label: 'Count', value: String(n) },
          { label: 'Mean', value: formatNumber(mean, 6) },
          { label: 'Median', value: formatNumber(median, 6) },
          { label: 'Mode', value: modeStr },
          { label: 'Range', value: formatNumber(range, 6) },
          { label: 'Minimum', value: formatNumber(min, 6) },
          { label: 'Maximum', value: formatNumber(max, 6) },
        ],
      };
    },
    explanation: 'Mean, median, and mode are measures of central tendency that describe the center of a dataset. The mean is the arithmetic average (sum divided by count). The median is the middle value when data is sorted. The mode is the most frequently occurring value. Each measure gives different insight — the median is less affected by outliers than the mean.',
    faqs: [
      { question: 'What is the difference between mean, median, and mode?', answer: 'Mean is the average of all values. Median is the middle value when sorted. Mode is the most frequent value. Mean is sensitive to outliers, while median is more robust for skewed data.' },
      { question: 'When should I use median instead of mean?', answer: 'Use the median for skewed distributions or data with outliers (like income data). The median better represents the "typical" value because it is not pulled by extreme values.' },
      { question: 'Can a dataset have more than one mode?', answer: 'Yes. If two values tie for most frequent, the data is bimodal. If three or more tie, it is multimodal. If all values appear once, there is no mode.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    description: 'Generate random numbers within a custom range, with optional unique values.',
    metaDescription: 'Free random number generator. Generate one or more random numbers within a custom range. Option to generate unique (non-repeating) numbers.',
    category: 'math-calculators',
    keywords: ['random number generator', 'random number', 'rng', 'random picker', 'random integers'],
    icon: Dices,
    fields: [
      { id: 'min', label: 'Minimum', type: 'number', placeholder: '1', defaultValue: '1' },
      { id: 'max', label: 'Maximum', type: 'number', placeholder: '100', defaultValue: '100' },
      { id: 'count', label: 'How Many Numbers', type: 'number', placeholder: '1', min: 1, defaultValue: '1' },
      { id: 'unique', label: 'Unique Values Only (no repeats)', type: 'checkbox', defaultValue: false },
    ],
    calculate: ({ fields }) => {
      const min = parseInt(fields.min as string, 10);
      const max = parseInt(fields.max as string, 10);
      const count = parseInt(fields.count as string, 10);
      const unique = fields.unique as boolean;
      if (isNaN(min) || isNaN(max) || isNaN(count)) return null;
      if (min > max) return { title: 'Error', value: 'Minimum must be less than or equal to maximum' };
      if (count < 1) return { title: 'Error', value: 'Count must be at least 1' };

      const range = max - min + 1;

      if (unique && count > range) {
        return { title: 'Error', value: `Cannot generate ${count} unique numbers from a range of ${range} values` };
      }

      const numbers: number[] = [];
      if (unique) {
        const pool = Array.from({ length: range }, (_, i) => min + i);
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          numbers.push(pool.splice(idx, 1)[0]);
        }
      } else {
        for (let i = 0; i < count; i++) {
          numbers.push(Math.floor(Math.random() * range) + min);
        }
      }

      return {
        title: 'Random Numbers',
        value: numbers.join(', '),
        summary: `Generated ${count} random ${unique ? 'unique ' : ''}number${count > 1 ? 's' : ''} between ${min} and ${max}: ${numbers.join(', ')}.`,
        details: [
          { label: 'Range', value: `${min} to ${max}` },
          { label: 'Count', value: String(count) },
          { label: 'Unique', value: unique ? 'Yes' : 'No' },
          { label: 'Result', value: numbers.join(', ') },
        ],
      };
    },
    explanation: 'A random number generator produces numbers that are uniformly distributed within a specified range. Each number has an equal probability of being selected. When unique values are requested, numbers are drawn without replacement (like picking lottery balls), ensuring no repeats within a single generation.',
    faqs: [
      { question: 'Are these numbers truly random?', answer: 'This calculator uses JavaScript\'s Math.random(), which produces pseudo-random numbers. They are sufficiently random for most everyday purposes but not cryptographically secure.' },
      { question: 'What does "unique values only" mean?', answer: 'When enabled, each generated number appears at most once — no repeats. This is like drawing lottery balls from a bag without putting them back. The count cannot exceed the range size.' },
      { question: 'Can I generate negative numbers?', answer: 'Yes. Set the minimum to a negative number. For example, with min = −10 and max = 10, you will get random numbers in that range including negatives.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'roman-numeral-converter',
    title: 'Roman Numeral Converter',
    description: 'Convert between Roman numerals and decimal numbers in either direction.',
    metaDescription: 'Free Roman numeral converter. Convert numbers to Roman numerals and Roman numerals to numbers. Supports values from 1 to 3999.',
    category: 'math-calculators',
    keywords: ['roman numeral converter', 'roman numerals', 'number to roman', 'roman to number', 'roman numeral translator'],
    icon: Type,
    fields: [
      { id: 'mode', label: 'Conversion Direction', type: 'select', options: [
        { value: 'toRoman', label: 'Number → Roman Numeral' },
        { value: 'fromRoman', label: 'Roman Numeral → Number' },
      ], defaultValue: 'toRoman' },
      { id: 'value', label: 'Value', type: 'text', placeholder: '2024', hint: 'Enter a number (1–3999) or a Roman numeral (e.g., MMXXIV)' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;
      const value = (fields.value as string).trim();
      if (!value) return null;

      if (mode === 'toRoman') {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 1 || num > 3999) {
          return { title: 'Error', value: 'Enter a number between 1 and 3999' };
        }
        const roman = intToRoman(num);
        return {
          title: 'Roman Numeral',
          value: roman,
          summary: `${num} in Roman numerals is ${roman}.`,
          details: [
            { label: 'Input (decimal)', value: String(num) },
            { label: 'Roman numeral', value: roman },
          ],
        };
      }

      const result = romanToInt(value);
      if (result === null) {
        return { title: 'Error', value: 'Invalid Roman numeral. Use only I, V, X, L, C, D, M' };
      }
      return {
        title: 'Decimal Number',
        value: String(result),
        summary: `${value.toUpperCase()} in decimal is ${result}.`,
        details: [
          { label: 'Input (Roman)', value: value.toUpperCase() },
          { label: 'Decimal value', value: String(result) },
        ],
      };
    },
    explanation: 'Roman numerals use letters from the Latin alphabet: I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Numbers are formed by combining symbols and adding values, with subtractive notation for certain pairs (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900). The system supports numbers from 1 to 3999.',
    faqs: [
      { question: 'What are the basic Roman numeral symbols?', answer: 'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. These are combined additively, with subtractive pairs like IV (4) and IX (9) for efficiency.' },
      { question: 'Why is the maximum 3999?', answer: 'Standard Roman numerals do not have a symbol for 5,000 or 10,000. The largest standard representation is MMMCMXCIX (3999). Extensions using overlines exist for larger numbers but are not supported here.' },
      { question: 'How does subtractive notation work?', answer: 'When a smaller symbol precedes a larger one, it is subtracted. For example, IV = 5 − 1 = 4, and IX = 10 − 1 = 9. This avoids four repeats of the same symbol (IIII → IV).' },
    ],
    recentlyAdded: true,
  });
}
