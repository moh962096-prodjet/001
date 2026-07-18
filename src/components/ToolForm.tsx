import { useState, useCallback } from 'react';
import type { Tool, ToolField, ToolResult, ToolContext } from '../data/toolRegistry';
import { Calculator, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';

function getInitialValues(fields: ToolField[]): Record<string, any> {
  const vals: Record<string, any> = {};
  for (const f of fields) {
    if (f.type === 'checkbox') vals[f.id] = f.defaultValue ?? false;
    else if (f.type === 'range') vals[f.id] = f.defaultValue ?? f.min ?? 16;
    else vals[f.id] = f.defaultValue ?? '';
  }
  return vals;
}

export default function ToolForm({ tool, onResult }: { tool: Tool; onResult: (result: ToolResult | null) => void }) {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<string, any>>(() => getInitialValues(tool.fields));
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback((id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCalculate = () => {
    setError(null);
    const ctx: ToolContext = { fields: values, setField };
    try {
      const result = tool.calculate(ctx);
      if (!result) {
        setError(t.tool.errorRequired);
        onResult(null);
        return;
      }
      onResult(result);
    } catch {
      setError(t.tool.errorCalculation);
      onResult(null);
    }
  };

  const handleReset = () => {
    setValues(getInitialValues(tool.fields));
    onResult(null);
    setError(null);
  };

  return (
    <div className="card p-6">
      <div className="space-y-5">
        {tool.fields.map((field) => (
          <FieldInput key={field.id} field={field} value={values[field.id]} onChange={(v) => setField(field.id, v)} />
        ))}
      </div>
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button onClick={handleCalculate} className="btn-primary flex-1">
          <Calculator className="h-5 w-5" />
          {t.tool.calculate}
        </button>
        <button onClick={handleReset} className="btn-ghost">{t.tool.reset}</button>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: ToolField; value: any; onChange: (v: any) => void }) {
  const labelEl = (
    <label htmlFor={field.id} className="block text-sm font-medium text-slate-700">{field.label}</label>
  );

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-3">
        <input id={field.id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-sm font-medium text-slate-700">{field.label}</span>
      </div>
    );
  }

  if (field.type === 'range') {
    return (
      <div>
        {labelEl}
        <div className="mt-2 flex items-center gap-3">
          <input id={field.id} type="range" min={field.min} max={field.max} step={field.step || 1} value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-xl bg-slate-200 accent-brand-600" />
          <span className="w-12 text-center text-sm font-semibold text-brand-700">{value}</span>
        </div>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea id={field.id} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} rows={8}
          className="input-field mt-1.5 resize-y font-mono text-sm" />
        {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        {labelEl}
        <select id={field.id} value={value} onChange={(e) => onChange(e.target.value)} className="input-field mt-1.5">
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input id={field.id} type={field.type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder} min={field.min} max={field.max} step={field.step}
        className="input-field mt-1.5" />
      {field.hint && <p className="mt-1 text-xs text-slate-400">{field.hint}</p>}
    </div>
  );
}
