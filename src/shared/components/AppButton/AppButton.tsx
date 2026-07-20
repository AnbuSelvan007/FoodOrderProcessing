import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import type { ReactNode } from 'react';
import './AppButton.css';

type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'text';

interface AppButtonProps extends Omit<ButtonProps, 'type'> {
  /** Visual variant of the button. */
  variant?: AppButtonVariant;
  /** Button content. */
  children: ReactNode;
}

const variantMap: Record<AppButtonVariant, { type: ButtonProps['type']; danger?: boolean }> = {
  primary: { type: 'primary' },
  secondary: { type: 'default' },
  danger: { type: 'primary', danger: true },
  ghost: { type: 'default' },
  text: { type: 'text' },
};

/**
 * Branded button with preset variants.
 *
 * Wraps Ant Design's `Button` and exposes a simpler `variant` prop
 * instead of the raw `type` + `danger` combination.
 */
export function AppButton({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: AppButtonProps) {
  const mapped = variantMap[variant];

  return (
    <Button
      type={mapped.type}
      danger={mapped.danger}
      className={`app-button app-button--${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Button>
  );
}
