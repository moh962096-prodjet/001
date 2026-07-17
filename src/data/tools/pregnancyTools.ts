import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { Baby, CalendarClock, Flower2 } from 'lucide-react';

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function registerPregnancyTools() {
  registerTool({
    slug: 'pregnancy-calculator',
    title: 'Pregnancy Calculator',
    description: 'Track your pregnancy progress — find your current week, trimester, and key milestones.',
    metaDescription: 'Free pregnancy calculator. Track your pregnancy week-by-week, find your trimester, due date, and key milestones from your last period or conception date.',
    category: 'health-calculators',
    keywords: ['pregnancy calculator', 'pregnancy week', 'trimester', 'pregnancy tracker', 'how far along'],
    icon: Baby,
    fields: [
      { id: 'lmp', label: 'First Day of Last Period', type: 'date' },
      { id: 'asOf', label: 'Current Date', type: 'date' },
    ],
    calculate: ({ fields }) => {
      const lmp = fields.lmp as string;
      const asOf = (fields.asOf as string) || new Date().toISOString().slice(0, 10);
      if (!lmp) return null;
      const lmpDate = new Date(lmp);
      const today = new Date(asOf);
      if (lmpDate > today) return { title: 'Pregnancy', value: 'Invalid date', summary: 'Last period date must be before the current date.' };

      const dueDate = addDays(lmp, 280);
      const daysPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
      const weeks = Math.floor(daysPregnant / 7);
      const days = daysPregnant % 7;

      let trimester: string;
      if (weeks < 13) trimester = 'First trimester';
      else if (weeks < 27) trimester = 'Second trimester';
      else trimester = 'Third trimester';

      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);

      return {
        title: 'Pregnancy Progress',
        value: `${weeks} weeks, ${days} days pregnant`,
        summary: `You are in your ${trimester}. Estimated due date is ${formatDate(dueDate)}.`,
        details: [
          { label: 'Current week', value: `${weeks} weeks, ${days} days` },
          { label: 'Trimester', value: trimester },
          { label: 'Estimated due date', value: formatDate(dueDate) },
          { label: 'Days until due date', value: `${formatNumber(Math.max(0, daysUntilDue), 0)} days` },
        ],
      };
    },
    explanation: 'Pregnancy is typically tracked from the first day of your last menstrual period (LMP), totaling about 40 weeks. The estimated due date is calculated by adding 280 days to the LMP. Pregnancy is divided into three trimesters: first (weeks 1–12), second (weeks 13–26), and third (weeks 27–40). Only about 5% of babies are born on their exact due date — most arrive within two weeks of it.',
    faqs: [
      { question: 'How is the due date calculated?', answer: 'The standard method adds 280 days (40 weeks) to the first day of your last menstrual period. This assumes a 28-day cycle with ovulation on day 14.' },
      { question: 'How accurate is the due date?', answer: 'The LMP-based due date is an estimate. An ultrasound in the first trimester provides a more accurate date. Only about 5% of babies arrive on their exact due date.' },
      { question: 'What are the three trimesters?', answer: 'First trimester: weeks 1–12. Second trimester: weeks 13–26. Third trimester: weeks 27–40. Each marks different developmental milestones for the baby.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'due-date-calculator',
    title: 'Due Date Calculator',
    description: 'Calculate your estimated pregnancy due date from your last period or conception date.',
    metaDescription: 'Free due date calculator. Find your estimated pregnancy due date from your last menstrual period or conception date, plus key milestones.',
    category: 'health-calculators',
    keywords: ['due date calculator', 'pregnancy due date', 'estimated delivery date', 'when is my baby due'],
    icon: CalendarClock,
    fields: [
      { id: 'method', label: 'Calculation Based On', type: 'select', options: [
        { value: 'lmp', label: 'First day of last period' },
        { value: 'conception', label: 'Conception date' },
      ], defaultValue: 'lmp' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'cycleLength', label: 'Cycle Length (days)', type: 'number', placeholder: '28', min: 20, max: 45, defaultValue: '28', hint: 'Only used for LMP method' },
    ],
    calculate: ({ fields }) => {
      const method = fields.method as string;
      const dateStr = fields.date as string;
      const cycleLength = parseInt(fields.cycleLength as string) || 28;
      if (!dateStr) return null;

      let dueDate: Date;
      if (method === 'lmp') {
        const adjustment = (cycleLength - 28);
        dueDate = addDays(dateStr, 280 + adjustment);
      } else {
        dueDate = addDays(dateStr, 266);
      }

      const conceptionDate = method === 'conception' ? new Date(dateStr) : addDays(dateStr, 14);
      const endFirstTrimester = addDays(dateStr, method === 'lmp' ? 84 : 70);
      const endSecondTrimester = addDays(dateStr, method === 'lmp' ? 189 : 175);
      const fullTerm = addDays(dateStr, method === 'lmp' ? 259 : 245);

      return {
        title: 'Estimated Due Date',
        value: formatDate(dueDate),
        summary: `Your estimated due date is ${formatDate(dueDate)}, which is approximately ${formatNumber(Math.ceil((dueDate.getTime() - new Date().getTime()) / 86400000), 0)} days from today.`,
        details: [
          { label: 'Estimated due date', value: formatDate(dueDate) },
          { label: 'Estimated conception', value: formatDate(conceptionDate) },
          { label: 'End of first trimester', value: formatDate(endFirstTrimester) },
          { label: 'End of second trimester', value: formatDate(endSecondTrimester) },
          { label: 'Full term (37 weeks)', value: formatDate(fullTerm) },
        ],
      };
    },
    explanation: 'If based on your last menstrual period (LMP), the due date is calculated by adding 280 days (adjusted for cycle length). If based on conception date, 266 days are added (the typical gestation from conception to birth). The calculator also shows key milestones: end of each trimester and when you reach full term at 37 weeks.',
    faqs: [
      { question: 'Which method is more accurate?', answer: 'The conception date method is more precise if you know it. However, most people use the LMP method since the exact conception date is often unknown. An early ultrasound provides the most accurate dating.' },
      { question: 'Why does cycle length matter?', answer: 'A longer or shorter cycle shifts ovulation. For each day your cycle exceeds 28, ovulation is typically later by one day, so the due date shifts accordingly.' },
      { question: 'What does "full term" mean?', answer: 'Full term is 39–40 weeks. Babies born between 37 and 39 weeks are considered "early term," and those born before 37 weeks are "preterm."' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'ovulation-calculator',
    title: 'Ovulation Calculator',
    description: 'Find your fertile window and predicted ovulation date based on your menstrual cycle.',
    metaDescription: 'Free ovulation calculator. Predict your ovulation date and fertile window based on your menstrual cycle length and last period date.',
    category: 'health-calculators',
    keywords: ['ovulation calculator', 'fertile window', 'ovulation date', 'fertility calculator', 'conception'],
    icon: Flower2,
    fields: [
      { id: 'lmp', label: 'First Day of Last Period', type: 'date' },
      { id: 'cycleLength', label: 'Cycle Length (days)', type: 'number', placeholder: '28', min: 20, max: 45, defaultValue: '28' },
      { id: 'periodLength', label: 'Period Length (days)', type: 'number', placeholder: '5', min: 1, max: 10, defaultValue: '5' },
    ],
    calculate: ({ fields }) => {
      const lmp = fields.lmp as string;
      const cycleLength = parseInt(fields.cycleLength as string) || 28;
      if (!lmp) return null;

      const ovulationDay = cycleLength - 14;
      const ovulationDate = addDays(lmp, ovulationDay);
      const fertileStart = addDays(lmp, ovulationDay - 5);
      const fertileEnd = addDays(lmp, ovulationDay + 1);
      const nextPeriod = addDays(lmp, cycleLength);
      const nextOvulation = addDays(nextPeriod.toISOString().slice(0, 10), cycleLength - 14);

      return {
        title: 'Your Fertile Window',
        value: formatDate(ovulationDate),
        summary: `Your predicted ovulation date is ${formatDate(ovulationDate)}. Your fertile window is ${formatDate(fertileStart)} to ${formatDate(fertileEnd)}.`,
        details: [
          { label: 'Predicted ovulation', value: formatDate(ovulationDate) },
          { label: 'Fertile window', value: `${formatDate(fertileStart)} – ${formatDate(fertileEnd)}` },
          { label: 'Next period (est.)', value: formatDate(nextPeriod) },
          { label: 'Next ovulation (est.)', value: formatDate(nextOvulation) },
        ],
      };
    },
    explanation: 'Ovulation typically occurs 14 days before your next period. In a 28-day cycle, that is day 14. The fertile window spans the 5 days before ovulation plus ovulation day itself, since sperm can survive up to 5 days and the egg lives 12–24 hours. This calculator estimates your ovulation date by subtracting 14 from your cycle length and counting from the first day of your last period.',
    faqs: [
      { question: 'How accurate is the ovulation calculator?', answer: 'It provides an estimate based on the assumption that ovulation occurs 14 days before your next period. Actual ovulation can vary. Tracking basal body temperature and ovulation predictor kits improves accuracy.' },
      { question: 'What is the fertile window?', answer: 'The fertile window is the 6 days leading up to and including ovulation. These are the days when pregnancy is possible because sperm can survive up to 5 days.' },
      { question: 'Can I use this to avoid pregnancy?', answer: 'This calculator is for estimation only and is not reliable as contraception. Many cycles are irregular, and ovulation can shift. Use medically validated methods for birth control.' },
    ],
    recentlyAdded: true,
  });
}
