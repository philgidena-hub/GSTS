import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Globe, Grid, Briefcase, Award, BookOpen } from 'lucide-react';
import { useContentStore } from '../../stores/contentStore';

const StatisticsSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 80%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  );
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--spacing-3xl);
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-secondary-400);
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-base);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-secondary-400), var(--color-secondary-600));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 30px rgba(212, 160, 18, 0.3);
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const iconMap: { [key: string]: React.ComponentType<{ size: number }> } = {
  Users,
  Globe,
  Grid,
  Briefcase,
  Award,
  BookOpen,
};

interface AnimatedNumberProps {
  value: string;
  inView: boolean;
}

const AnimatedNumber = ({ value, inView }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!inView) return;

    // Extract number and suffix
    const numericMatch = value.match(/^([\d,]+)/);
    const suffixMatch = value.match(/(\D+)$/);

    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1].replace(/,/g, ''), 10);
    const suffix = suffixMatch ? suffixMatch[1] : '';

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * targetNumber);

      setDisplayValue(current.toLocaleString() + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, inView]);

  return <>{displayValue}</>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const Statistics = () => {
  const { statistics } = useContentStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <StatisticsSection id="statistics">
      <BackgroundPattern />
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionLabel>Our Impact</SectionLabel>
          <SectionTitle>Making a Difference Together</SectionTitle>
          <SectionDescription>
            Our global network of scholars and professionals continues to grow,
            creating meaningful impact across communities and sectors.
          </SectionDescription>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <StatsGrid>
            {statistics.map((stat) => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <StatCard key={stat.id} variants={cardVariants}>
                  <StatIcon>
                    <IconComponent size={32} />
                  </StatIcon>
                  <StatValue>
                    <AnimatedNumber value={stat.value} inView={inView} />
                  </StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                  <StatDescription>{stat.description}</StatDescription>
                </StatCard>
              );
            })}
          </StatsGrid>
        </motion.div>
      </Container>
    </StatisticsSection>
  );
};
