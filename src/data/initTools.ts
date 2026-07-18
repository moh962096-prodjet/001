import './toolRegistry';
import { registerHealthTools, registerMathTools, registerFinanceTools } from './tools/healthFinanceMath';
import { registerConverterTools, registerDeveloperTools, registerTextTools } from './tools/convertersDevText';
import { registerPdfImageTools } from './tools/pdfImage';
import { registerHealthTools2 } from './tools/healthTools2';
import { registerPregnancyTools } from './tools/pregnancyTools';
import { registerDateTimeTools } from './tools/dateTimeTools';
import { registerEverydayTools2 } from './tools/everydayTools2';
import { registerMathTools2 } from './tools/mathTools2';
import { registerFinanceTools2 } from './tools/financeTools2';
import { registerFinanceTools3 } from './tools/financeTools3';
import { registerMathTools3 } from './tools/mathTools3';

let initialized = false;

export function initTools() {
  if (initialized) return;
  initialized = true;
  registerHealthTools();
  registerMathTools();
  registerFinanceTools();
  registerConverterTools();
  registerDeveloperTools();
  registerTextTools();
  registerPdfImageTools();
  registerHealthTools2();
  registerPregnancyTools();
  registerDateTimeTools();
  registerEverydayTools2();
  registerMathTools2();
  registerFinanceTools2();
  registerFinanceTools3();
  registerMathTools3();
}

// Initialize immediately on import
initTools();
