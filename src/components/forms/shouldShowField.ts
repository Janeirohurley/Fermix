import type { FormField } from "./types/formTypes";

export function shouldShowField(field: FormField, formData: Record<string, unknown>): boolean {
  const condition = field.validation?.showIf;
  if (!condition) return true;

  const targetValue = formData[condition.fieldId];

  switch (condition.condition) {
    case 'equals':
      return targetValue == condition.value;
    case 'not_equals':
      return targetValue !== condition.value;
    case 'contains':
      if (Array.isArray(targetValue)) {
        return targetValue.includes(condition.value);
      }
      if (typeof targetValue === 'string') {
        return targetValue.includes(String(condition.value));
      }
      return false;
    case 'greater_than':
      return Number(targetValue) > Number(condition.value);
    case 'less_than':
      return Number(targetValue) < Number(condition.value);
    default:
      return true;
  }
}
