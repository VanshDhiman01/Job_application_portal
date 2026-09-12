import { cn } from '../utils/toast';

export function QuestionRenderer({ question, value, onChange, error }) {
  const { type, label, required, options } = question;
  
  const baseInputClass = cn(
    "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400 disabled:opacity-50 disabled:bg-slate-50",
    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-slate-300"
  );

  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* TEXT */}
      {type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}

      {/* TEXTAREA */}
      {type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={cn(baseInputClass, "min-h-[100px] resize-y")}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}

      {/* NUMBER */}
      {type === 'number' && (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
          placeholder={`Enter number`}
        />
      )}

      {/* DROPDOWN */}
      {type === 'dropdown' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="" disabled>Select an option...</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {/* CHECKBOX (Multi-select visual cards) */}
      {type === 'checkbox' && (
        <div className="flex flex-wrap gap-2 mt-1">
          {options?.map(opt => {
            const isSelected = Array.isArray(value) && value.includes(opt);
            return (
              <label 
                key={opt} 
                className={cn(
                  "cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors select-none",
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, opt]);
                    } else {
                      onChange(currentValues.filter(v => v !== opt));
                    }
                  }}
                />
                <div className={cn(
                  "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                  isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {opt}
              </label>
            );
          })}
        </div>
      )}

      {/* BOOLEAN (Radio cards) */}
      {type === 'boolean' && (
        <div className="flex gap-3 mt-1">
          {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map((opt) => {
            const isSelected = value === opt.val;
            return (
              <label 
                key={opt.label}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors select-none",
                  isSelected 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  className="hidden"
                  checked={isSelected}
                  onChange={() => onChange(opt.val)}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
