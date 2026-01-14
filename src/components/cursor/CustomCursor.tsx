import { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useCursorStore } from '../../stores/cursorStore';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;

  @media (max-width: 1024px), (hover: none) {
    display: none;
  }
`;

const CursorOuter = styled(motion.div)<{ $variant: string }>`
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-primary-600);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
  opacity: 0.8;

  ${({ $variant }) => $variant === 'link' && `
    width: 60px;
    height: 60px;
    background: rgba(0, 82, 204, 0.15);
    border-color: var(--color-secondary-500);
  `}

  ${({ $variant }) => $variant === 'button' && `
    width: 80px;
    height: 80px;
    background: rgba(212, 160, 18, 0.2);
    border-color: var(--color-secondary-500);
  `}

  ${({ $variant }) => $variant === 'text' && `
    width: 4px;
    height: 30px;
    border-radius: 2px;
    background: var(--color-primary-600);
    border: none;
  `}

  ${({ $variant }) => $variant === 'hidden' && `
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  `}
`;

const CursorInner = styled(motion.div)<{ $variant: string }>`
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--color-primary-600);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease, transform 0.3s ease;

  ${({ $variant }) => ($variant === 'link' || $variant === 'button') && `
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  `}

  ${({ $variant }) => $variant === 'text' && `
    opacity: 0;
  `}

  ${({ $variant }) => $variant === 'hidden' && `
    opacity: 0;
  `}
`;

const CursorText = styled(motion.span)<{ $visible: boolean }>`
  position: fixed;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--color-secondary-500);
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  white-space: nowrap;
`;

export const CustomCursor = () => {
  const { variant, text } = useCursorStore();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth spring animation for outer cursor
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    // Check if touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none)').matches
      );
    };

    checkTouchDevice();

    if (isTouchDevice) return;

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [moveCursor, isTouchDevice]);

  // Set up cursor detection for interactive elements
  useEffect(() => {
    if (isTouchDevice) return;

    const { setVariant, setText, reset } = useCursorStore.getState();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for data attributes first
      const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (cursorType) {
        setVariant(cursorType as any);
        if (cursorText) setText(cursorText);
        return;
      }

      // Check for interactive elements
      if (target.closest('button, [role="button"]')) {
        setVariant('button');
        return;
      }

      if (target.closest('a, [role="link"]')) {
        setVariant('link');
        return;
      }

      if (target.closest('input, textarea, [contenteditable="true"]')) {
        setVariant('text');
        return;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Only reset if we're leaving an interactive element
      if (
        target.closest('button, a, input, textarea, [data-cursor], [role="button"], [role="link"]') &&
        !relatedTarget?.closest('button, a, input, textarea, [data-cursor], [role="button"], [role="link"]')
      ) {
        reset();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <CursorWrapper>
      <CursorOuter
        $variant={variant}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
      <CursorInner
        $variant={variant}
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      {text && (
        <CursorText
          $visible={!!text}
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
        >
          {text}
        </CursorText>
      )}
    </CursorWrapper>
  );
};
