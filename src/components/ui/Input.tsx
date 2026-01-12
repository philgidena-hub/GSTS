import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-neutral-700);
`;

const InputContainer = styled.div<{ $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid
    ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-neutral-200)'};
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);

  &:hover {
    border-color: ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-neutral-300)'};
  }

  &:focus-within {
    border-color: ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-primary-500)'};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(0, 82, 204, 0.1)'};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--color-neutral-900);
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: var(--color-neutral-400);
  }
`;

const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--color-neutral-900);
  background: white;
  border: 2px solid
    ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-neutral-200)'};
  border-radius: var(--radius-lg);
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all var(--transition-fast);

  &:hover {
    border-color: ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-neutral-300)'};
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? 'var(--color-accent-error)' : 'var(--color-primary-500)'};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(0, 82, 204, 0.1)'};
  }

  &::placeholder {
    color: var(--color-neutral-400);
  }
`;

const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ $position }) =>
    $position === 'left' ? '0 0 0 1rem' : '0 1rem 0 0'};
  color: var(--color-neutral-400);
`;

const HelperText = styled.span<{ $isError: boolean }>`
  font-size: 0.75rem;
  color: ${({ $isError }) =>
    $isError ? 'var(--color-accent-error)' : 'var(--color-neutral-500)'};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <InputWrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputContainer $hasError={!!error}>
          {leftIcon && <IconWrapper $position="left">{leftIcon}</IconWrapper>}
          <StyledInput ref={ref} {...props} />
          {rightIcon && <IconWrapper $position="right">{rightIcon}</IconWrapper>}
        </InputContainer>
        {(error || helperText) && (
          <HelperText $isError={!!error}>{error || helperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = false, ...props }, ref) => {
    return (
      <InputWrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <StyledTextarea ref={ref} $hasError={!!error} {...props} />
        {(error || helperText) && (
          <HelperText $isError={!!error}>{error || helperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';
