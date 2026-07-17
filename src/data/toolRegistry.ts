import type { ComponentType } from 'react';

export interface ToolField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'date' | 'textarea' | 'file' | 'range' | 'checkbox';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  hint?: string;
  multiple?: boolean;
}

export interface ToolResult {
  title: string;
  value: string;
  summary?: string;
  details?: { label: string; value: string }[];
}

export interface ToolContext {
  fields: Record<string, string | number | boolean | File | File[] | undefined>;
  setField: (id: string, value: string | number | boolean | File | File[] | undefined) => void;
}

export interface Tool {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  metaDescription: string;
  category: string;
  keywords: string[];
  icon: ComponentType<{ className?: string }>;
  fields: ToolField[];
  calculate: (ctx: ToolContext) => ToolResult | null;
  explanation: string;
  faqs: { question: string; answer: string }[];
  popular?: boolean;
  recentlyAdded?: boolean;
  /** If true, the tool uses a custom render instead of the default form. */
  custom?: boolean;
  customComponent?: ComponentType<ToolContext>;
  /** Override default result rendering with custom JSX. */
  renderResult?: (result: ToolResult) => ComponentType | null;
}

export const toolRegistry: Record<string, Tool> = {};

export function registerTool(tool: Tool) {
  toolRegistry[tool.slug] = tool;
}

export function getTool(slug: string): Tool | undefined {
  return toolRegistry[slug];
}

export function getAllTools(): Tool[] {
  return Object.values(toolRegistry);
}

export function getToolsByCategory(category: string): Tool[] {
  return getAllTools().filter((t) => t.category === category);
}

export function getPopularTools(): Tool[] {
  return getAllTools().filter((t) => t.popular);
}

export function getRecentlyAddedTools(): Tool[] {
  return getAllTools().filter((t) => t.recentlyAdded);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return getAllTools().filter((t) => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  });
}
