import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { GraduationCap, ClipboardList } from 'lucide-react';

export function registerEverydayTools2() {
  registerTool({
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    description: 'Calculate your Grade Point Average (GPA) on a 4.0 scale from your course grades and credits.',
    metaDescription: 'Free GPA calculator. Calculate your Grade Point Average on a 4.0 scale from course grades and credit hours. Supports multiple grading systems.',
    category: 'everyday-calculators',
    keywords: ['gpa calculator', 'grade point average', 'college gpa', 'academic gpa', 'gpa 4.0 scale'],
    icon: GraduationCap,
    fields: [
      { id: 'courses', label: 'Number of Courses', type: 'number', placeholder: '5', min: 1, max: 20, defaultValue: '5' },
      { id: 'data', label: 'Course Data (one per line: grade,credits)', type: 'textarea', placeholder: 'A,3\nB+,4\nA-,3\nC,2\nB,3', hint: 'Format: letter grade,credit hours — one course per line' },
    ],
    calculate: ({ fields }) => {
      const data = (fields.data as string) || '';
      if (!data.trim()) return null;
      const gradePoints: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0,
      };
      const lines = data.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      let totalPoints = 0;
      let totalCredits = 0;
      const courseResults: string[] = [];

      for (const line of lines) {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 2) continue;
        const grade = parts[0].toUpperCase();
        const credits = parseFloat(parts[1]);
        const gp = gradePoints[grade];
        if (gp === undefined || isNaN(credits)) continue;
        totalPoints += gp * credits;
        totalCredits += credits;
        courseResults.push(`${grade} (${credits}cr) = ${gp * credits} pts`);
      }

      if (totalCredits === 0) return null;
      const gpa = totalPoints / totalCredits;
      let honors = '';
      if (gpa >= 3.9) honors = 'Summa Cum Laude';
      else if (gpa >= 3.7) honors = 'Magna Cum Laude';
      else if (gpa >= 3.5) honors = 'Cum Laude';
      else if (gpa >= 3.0) honors = 'Good Standing';
      else if (gpa >= 2.0) honors = 'Passing';
      else honors = 'Academic Probation';

      return {
        title: 'Your GPA',
        value: `${gpa.toFixed(2)} / 4.0`,
        summary: `Your GPA is ${gpa.toFixed(2)} on a 4.0 scale across ${formatNumber(totalCredits, 0)} credit hours. ${honors ? `Status: ${honors}.` : ''}`,
        details: [
          { label: 'GPA', value: `${gpa.toFixed(2)} / 4.0` },
          { label: 'Total credits', value: `${formatNumber(totalCredits, 0)}` },
          { label: 'Total grade points', value: `${formatNumber(totalPoints, 1)}` },
          { label: 'Academic standing', value: honors },
        ],
      };
    },
    explanation: 'GPA (Grade Point Average) is calculated by multiplying each course\'s grade point value by its credit hours, summing these products, and dividing by the total credit hours. This calculator uses the standard 4.0 scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0, with plus/minus adjustments. Courses with more credit hours have a greater impact on your GPA.',
    faqs: [
      { question: 'What grading scale does this use?', answer: 'It uses the standard 4.0 scale with plus/minus grades: A=4.0, A-=3.7, B+=3.3, B=3.0, and so on down to F=0.0.' },
      { question: 'How do I enter my courses?', answer: 'Enter one course per line in the format "grade,credits" — for example "A,3" for an A in a 3-credit course. Separate courses with line breaks.' },
      { question: 'What is a good GPA?', answer: 'A 3.0 (B average) is generally considered good. A 3.5+ is very good, and 3.7+ may qualify for Latin honors (Magna Cum Laude). Requirements vary by institution.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'grade-calculator',
    title: 'Grade Calculator',
    description: 'Calculate your final grade from weighted assignments, exams, and coursework.',
    metaDescription: 'Free grade calculator. Calculate your final grade from weighted assignments, exams, and coursework. Supports custom weight percentages.',
    category: 'everyday-calculators',
    keywords: ['grade calculator', 'final grade', 'weighted grade', 'class grade', 'test grade'],
    icon: ClipboardList,
    fields: [
      { id: 'data', label: 'Assignments (one per line: name,score,total,weight)', type: 'textarea', placeholder: 'Homework,45,50,20\nMidterm,85,100,30\nFinal,90,100,50', hint: 'Format: name,earned,max,weight% — one per line' },
    ],
    calculate: ({ fields }) => {
      const data = (fields.data as string) || '';
      if (!data.trim()) return null;
      const lines = data.trim().split('\n').map((l) => l.trim()).filter(Boolean);
      let weightedSum = 0;
      let totalWeight = 0;

      for (const line of lines) {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 4) continue;
        const earned = parseFloat(parts[1]);
        const max = parseFloat(parts[2]);
        const weight = parseFloat(parts[3]);
        if (isNaN(earned) || isNaN(max) || isNaN(weight) || max === 0) continue;
        const pct = (earned / max) * 100;
        weightedSum += pct * weight;
        totalWeight += weight;
      }

      if (totalWeight === 0) return null;
      const finalGrade = weightedSum / totalWeight;
      let letter = 'F';
      if (finalGrade >= 93) letter = 'A';
      else if (finalGrade >= 90) letter = 'A-';
      else if (finalGrade >= 87) letter = 'B+';
      else if (finalGrade >= 83) letter = 'B';
      else if (finalGrade >= 80) letter = 'B-';
      else if (finalGrade >= 77) letter = 'C+';
      else if (finalGrade >= 73) letter = 'C';
      else if (finalGrade >= 70) letter = 'C-';
      else if (finalGrade >= 67) letter = 'D+';
      else if (finalGrade >= 60) letter = 'D';

      return {
        title: 'Your Final Grade',
        value: `${finalGrade.toFixed(1)}% (${letter})`,
        summary: `Your weighted final grade is ${finalGrade.toFixed(1)}%, which is a ${letter}.`,
        details: [
          { label: 'Final grade', value: `${finalGrade.toFixed(1)}%` },
          { label: 'Letter grade', value: letter },
          { label: 'Total weight', value: `${formatNumber(totalWeight, 0)}%` },
        ],
      };
    },
    explanation: 'Your final grade is calculated by weighting each assignment\'s percentage score by its weight percentage. Each assignment score is converted to a percentage (earned/max), multiplied by its weight, and the weighted scores are summed and divided by the total weight. The letter grade is assigned based on the standard 10-point scale.',
    faqs: [
      { question: 'How do I enter my assignments?', answer: 'Enter one assignment per line in the format "name,earned,max,weight". For example, "Midterm,85,100,30" means you scored 85 out of 100 and it is worth 30% of your grade.' },
      { question: 'What if my weights don\'t add up to 100?', answer: 'The calculator normalizes by total weight, so it works even if weights sum to less or more than 100. However, for accurate results, weights should ideally sum to 100.' },
      { question: 'What grading scale is used?', answer: 'It uses the standard 10-point scale: A=93+, A-=90+, B+=87+, B=83+, B-=80+, C+=77+, C=73+, C-=70+, D+=67+, D=60+, F=below 60.' },
    ],
    recentlyAdded: true,
  });
}
