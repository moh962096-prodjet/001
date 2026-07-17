import { registerTool } from '../toolRegistry';
import { formatNumber, formatCurrency } from '../../utils/format';
import { Ruler, DollarSign, KeyRound, QrCode, Type as TypeIcon } from 'lucide-react';

export function registerConverterTools() {
  const lengthUnits = [
    { value: 'mm', label: 'Millimeter (mm)' },
    { value: 'cm', label: 'Centimeter (cm)' },
    { value: 'm', label: 'Meter (m)' },
    { value: 'km', label: 'Kilometer (km)' },
    { value: 'in', label: 'Inch (in)' },
    { value: 'ft', label: 'Foot (ft)' },
    { value: 'yd', label: 'Yard (yd)' },
    { value: 'mi', label: 'Mile (mi)' },
  ];
  const lengthToMeter: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };

  const weightToGram: Record<string, number> = { mg: 0.001, g: 1, kg: 1000, lb: 453.592, oz: 28.3495, t: 1000000 };
  const volumeToLiter: Record<string, number> = { ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353, cup: 0.236588 };
  const allUnits = [
    ...lengthUnits,
    { value: 'mg', label: 'Milligram (mg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'lb', label: 'Pound (lb)' },
    { value: 'oz', label: 'Ounce (oz)' },
    { value: 't', label: 'Tonne (t)' },
    { value: 'c', label: 'Celsius (°C)' },
    { value: 'f', label: 'Fahrenheit (°F)' },
    { value: 'k', label: 'Kelvin (K)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'gal', label: 'Gallon (gal)' },
    { value: 'qt', label: 'Quart (qt)' },
    { value: 'cup', label: 'Cup' },
  ];

  registerTool({
    slug: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between length, weight, temperature, and volume units instantly.',
    metaDescription: 'Free unit converter. Convert length, weight, mass, temperature, and volume between metric and imperial units instantly.',
    category: 'unit-converters',
    keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'metric to imperial'],
    icon: Ruler,
    fields: [
      { id: 'category', label: 'Category', type: 'select', options: [
        { value: 'length', label: 'Length' },
        { value: 'weight', label: 'Weight' },
        { value: 'temp', label: 'Temperature' },
        { value: 'volume', label: 'Volume' },
      ], defaultValue: 'length' },
      { id: 'value', label: 'Value', type: 'number', placeholder: '100' },
      { id: 'from', label: 'From', type: 'select', options: allUnits, defaultValue: 'cm' },
      { id: 'to', label: 'To', type: 'select', options: allUnits, defaultValue: 'in' },
    ],
    calculate: ({ fields }) => {
      const cat = fields.category as string;
      const val = parseFloat(fields.value as string);
      const from = fields.from as string;
      const to = fields.to as string;
      if (isNaN(val)) return null;
      let result: number;
      if (cat === 'length') {
        result = (val * lengthToMeter[from]) / lengthToMeter[to];
      } else if (cat === 'weight') {
        result = (val * weightToGram[from]) / weightToGram[to];
      } else if (cat === 'volume') {
        result = (val * volumeToLiter[from]) / volumeToLiter[to];
      } else {
        // temperature
        let c: number;
        if (from === 'c') c = val;
        else if (from === 'f') c = (val - 32) * (5 / 9);
        else c = val - 273.15;
        if (to === 'c') result = c;
        else if (to === 'f') result = c * (9 / 5) + 32;
        else result = c + 273.15;
      }
      return {
        title: 'Conversion Result',
        value: `${formatNumber(val, 4)} ${from} = ${formatNumber(result, 4)} ${to}`,
        summary: `${formatNumber(val)} ${from} converts to ${formatNumber(result, 4)} ${to}.`,
      };
    },
    explanation: 'Unit conversion works by converting the input value to a base unit (meters for length, grams for weight, liters for volume) and then from the base unit to the target unit. Temperature requires special formulas because the scales have different zero points.',
    faqs: [
      { question: 'What units can I convert?', answer: 'You can convert length (mm, cm, m, km, in, ft, yd, mi), weight (mg, g, kg, lb, oz, t), temperature (°C, °F, K), and volume (ml, l, gal, qt, cup).' },
      { question: 'How accurate are the conversions?', answer: 'Conversions use standard, precise conversion factors. Results are shown to 4 decimal places for accuracy.' },
      { question: 'Can I convert between metric and imperial?', answer: 'Yes. Simply select a metric unit as "From" and an imperial unit as "To" (or vice versa) and the conversion happens automatically.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between major world currencies using approximate exchange rates.',
    metaDescription: 'Free currency converter. Convert between USD, EUR, GBP, JPY, AUD, CAD, INR and other major world currencies instantly.',
    category: 'unit-converters',
    keywords: ['currency converter', 'exchange rate', 'usd to eur', 'currency exchange', 'forex'],
    icon: DollarSign,
    fields: [
      { id: 'amount', label: 'Amount', type: 'number', placeholder: '100', min: 0 },
      { id: 'from', label: 'From', type: 'select', options: [
        { value: 'USD', label: 'USD — US Dollar' },
        { value: 'EUR', label: 'EUR — Euro' },
        { value: 'GBP', label: 'GBP — British Pound' },
        { value: 'JPY', label: 'JPY — Japanese Yen' },
        { value: 'AUD', label: 'AUD — Australian Dollar' },
        { value: 'CAD', label: 'CAD — Canadian Dollar' },
        { value: 'INR', label: 'INR — Indian Rupee' },
        { value: 'CNY', label: 'CNY — Chinese Yuan' },
        { value: 'CHF', label: 'CHF — Swiss Franc' },
        { value: 'BRL', label: 'BRL — Brazilian Real' },
      ], defaultValue: 'USD' },
      { id: 'to', label: 'To', type: 'select', options: [
        { value: 'USD', label: 'USD — US Dollar' },
        { value: 'EUR', label: 'EUR — Euro' },
        { value: 'GBP', label: 'GBP — British Pound' },
        { value: 'JPY', label: 'JPY — Japanese Yen' },
        { value: 'AUD', label: 'AUD — Australian Dollar' },
        { value: 'CAD', label: 'CAD — Canadian Dollar' },
        { value: 'INR', label: 'INR — Indian Rupee' },
        { value: 'CNY', label: 'CNY — Chinese Yuan' },
        { value: 'CHF', label: 'CHF — Swiss Franc' },
        { value: 'BRL', label: 'BRL — Brazilian Real' },
      ], defaultValue: 'EUR' },
    ],
    calculate: ({ fields }) => {
      const amount = parseFloat(fields.amount as string);
      const from = fields.from as string;
      const to = fields.to as string;
      if (isNaN(amount)) return null;
      const rates: Record<string, number> = {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, AUD: 1.52, CAD: 1.36, INR: 83.2, CNY: 7.24, CHF: 0.88, BRL: 4.95,
      };
      const usd = amount / rates[from];
      const result = usd * rates[to];
      return {
        title: 'Conversion Result',
        value: `${formatCurrency(amount, from)} = ${formatCurrency(result, to)}`,
        summary: `${formatCurrency(amount, from)} is approximately ${formatCurrency(result, to)} based on recent exchange rates.`,
        details: [
          { label: 'Exchange rate', value: `1 ${from} ≈ ${formatNumber(rates[to] / rates[from], 4)} ${to}` },
          { label: 'Inverse rate', value: `1 ${to} ≈ ${formatNumber(rates[from] / rates[to], 4)} ${from}` },
        ],
      };
    },
    explanation: 'Currency conversion uses exchange rates relative to a base currency (USD). The amount is first converted to USD, then from USD to the target currency. The rates shown are approximate and for informational purposes — always check a live source for the current rate before making financial decisions.',
    faqs: [
      { question: 'Are these exchange rates live?', answer: 'No. The rates are approximate and updated periodically. For real-time rates, consult a financial data provider or your bank.' },
      { question: 'Which currencies are supported?', answer: 'USD, EUR, GBP, JPY, AUD, CAD, INR, CNY, CHF, and BRL. More currencies can be added easily.' },
      { question: 'Should I use this for trading?', answer: 'No. This tool is for general reference only. Always use a live, verified rate source for financial transactions.' },
    ],
    popular: true,
  });
}

export function registerDeveloperTools() {
  registerTool({
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, secure, random passwords with customizable length and character sets.',
    metaDescription: 'Free password generator. Create strong, secure, random passwords with customizable length, uppercase, lowercase, numbers, and symbols.',
    category: 'developer-tools',
    keywords: ['password generator', 'secure password', 'random password', 'strong password'],
    icon: KeyRound,
    fields: [
      { id: 'length', label: 'Password Length', type: 'range', defaultValue: 16, min: 8, max: 64 },
      { id: 'upper', label: 'Include uppercase (A-Z)', type: 'checkbox', defaultValue: true },
      { id: 'lower', label: 'Include lowercase (a-z)', type: 'checkbox', defaultValue: true },
      { id: 'numbers', label: 'Include numbers (0-9)', type: 'checkbox', defaultValue: true },
      { id: 'symbols', label: 'Include symbols (!@#$)', type: 'checkbox', defaultValue: true },
    ],
    calculate: ({ fields }) => {
      const length = (fields.length as number) || 16;
      const upper = fields.upper as boolean;
      const lower = fields.lower as boolean;
      const numbers = fields.numbers as boolean;
      const symbols = fields.symbols as boolean;
      let charset = '';
      if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (numbers) charset += '0123456789';
      if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (!charset) return { title: 'Password', value: 'Select at least one character set' };
      let password = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
      }
      const entropy = Math.round(length * Math.log2(charset.length));
      let strength = 'Weak';
      if (entropy >= 60) strength = 'Strong';
      if (entropy >= 100) strength = 'Very Strong';
      return {
        title: 'Generated Password',
        value: password,
        summary: `Entropy: ~${entropy} bits (${strength}). A longer password with more character types is harder to crack.`,
        details: [
          { label: 'Length', value: `${length} characters` },
          { label: 'Entropy', value: `~${entropy} bits` },
          { label: 'Strength', value: strength },
        ],
      };
    },
    explanation: 'This generator uses the browser\'s cryptographic random number generator (crypto.getRandomValues) to produce unpredictable passwords. Password strength depends on length and the size of the character set — each additional character or character type exponentially increases the number of possible combinations (entropy).',
    faqs: [
      { question: 'Is this password generator secure?', answer: 'Yes. It uses crypto.getRandomValues, a cryptographically secure random number generator built into browsers. Generated passwords never leave your device.' },
      { question: 'How long should my password be?', answer: 'At least 12–16 characters for most accounts. Each additional character roughly doubles the difficulty of cracking it. Aim for 16+ with mixed character types.' },
      { question: 'What is password entropy?', answer: 'Entropy measures randomness in bits. Higher entropy means more possible combinations and a harder-to-crack password. 60+ bits is strong; 100+ is excellent.' },
    ],
    popular: true,
  });

  registerTool({
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, phone numbers, or any data with instant preview.',
    metaDescription: 'Free QR code generator. Create QR codes for URLs, text, phone numbers, Wi-Fi, and more. Download as PNG instantly.',
    category: 'developer-tools',
    keywords: ['qr code generator', 'qr code', 'create qr code', 'qr code maker'],
    icon: QrCode,
    custom: true,
    fields: [],
    calculate: () => null,
    explanation: 'QR (Quick Response) codes are two-dimensional barcodes that store information readable by smartphone cameras. This generator encodes your text or URL into a QR code using a public chart API and displays it for download.',
    faqs: [
      { question: 'What can I encode in a QR code?', answer: 'You can encode URLs, plain text, phone numbers, email addresses, SMS messages, and Wi-Fi credentials. Any string up to about 2,000 characters works.' },
      { question: 'Can I download the QR code?', answer: 'Yes. Right-click the generated image and save it, or use the download button to save it as an image file.' },
      { question: 'Are the QR codes free to use?', answer: 'Yes. All generated QR codes are free and have no usage restrictions. You can use them for personal or commercial purposes.' },
    ],
    recentlyAdded: true,
  });
}

export function registerTextTools() {
  registerTool({
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and reading time in any text.',
    metaDescription: 'Free word counter. Count words, characters, sentences, paragraphs, and estimated reading time in any text. Perfect for essays, articles, and social media.',
    category: 'text-tools',
    keywords: ['word counter', 'character counter', 'text analyzer', 'word count', 'reading time'],
    icon: TypeIcon,
    fields: [
      { id: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste or type your text here...' },
    ],
    calculate: ({ fields }) => {
      const text = (fields.text as string) || '';
      if (!text.trim()) return null;
      const words = text.trim().split(/\s+/).filter(Boolean);
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
      const readingTime = Math.max(1, Math.round(words.length / 200));
      return {
        title: 'Text Statistics',
        value: `${words.length} words, ${characters} characters`,
        summary: `Estimated reading time: ${readingTime} minute${readingTime > 1 ? 's' : ''}.`,
        details: [
          { label: 'Words', value: `${words.length}` },
          { label: 'Characters', value: `${characters}` },
          { label: 'Characters (no spaces)', value: `${charactersNoSpaces}` },
          { label: 'Sentences', value: `${sentences}` },
          { label: 'Paragraphs', value: `${paragraphs}` },
          { label: 'Reading time', value: `~${readingTime} min` },
        ],
      };
    },
    explanation: 'Words are counted by splitting the text on whitespace. Characters include all characters (with and without spaces). Sentences are split on sentence-ending punctuation. Reading time is estimated at an average reading speed of 200 words per minute.',
    faqs: [
      { question: 'How are words counted?', answer: 'Words are counted by splitting the text on whitespace (spaces, tabs, newlines) and counting non-empty segments. Hyphenated words like "well-known" count as one word.' },
      { question: 'What is the average reading speed?', answer: 'The average adult reads about 200–250 words per minute. This calculator uses 200 wpm for a conservative estimate.' },
      { question: 'Does this work for different languages?', answer: 'Yes, the word counter works for most languages that use whitespace to separate words. For languages like Chinese or Japanese that don\'t use spaces, the character count is more meaningful.' },
    ],
    popular: true,
  });
}
