import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const paddingStyles = {
  none: css`
    padding: 0;
  `,
  sm: css`
    padding: var(--spacing-md);
  `,
  md: css`
    padding: var(--spacing-lg);
  `,
  lg: css`
    padding: var(--spacing-xl);
  `,
};

const variantStyles = {
  default: css`
    background: white;
    border: 1px solid var(--color-neutral-200);
  `,
  elevated: css`
    background: white;
    border: none;
    box-shadow: var(--shadow-lg);
  `,
  outlined: css`
    background: transparent;
    border: 2px solid var(--color-neutral-200);
  `,
  glass: css`
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  `,
};

const StyledCard = styled.div<{
  $variant: CardProps['variant'];
  $padding: CardProps['padding'];
  $hover: boolean;
  $clickable: boolean;
}>`
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-base);

  ${({ $variant }) => variantStyles[$variant || 'default']}
  ${({ $padding }) => paddingStyles[$padding || 'md']}

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }
    `}

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
    `}
`;

const CardHeader = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-neutral-100);
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  margin: 0.5rem 0 0 0;
`;

const CardContent = styled.div`
  padding: var(--spacing-lg);
`;

const CardFooter = styled.div`
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-neutral-100);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const CardImage = styled.div<{ $aspectRatio?: string }>`
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio || '16 / 9'};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  onClick,
}: CardProps) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hover={hover}
      $clickable={!!onClick}
      className={className}
      onClick={onClick}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;
