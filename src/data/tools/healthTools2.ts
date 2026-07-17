import { registerTool } from '../toolRegistry';
import { formatNumber } from '../../utils/format';
import { Activity, Flame, Zap, Apple, Scale, Droplet } from 'lucide-react';

export function registerHealthTools2() {
  registerTool({
    slug: 'body-fat-calculator',
    title: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using the U.S. Navy circumference method.',
    metaDescription: 'Free body fat calculator. Estimate your body fat percentage using the U.S. Navy method with waist, neck, and hip measurements.',
    category: 'health-calculators',
    keywords: ['body fat calculator', 'body fat percentage', 'navy body fat', 'fat percentage'],
    icon: Activity,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175', min: 0 },
      { id: 'neck', label: 'Neck circumference (cm)', type: 'number', placeholder: '38', min: 0 },
      { id: 'waist', label: 'Waist circumference (cm)', type: 'number', placeholder: '85', min: 0 },
      { id: 'hip', label: 'Hip circumference (cm)', type: 'number', placeholder: '95', min: 0, hint: 'Required for females' },
    ],
    calculate: ({ fields }) => {
      const gender = fields.gender as string;
      const height = parseFloat(fields.height as string);
      const neck = parseFloat(fields.neck as string);
      const waist = parseFloat(fields.waist as string);
      const hip = parseFloat(fields.hip as string);
      if (!height || !neck || !waist) return null;
      if (gender === 'female' && !hip) return null;

      let bf: number;
      if (gender === 'male') {
        if (waist <= neck) return null;
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        if (waist + hip <= neck) return null;
        bf = 495 / (1.29579 - 0.35001 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      }
      if (!isFinite(bf) || bf <= 0 || bf > 60) return null;

      let category: string;
      if (gender === 'male') {
        if (bf < 6) category = 'Essential fat';
        else if (bf < 14) category = 'Athletic';
        else if (bf < 18) category = 'Fitness';
        else if (bf < 25) category = 'Average';
        else category = 'Obese';
      } else {
        if (bf < 14) category = 'Essential fat';
        else if (bf < 21) category = 'Athletic';
        else if (bf < 25) category = 'Fitness';
        else if (bf < 32) category = 'Average';
        else category = 'Obese';
      }

      const fatMass = (bf / 100) * 70;
      const leanMass = 70 - fatMass;

      return {
        title: 'Body Fat Percentage',
        value: `${bf.toFixed(1)}% — ${category}`,
        summary: `Estimated body fat is ${bf.toFixed(1)}%, placing you in the "${category}" category.`,
        details: [
          { label: 'Body fat', value: `${bf.toFixed(1)}%` },
          { label: 'Category', value: category },
          { label: 'Estimated fat mass (70 kg)', value: `${formatNumber(fatMass, 1)} kg` },
          { label: 'Estimated lean mass (70 kg)', value: `${formatNumber(leanMass, 1)} kg` },
        ],
      };
    },
    explanation: 'This calculator uses the U.S. Navy circumference method, which estimates body fat percentage from waist, neck, and (for females) hip measurements along with height. The formula derives body density and converts it to a fat percentage using the Siri equation. It is a practical estimation method that requires only a measuring tape.',
    faqs: [
      { question: 'How accurate is the Navy body fat method?', answer: 'The Navy method provides a reasonable estimate (typically within 3–4% of clinical methods like DEXA). It is most accurate when measurements are taken consistently at the same anatomical points.' },
      { question: 'How do I measure neck and waist circumference?', answer: 'Measure the neck just below the larynx, and the waist at the navel (horizontally, after exhaling). For females, measure the hip at the widest point.' },
      { question: 'What is a healthy body fat range?', answer: 'For men, 10–20% is generally healthy. For women, 18–28% is typical. Athletes may carry less, and essential minimums are about 2–5% for men and 10–13% for women.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'bmr-calculator',
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate — the calories your body burns at complete rest.',
    metaDescription: 'Free BMR calculator. Calculate your Basal Metabolic Rate using the Mifflin-St Jeor equation to find how many calories your body burns at rest.',
    category: 'health-calculators',
    keywords: ['bmr calculator', 'basal metabolic rate', 'calories at rest', 'metabolism'],
    icon: Flame,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'age', label: 'Age', type: 'number', placeholder: '30', min: 1, max: 120 },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175', min: 0 },
      { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75', min: 0 },
    ],
    calculate: ({ fields }) => {
      const gender = fields.gender as string;
      const age = parseFloat(fields.age as string);
      const height = parseFloat(fields.height as string);
      const weight = parseFloat(fields.weight as string);
      if (!age || !height || !weight) return null;
      let bmr: number;
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      return {
        title: 'Your BMR',
        value: `${formatNumber(bmr, 0)} kcal/day`,
        summary: `Your body burns approximately ${formatNumber(bmr, 0)} calories per day at complete rest to maintain vital functions.`,
        details: [
          { label: 'BMR', value: `${formatNumber(bmr, 0)} kcal/day` },
          { label: 'Sedentary (×1.2)', value: `${formatNumber(bmr * 1.2, 0)} kcal/day` },
          { label: 'Lightly active (×1.375)', value: `${formatNumber(bmr * 1.375, 0)} kcal/day` },
          { label: 'Moderately active (×1.55)', value: `${formatNumber(bmr * 1.55, 0)} kcal/day` },
        ],
      };
    },
    explanation: 'BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic physiological functions — breathing, circulation, cell production — at complete rest. This calculator uses the Mifflin-St Jeor equation, widely considered the most accurate formula for estimating BMR. Your actual energy expenditure increases with physical activity.',
    faqs: [
      { question: 'What is a good BMR?', answer: 'There is no single "good" BMR — it depends on age, gender, height, and weight. A typical adult BMR ranges from 1,200 to 2,400 kcal/day. More muscle mass generally means a higher BMR.' },
      { question: 'Which equation does this calculator use?', answer: 'It uses the Mifflin-St Jeor equation, which is considered more accurate than the older Harris-Benedict formula for modern populations.' },
      { question: 'How is BMR different from TDEE?', answer: 'BMR is calories burned at complete rest. TDEE (Total Daily Energy Expenditure) multiplies BMR by an activity factor to estimate total calories burned including all daily activity.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'tdee-calculator',
    title: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure based on BMR and activity level.',
    metaDescription: 'Free TDEE calculator. Calculate your Total Daily Energy Expenditure from BMR and activity level to find how many calories you burn each day.',
    category: 'health-calculators',
    keywords: ['tdee calculator', 'total daily energy expenditure', 'daily calories burned', 'maintenance calories'],
    icon: Zap,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'age', label: 'Age', type: 'number', placeholder: '30', min: 1, max: 120 },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175', min: 0 },
      { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75', min: 0 },
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
      if (gender === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      else bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      const tdee = bmr * activity;
      return {
        title: 'Your TDEE',
        value: `${formatNumber(tdee, 0)} kcal/day`,
        summary: `You burn approximately ${formatNumber(tdee, 0)} calories per day. Eat this amount to maintain your current weight.`,
        details: [
          { label: 'BMR', value: `${formatNumber(bmr, 0)} kcal/day` },
          { label: 'TDEE (maintenance)', value: `${formatNumber(tdee, 0)} kcal/day` },
          { label: 'Mild weight loss (−250)', value: `${formatNumber(tdee - 250, 0)} kcal/day` },
          { label: 'Weight loss (−500)', value: `${formatNumber(tdee - 500, 0)} kcal/day` },
          { label: 'Weight gain (+500)', value: `${formatNumber(tdee + 500, 0)} kcal/day` },
        ],
      };
    },
    explanation: 'TDEE (Total Daily Energy Expenditure) is the total number of calories you burn each day, combining your BMR with physical activity. It is calculated by multiplying your BMR by an activity factor. Eating below your TDEE leads to weight loss; eating above it leads to weight gain. This is the foundation of energy balance for weight management.',
    faqs: [
      { question: 'What activity level should I choose?', answer: 'Sedentary: desk job, no exercise. Lightly active: light exercise 1–3 days/week. Moderately active: exercise 3–5 days/week. Very active: hard exercise 6–7 days/week. Extra active: physical job or training twice/day.' },
      { question: 'How accurate is TDEE?', answer: 'TDEE is an estimate based on population averages. Individual variation in metabolism can be ±10–15%. Track your actual weight trend over 2–3 weeks and adjust accordingly.' },
      { question: 'Can I use TDEE to lose weight?', answer: 'Yes. Eating 250–500 calories below your TDEE typically results in 0.25–0.5 kg of weight loss per week. Always consult a healthcare professional before starting a diet.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'macro-calculator',
    title: 'Macro Calculator',
    description: 'Calculate your daily macronutrient needs (protein, carbs, fat) based on your goals.',
    metaDescription: 'Free macro calculator. Calculate your daily protein, carbohydrate, and fat targets based on your TDEE and fitness goals.',
    category: 'health-calculators',
    keywords: ['macro calculator', 'macronutrients', 'protein carbs fat', 'iifym', 'flexible dieting'],
    icon: Apple,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'age', label: 'Age', type: 'number', placeholder: '30', min: 1, max: 120 },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175', min: 0 },
      { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75', min: 0 },
      { id: 'activity', label: 'Activity Level', type: 'select', options: [
        { value: '1.2', label: 'Sedentary' },
        { value: '1.375', label: 'Lightly active' },
        { value: '1.55', label: 'Moderately active' },
        { value: '1.725', label: 'Very active' },
        { value: '1.9', label: 'Extra active' },
      ], defaultValue: '1.55' },
      { id: 'goal', label: 'Goal', type: 'select', options: [
        { value: 'lose', label: 'Lose weight (−20%)' },
        { value: 'maintain', label: 'Maintain weight' },
        { value: 'gain', label: 'Gain weight (+15%)' },
      ], defaultValue: 'maintain' },
      { id: 'ratio', label: 'Macro Split', type: 'select', options: [
        { value: 'balanced', label: 'Balanced (30P / 40C / 30F)' },
        { value: 'lowcarb', label: 'Low carb (40P / 20C / 40F)' },
        { value: 'highprotein', label: 'High protein (40P / 35C / 25F)' },
      ], defaultValue: 'balanced' },
    ],
    calculate: ({ fields }) => {
      const gender = fields.gender as string;
      const age = parseFloat(fields.age as string);
      const height = parseFloat(fields.height as string);
      const weight = parseFloat(fields.weight as string);
      const activity = parseFloat(fields.activity as string);
      const goal = fields.goal as string;
      const ratio = fields.ratio as string;
      if (!age || !height || !weight) return null;
      let bmr: number;
      if (gender === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      else bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      let tdee = bmr * activity;
      if (goal === 'lose') tdee *= 0.8;
      else if (goal === 'gain') tdee *= 1.15;

      let pPct: number, cPct: number, fPct: number;
      if (ratio === 'lowcarb') { pPct = 0.4; cPct = 0.2; fPct = 0.4; }
      else if (ratio === 'highprotein') { pPct = 0.4; cPct = 0.35; fPct = 0.25; }
      else { pPct = 0.3; cPct = 0.4; fPct = 0.3; }

      const proteinG = Math.round((tdee * pPct) / 4);
      const carbG = Math.round((tdee * cPct) / 4);
      const fatG = Math.round((tdee * fPct) / 9);

      return {
        title: 'Your Daily Macros',
        value: `${formatNumber(tdee, 0)} kcal/day`,
        summary: `Target ${proteinG}g protein, ${carbG}g carbs, ${fatG}g fat per day.`,
        details: [
          { label: 'Daily calories', value: `${formatNumber(tdee, 0)} kcal` },
          { label: 'Protein', value: `${proteinG}g (${Math.round(pPct * 100)}%)` },
          { label: 'Carbohydrates', value: `${carbG}g (${Math.round(cPct * 100)}%)` },
          { label: 'Fat', value: `${fatG}g (${Math.round(fPct * 100)}%)` },
        ],
      };
    },
    explanation: 'Macronutrients (macros) are the nutrients your body needs in large amounts: protein, carbohydrates, and fat. Each gram of protein and carbohydrate provides 4 calories, while each gram of fat provides 9 calories. This calculator first determines your TDEE based on your goal, then splits it into macro targets using your chosen ratio. Protein supports muscle, carbs provide energy, and fat supports hormones and nutrient absorption.',
    faqs: [
      { question: 'What macro split should I choose?', answer: 'A balanced split (30/40/30) works well for most people. Low carb (40/20/40) suits those reducing carbs. High protein (40/35/25) is ideal for building or preserving muscle.' },
      { question: 'How much protein do I need?', answer: 'Most adults need 1.6–2.2g of protein per kg of body weight. Endurance athletes need 1.2–1.4g/kg, and strength athletes need 1.6–2.2g/kg.' },
      { question: 'Can I use macros for weight loss?', answer: 'Yes. The "Lose weight" goal creates a 20% calorie deficit while maintaining balanced macros. Track your intake and adjust based on your actual progress.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'ideal-weight-calculator',
    title: 'Ideal Weight Calculator',
    description: 'Find your ideal body weight using multiple formulas (Devine, Robinson, Miller, Hamwi).',
    metaDescription: 'Free ideal weight calculator. Find your ideal body weight using Devine, Robinson, Miller, and Hamwi formulas based on height and gender.',
    category: 'health-calculators',
    keywords: ['ideal weight calculator', 'ideal body weight', 'devine formula', 'healthy weight range'],
    icon: Scale,
    fields: [
      { id: 'gender', label: 'Gender', type: 'select', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }], defaultValue: 'male' },
      { id: 'height', label: 'Height (cm)', type: 'number', placeholder: '175', min: 0 },
    ],
    calculate: ({ fields }) => {
      const gender = fields.gender as string;
      const heightCm = parseFloat(fields.height as string);
      if (!heightCm) return null;
      const heightIn = heightCm / 2.54;
      const over60 = Math.max(0, heightIn - 60);

      let devine: number, robinson: number, miller: number, hamwi: number;
      if (gender === 'male') {
        devine = 50 + 2.3 * over60;
        robinson = 52 + 1.7 * over60;
        miller = 56.2 + 1.41 * over60;
        hamwi = 48 + 2.7 * over60;
      } else {
        devine = 45.5 + 2.3 * over60;
        robinson = 49 + 1.7 * over60;
        miller = 53.1 + 1.36 * over60;
        hamwi = 45.5 + 2.2 * over60;
      }

      const bmiLow = 18.5 * Math.pow(heightCm / 100, 2);
      const bmiHigh = 24.9 * Math.pow(heightCm / 100, 2);

      return {
        title: 'Your Ideal Weight',
        value: `${formatNumber(devine, 1)} kg (Devine formula)`,
        summary: `Based on your height, your ideal weight is approximately ${formatNumber(devine, 1)} kg. A healthy BMI range gives ${formatNumber(bmiLow, 1)}–${formatNumber(bmiHigh, 1)} kg.`,
        details: [
          { label: 'Devine', value: `${formatNumber(devine, 1)} kg` },
          { label: 'Robinson', value: `${formatNumber(robinson, 1)} kg` },
          { label: 'Miller', value: `${formatNumber(miller, 1)} kg` },
          { label: 'Hamwi', value: `${formatNumber(hamwi, 1)} kg` },
          { label: 'Healthy BMI range', value: `${formatNumber(bmiLow, 1)}–${formatNumber(bmiHigh, 1)} kg` },
        ],
      };
    },
    explanation: 'Ideal body weight (IBW) was originally developed for drug dosing calculations. Several formulas exist: Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964). Each estimates ideal weight from height and gender. The healthy BMI range (18.5–24.9) provides a broader target. No single formula is perfect — use these as general references, not strict targets.',
    faqs: [
      { question: 'Which ideal weight formula is most accurate?', answer: 'The Devine formula is the most widely used. However, all formulas are estimates and may not account for muscle mass or frame size. The BMI range is a useful complement.' },
      { question: 'Why do the formulas give different results?', answer: 'Each formula was developed using different populations and methodologies. The variation between them (typically 2–5 kg) shows the inherent uncertainty in defining "ideal" weight.' },
      { question: 'Should I aim for my ideal weight?', answer: 'Use it as a general reference, not a strict goal. A healthy weight depends on body composition, lifestyle, and genetics. Consult a healthcare professional for personalized guidance.' },
    ],
    recentlyAdded: true,
  });

  registerTool({
    slug: 'water-intake-calculator',
    title: 'Water Intake Calculator',
    description: 'Calculate your recommended daily water intake based on weight and activity level.',
    metaDescription: 'Free water intake calculator. Find how much water you should drink daily based on your body weight and activity level.',
    category: 'health-calculators',
    keywords: ['water intake calculator', 'daily water requirement', 'hydration calculator', 'how much water to drink'],
    icon: Droplet,
    fields: [
      { id: 'weight', label: 'Body Weight (kg)', type: 'number', placeholder: '75', min: 0 },
      { id: 'activity', label: 'Daily Exercise (minutes)', type: 'number', placeholder: '30', min: 0, defaultValue: '0' },
    ],
    calculate: ({ fields }) => {
      const weight = parseFloat(fields.weight as string);
      const exercise = parseFloat(fields.activity as string) || 0;
      if (!weight) return null;
      const baseMl = weight * 35;
      const exerciseMl = exercise * 12;
      const totalMl = baseMl + exerciseMl;
      const totalL = totalMl / 1000;
      const cups = Math.round(totalMl / 250);
      const oz = Math.round(totalMl / 29.574);
      return {
        title: 'Daily Water Intake',
        value: `${formatNumber(totalL, 2)} liters/day`,
        summary: `You should aim to drink approximately ${formatNumber(totalL, 2)} liters (${cups} cups or ${oz} oz) of water per day.`,
        details: [
          { label: 'In liters', value: `${formatNumber(totalL, 2)} L` },
          { label: 'In milliliters', value: `${formatNumber(totalMl, 0)} ml` },
          { label: 'In cups (250ml)', value: `${cups} cups` },
          { label: 'In ounces', value: `${oz} oz` },
        ],
      };
    },
    explanation: 'A common guideline is to drink 35 ml of water per kg of body weight per day. Additional water is needed for exercise — approximately 12 ml per minute of activity. This covers basic hydration needs, but actual requirements vary with climate, diet, pregnancy, and individual factors. Foods also contribute to your total water intake.',
    faqs: [
      { question: 'Does coffee or tea count toward water intake?', answer: 'Yes. While caffeine has a mild diuretic effect, the water in coffee, tea, and other beverages still contributes to your daily hydration. Food also provides about 20% of daily water intake.' },
      { question: 'Can I drink too much water?', answer: 'Yes. Excessive water intake can lead to hyponatremia (low sodium). It is best to drink when thirsty and not force large amounts beyond your needs. Spread intake throughout the day.' },
      { question: 'Should I drink more in hot weather?', answer: 'Yes. Hot weather and sweating increase water loss. Add 500ml or more per hour of outdoor activity in heat. Monitor urine color — pale yellow indicates good hydration.' },
    ],
    recentlyAdded: true,
  });
}
