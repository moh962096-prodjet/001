import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { CalendarDays, Clock } from 'lucide-react';

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function registerDateTimeTools() {
  registerTool({
    slug: 'date-calculator',
    title: 'Date Calculator',
    description: 'Add or subtract days from a date, or calculate the duration between two dates.',
    metaDescription: 'Free date calculator. Add or subtract days, weeks, months from any date, or calculate the number of days between two dates.',
    category: 'time-date-tools',
    keywords: ['date calculator', 'add days to date', 'date difference', 'days between dates', 'date math'],
    icon: CalendarDays,
    fields: [
      { id: 'mode', label: 'Calculation Mode', type: 'select', options: [
        { value: 'add', label: 'Add/subtract from a date' },
        { value: 'diff', label: 'Difference between two dates' },
      ], defaultValue: 'add' },
      { id: 'date1', label: 'Start Date', type: 'date' },
      { id: 'date2', label: 'End Date', type: 'date', hint: 'Only for difference mode' },
      { id: 'offset', label: 'Days to Add/Subtract', type: 'number', placeholder: '30', hint: 'Use negative to subtract' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;

      if (mode === 'diff') {
        const d1 = parseDate(fields.date1 as string);
        const d2 = parseDate(fields.date2 as string);
        if (!d1 || !d2) return null;
        const diffMs = d2.getTime() - d1.getTime();
        const diffDays = Math.floor(diffMs / 86400000);
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        const diffYears = d2.getFullYear() - d1.getFullYear();
        return {
          title: 'Date Difference',
          value: `${formatNumber(Math.abs(diffDays), 0)} days`,
          summary: `From ${d1.toLocaleDateString()} to ${d2.toLocaleDateString()} is ${formatNumber(Math.abs(diffDays), 0)} days.`,
          details: [
            { label: 'In days', value: `${formatNumber(Math.abs(diffDays), 0)} days` },
            { label: 'In weeks', value: `${formatNumber(Math.abs(diffWeeks), 0)} weeks` },
            { label: 'In months (approx.)', value: `${formatNumber(Math.abs(diffMonths), 0)} months` },
            { label: 'In years (approx.)', value: `${formatNumber(Math.abs(diffYears), 1)} years` },
          ],
        };
      }

      const d1 = parseDate(fields.date1 as string);
      const offset = parseFloat(fields.offset as string);
      if (!d1 || isNaN(offset)) return null;
      const result = new Date(d1);
      result.setDate(result.getDate() + offset);
      const dayName = result.toLocaleDateString('en-US', { weekday: 'long' });
      return {
        title: 'Result Date',
        value: result.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        summary: `${offset > 0 ? '+' : ''}${formatNumber(offset, 0)} days from ${d1.toLocaleDateString()} is ${result.toLocaleDateString()} (${dayName}).`,
        details: [
          { label: 'Start date', value: d1.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) },
          { label: 'Result date', value: result.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
          { label: 'Days added', value: `${offset > 0 ? '+' : ''}${formatNumber(offset, 0)}` },
        ],
      };
    },
    explanation: 'In "add/subtract" mode, the calculator moves a date forward or backward by a given number of days, accounting for month lengths and leap years. In "difference" mode, it calculates the exact number of days between two dates and converts to weeks, months, and years for context. These calculations use real calendar arithmetic.',
    faqs: [
      { question: 'Does this account for leap years?', answer: 'Yes. The calculator uses JavaScript Date objects, which correctly handle leap years and varying month lengths.' },
      { question: 'Can I subtract days by entering a negative number?', answer: 'Yes. Enter a negative number in the "Days to Add/Subtract" field to move backward in time.' },
      { question: 'How are months calculated in the difference?', answer: 'Months are calculated as the difference in calendar months between the two dates. This is an approximation since months have varying lengths.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'time-calculator',
    title: 'Time Calculator',
    description: 'Add or subtract hours and minutes, or find the duration between two times.',
    metaDescription: 'Free time calculator. Add or subtract hours and minutes, or calculate the duration between two times. Perfect for time tracking and scheduling.',
    category: 'time-date-tools',
    keywords: ['time calculator', 'add time', 'time duration', 'hours and minutes', 'time difference'],
    icon: Clock,
    fields: [
      { id: 'mode', label: 'Calculation Mode', type: 'select', options: [
        { value: 'add', label: 'Add or subtract times' },
        { value: 'diff', label: 'Duration between two times' },
      ], defaultValue: 'add' },
      { id: 'time1', label: 'Time 1 (HH:MM)', type: 'text', placeholder: '08:30' },
      { id: 'time2', label: 'Time 2 (HH:MM)', type: 'text', placeholder: '14:45' },
      { id: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'add', label: 'Add' },
        { value: 'subtract', label: 'Subtract' },
      ], defaultValue: 'add', hint: 'Only for add/subtract mode' },
    ],
    calculate: ({ fields }) => {
      const mode = fields.mode as string;
      const t1 = parseTime(fields.time1 as string);
      const t2 = parseTime(fields.time2 as string);
      if (t1 === null || t2 === null) return null;

      if (mode === 'diff') {
        let diff = t2 - t1;
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return {
          title: 'Time Duration',
          value: `${hours}h ${mins}m`,
          summary: `The duration from ${fields.time1} to ${fields.time2} is ${hours} hours and ${mins} minutes.`,
          details: [
            { label: 'In hours:minutes', value: `${hours}h ${mins}m` },
            { label: 'In total minutes', value: `${formatNumber(diff, 0)} min` },
            { label: 'In total hours', value: `${formatNumber(diff / 60, 2)} h` },
          ],
        };
      }

      const op = fields.operation as string;
      let total: number;
      if (op === 'add') total = t1 + t2;
      else total = t1 - t2;

      total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
      const hours = Math.floor(total / 60);
      const mins = total % 60;
      return {
        title: 'Result Time',
        value: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
        summary: `${op === 'add' ? 'Adding' : 'Subtracting'} ${fields.time2} ${op === 'add' ? 'to' : 'from'} ${fields.time1} gives ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}.`,
        details: [
          { label: 'Result time', value: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}` },
          { label: 'Total minutes', value: `${formatNumber(total, 0)} min` },
          { label: 'Total hours', value: `${formatNumber(total / 60, 2)} h` },
        ],
      };
    },
    explanation: 'Times are parsed as hours and minutes, then converted to total minutes for calculation. In add/subtract mode, the result wraps around 24 hours. In duration mode, the difference is calculated, handling overnight spans by adding 24 hours if the end time is earlier than the start. Results are shown in both HH:MM format and total minutes/hours.',
    faqs: [
      { question: 'What format should I use?', answer: 'Enter times in 24-hour HH:MM format, e.g. 14:30 for 2:30 PM. The calculator handles both 24-hour and simple hour:minute notation.' },
      { question: 'What happens if the result exceeds 24 hours?', answer: 'The result wraps around modulo 24 hours, since this calculator works with clock times rather than durations. For multi-day durations, use the Date Calculator.' },
      { question: 'How is overnight duration handled?', answer: 'If the end time is earlier than the start time, the calculator assumes the end time is on the following day and adds 24 hours to the difference.' },
    ],
    recentlyAdded: true,
  });
}

function parseTime(s: string): number | null {
  if (!s) return null;
  const parts = s.trim().split(':');
  if (parts.length !== 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
