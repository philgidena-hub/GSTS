import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: css`
    background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 14px 0 rgba(0, 82, 204, 0.39);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-800) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 82, 204, 0.45);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-600) 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 14px 0 rgba(212, 160, 18, 0.39);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-secondary-600) 0%, var(--color-secondary-700) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 160, 18, 0.45);
    }
  `,
  outline: css`
    background: transparent;
    color: var(--color-primary-600);
    border: 2px solid var(--color-primary-600);

    &:hover:not(:disabled) {
      background: var(--color-primary-50);
      border-color: var(--color-primary-700);
      color: var(--color-primary-700);
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--color-neutral-700);
    border: none;

    &:hover:not(:disabled) {
      background: var(--color-neutral-100);
      color: var(--color-neutral-900);
    }
  `,
  danger: css`
    background: var(--color-accent-error);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: var(--radius-md);
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: var(--radius-lg);
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
    border-radius: var(--radius-lg);
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-primary);
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
