import { Calculator, DollarSign, SquarePi, Ruler, Clock, FileText, Image, Type, Code, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { slug: 'health-calculators', name: 'Health Calculators', description: 'BMI, calorie, body fat, and wellness calculators.', icon: Calculator },
  { slug: 'finance-calculators', name: 'Finance Calculators', description: 'Loan, mortgage, investment, and tax calculators.', icon: DollarSign },
  { slug: 'math-calculators', name: 'Math Calculators', description: 'Scientific, statistics, and algebra calculators.', icon: SquarePi },
  { slug: 'unit-converters', name: 'Unit Converters', description: 'Convert length, weight, temperature, and more.', icon: Ruler },
  { slug: 'time-date-tools', name: 'Time & Date Tools', description: 'Date, time, and age calculators.', icon: Clock },
  { slug: 'pdf-tools', name: 'PDF Tools', description: 'Merge, split, and extract PDF pages.', icon: FileText },
  { slug: 'image-tools', name: 'Image Tools', description: 'Resize, crop, and convert images.', icon: Image },
  { slug: 'text-tools', name: 'Text Tools', description: 'Count, format, sort, and transform text.', icon: Type },
  { slug: 'developer-tools', name: 'Developer Tools', description: 'Encoders, formatters, minifiers, and generators.', icon: Code },
  { slug: 'everyday-calculators', name: 'Everyday Calculators', description: 'Tip, percentage, and daily-use calculators.', icon: Wrench },
];

export const categoryMap: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
);
