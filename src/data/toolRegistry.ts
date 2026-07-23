import type { LucideIcon } from 'lucide-react';

export interface ToolField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'range' | 'file';
  placeholder?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  hint?: string;
  accept?: string;
  multiple?: boolean;
}

export interface ToolResultDetail {
  label: string;
  value: string;
}

export interface ToolResult {
  title: string;
  value: string;
  summary?: string;
  details?: ToolResultDetail[];
}

export interface ToolContext {
  fields: Record<string, any>;
  setField: (id: string, value: any) => void;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Tool {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  category: string;
  keywords: string[];
  icon: LucideIcon;
  fields: ToolField[];
  calculate: (ctx: ToolContext) => ToolResult | null;
  explanation: string;
  faqs: Faq[];
  custom?: boolean;
  popular?: boolean;
  recentlyAdded?: boolean;
}
const tools: Tool[] = [];
const toolsBySlug = new Map<string, Tool>();
const toolsByCategory = new Map<string, Tool[]>();

export function registerTool(tool: Tool): void {
  if (toolsBySlug.has(tool.slug)) return;
  tools.push(tool);
  toolsBySlug.set(tool.slug, tool);
  if (!toolsByCategory.has(tool.category)) toolsByCategory.set(tool.category, []);
  toolsByCategory.get(tool.category)!.push(tool);
}

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsBySlug.get(slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return toolsByCategory.get(category) ?? [];
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tools.filter((t) => {
    const haystack = `${t.title} ${t.description} ${t.keywords.join(' ')} ${t.category}`.toLowerCase();
    return haystack.includes(q);
  });
}
export function getPopularTools(): Tool[] {
  return tools.filter(tool => tool.popular);
}

export function getRecentlyAddedTools(): Tool[] {
  return tools.filter(tool => tool.recentlyAdded);
}
