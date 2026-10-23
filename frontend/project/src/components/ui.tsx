import { type ReactNode } from 'react';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };
  const variants = {
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20',
    secondary:
      'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200',
    outline:
      'bg-white text-brand-700 border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error,
  icon,
  required = false,
  min,
  step,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
  min?: number;
  step?: number;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          step={step}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-no-repeat ${
          error
            ? 'border-red-300 focus:ring-red-400'
            : 'border-gray-300 focus:ring-brand-500'
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
          paddingRight: '2.5rem',
        }}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'info' | 'danger';
}) {
  const variants = {
    neutral: 'bg-gray-100 text-gray-600',
    success: 'bg-brand-50 text-brand-700 border border-brand-200',
    warning: 'bg-accent-50 text-accent-700 border border-accent-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <span
      className={`${sizes[size]} border-2 border-brand-500 border-t-transparent rounded-full animate-spin inline-block`}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-up">
      <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-5">
        <div className="text-brand-400">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
