import type { ComponentType } from 'react';
import {
  HeartPulse,
  Wallet,
  Calculator,
  Ruler,
  Clock,
  FileText,
  Image,
  Type,
  Code2,
  CalendarDays,
} from 'lucide-react';

export type CategoryId =
  | 'health-calculators'
  | 'finance-calculators'
  | 'math-calculators'
  | 'unit-converters'
  | 'time-date-tools'
  | 'pdf-tools'
  | 'image-tools'
  | 'text-tools'
  | 'developer-tools'
  | 'everyday-calculators';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export const categories: Category[] = [
  { id: 'health-calculators', name: 'Health Calculators', description: 'BMI, calorie, age and other wellness calculators.', icon: HeartPulse },
  { id: 'finance-calculators', name: 'Finance Calculators', description: 'Loans, mortgages, EMI and money tools.', icon: Wallet },
  { id: 'math-calculators', name: 'Math Calculators', description: 'Percentages, ratios and everyday math.', icon: Calculator },
  { id: 'unit-converters', name: 'Unit Converters', description: 'Length, weight, temperature and more.', icon: Ruler },
  { id: 'time-date-tools', name: 'Time & Date Tools', description: 'Dates, durations and time utilities.', icon: Clock },
  { id: 'pdf-tools', name: 'PDF Tools', description: 'Merge, convert and manage PDF files.', icon: FileText },
  { id: 'image-tools', name: 'Image Tools', description: 'Compress, convert and handle images.', icon: Image },
  { id: 'text-tools', name: 'Text Tools', description: 'Count words, format and analyze text.', icon: Type },
  { id: 'developer-tools', name: 'Developer Tools', description: 'Passwords, QR codes and code utilities.', icon: Code2 },
  { id: 'everyday-calculators', name: 'Everyday Calculators', description: 'Quick helpers for daily tasks.', icon: CalendarDays },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
);
