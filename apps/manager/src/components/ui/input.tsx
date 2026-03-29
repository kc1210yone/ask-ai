import { tv } from 'tailwind-variants';
import type { ComponentProps } from 'react';

const inputStyles = tv({
  base: 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-xs transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  variants: {
    hasError: {
      true: 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
    },
  },
});

interface InputProps extends Omit<ComponentProps<'input'>, 'id'> {
  id: string;
  label?: string | undefined;
  error?: string | undefined;
}

export const Input = ({
  id,
  label,
  error,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="space-y-1">
      {label != null && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputStyles({ hasError: error != null, className })}
        {...props}
      />
      {error != null && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};
