import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Users,
  Globe2,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';

const ServingSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(180deg, var(--color-neutral-50) 0%, white 50%, var(--color-neutral-50) 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(0, 82, 204, 0.03) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(212, 160, 18, 0.03) 0%, transparent 40%);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContentSection = styled(motion.div)``;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary-600);
  margin-bottom: var(--spacing-md);
  background: var(--color-primary-50);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;

  span {
    background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-500) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
`;

const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProgressItem = styled(motion.div)``;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProgressIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-neutral-800);
`;

const ProgressValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-600);
`;

const ProgressBarContainer = styled.div`
  height: 10px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)<{ $color: string; $animate: boolean }>`
  height: 100%;
  background: linear-gradient(90deg, ${({ $color }) => $color} 0%, ${({ $color }) => $color}cc 100%);
  border-radius: var(--radius-full);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: var(--spacing-xl);
  flex-wrap: wrap;
`;

const VisualSection = styled(motion.div)`
  position: relative;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)<{ $featured?: boolean }>`
  background: ${({ $featured }) =>
    $featured
      ? 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)'
      : 'white'};
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: ${({ $featured }) =>
    $featured
      ? '0 20px 50px -12px rgba(0, 82, 204, 0.4)'
      : 'var(--shadow-lg)'};
  border: ${({ $featured }) =>
    $featured ? 'none' : '1px solid var(--color-neutral-100)'};
  position: relative;
  overflow: hidden;

  ${({ $featured }) => $featured && `
    grid-column: span 2;

    @media (max-width: 640px) {
      grid-column: span 1;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const StatIcon = styled.div<{ $light?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: ${({ $light }) =>
    $light
      ? 'rgba(255, 255, 255, 0.15)'
      : 'var(--color-primary-50)'};
  color: ${({ $light }) =>
    $light
      ? 'white'
      : 'var(--color-primary-600)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const StatValue = styled.div<{ $light?: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $light }) =>
    $light ? 'white' : 'var(--color-neutral-900)'};
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
`;

const StatLabel = styled.div<{ $light?: boolean }>`
  font-size: 0.9375rem;
  color: ${({ $light }) =>
    $light ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-neutral-500)'};
  font-weight: 500;
`;

const StatDescription = styled.p<{ $light?: boolean }>`
  font-size: 0.875rem;
  color: ${({ $light }) =>
    $light ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-neutral-400)'};
  margin-top: 0.75rem;
  line-height: 1.5;
`;

const progressData = [
  {
    icon: Users,
    title: 'Member Engagement',
    value: 95,
    color: '#0052cc',
  },
  {
    icon: Globe2,
    title: 'Global Reach',
    value: 85,
    color: '#10b981',
  },
  {
    icon: BookOpen,
    title: 'Research Projects',
    value: 78,
    color: '#d4a012',
  },
  {
    icon: Target,
    title: 'Goals Achieved',
    value: 92,
    color: '#8b5cf6',
  },
];

const statsData = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Active Members',
    description: 'Scholars and professionals worldwide',
    featured: true,
  },
  {
    icon: Globe2,
    value: '50+',
    label: 'Countries',
    description: 'Global representation',
  },
  {
    icon: Award,
    value: '12+',
    label: 'Active Projects',
    description: 'Ongoing initiatives',
  },
  {
    icon: TrendingUp,
    value: '10+',
    label: 'Sectoral Clusters',
    description: 'Specialized focus areas',
  },
];

export const ServingYou = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [animatedValues, setAnimatedValues] = useState<number[]>(
    progressData.map(() => 0)
  );

  useEffect(() => {
    if (inView) {
      progressData.forEach((item, index) => {
        const duration = 1500;
        const steps = 60;
        const stepValue = item.value / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += stepValue;
          if (current >= item.value) {
            current = item.value;
            clearInterval(interval);
          }
          setAnimatedValues((prev) => {
            const newValues = [...prev];
            newValues[index] = Math.round(current);
            return newValues;
          });
        }, duration / steps);
      });
    }
  }, [inView]);

  return (
    <ServingSection ref={ref}>
      <BackgroundDecoration />
      <Container>
        <ContentGrid>
          <ContentSection
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>
              <Award size={16} />
              Our Commitment
            </SectionLabel>
            <SectionTitle>
              Dedicated to <span>Serving You</span>
            </SectionTitle>
            <SectionDescription>
              We are committed to providing exceptional support and resources to our members.
              Our progress reflects our dedication to excellence and the collective impact
              of our global community.
            </SectionDescription>

            <ProgressList>
              {progressData.map((item, index) => (
                <ProgressItem
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <ProgressHeader>
                    <ProgressLabel>
                      <ProgressIcon $color={item.color}>
                        <item.icon size={18} />
                      </ProgressIcon>
                      <ProgressTitle>{item.title}</ProgressTitle>
                    </ProgressLabel>
                    <ProgressValue>{animatedValues[index]}%</ProgressValue>
                  </ProgressHeader>
                  <ProgressBarContainer>
                    <ProgressBar
                      $color={item.color}
                      $animate={inView}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${item.value}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                    />
                  </ProgressBarContainer>
                </ProgressItem>
              ))}
            </ProgressList>

            <ActionButtons>
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
              >
                Join Our Community
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </ActionButtons>
          </ContentSection>

          <VisualSection
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StatsGrid>
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  $featured={stat.featured}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StatIcon $light={stat.featured}>
                    <stat.icon size={28} />
                  </StatIcon>
                  <StatValue $light={stat.featured}>{stat.value}</StatValue>
                  <StatLabel $light={stat.featured}>{stat.label}</StatLabel>
                  <StatDescription $light={stat.featured}>
                    {stat.description}
                  </StatDescription>
                </StatCard>
              ))}
            </StatsGrid>
          </VisualSection>
        </ContentGrid>
      </Container>
    </ServingSection>
  );
};
