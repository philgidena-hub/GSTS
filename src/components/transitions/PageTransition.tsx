import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
`;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.5,
};

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <PageWrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </PageWrapper>
  );
};
