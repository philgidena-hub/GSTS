import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Cpu,
  Building,
  Scale,
  Heart,
  Lightbulb,
  GraduationCap,
  Factory,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const ThematicSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 50%, var(--color-primary-900) 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(212, 160, 18, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const FloatingOrb = styled(motion.div)<{ $position: 'left' | 'right' }>`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  animation: ${float} 8s ease-in-out infinite;

  ${({ $position }) => $position === 'left' ? `
    top: -100px;
    left: -100px;
    background: var(--color-secondary-500);
  ` : `
    bottom: -100px;
    right: -100px;
    background: var(--color-primary-400);
    animation-delay: 4s;
  `}
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
`;

const SectionLabel = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-secondary-400);
  margin-bottom: var(--spacing-md);
  background: rgba(212, 160, 18, 0.1);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(212, 160, 18, 0.2);
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;

  span {
    background: linear-gradient(135deg, var(--color-secondary-400) 0%, var(--color-secondary-300) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionDescription = styled(motion.p)`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
`;

const CarouselContainer = styled.div`
  position: relative;
`;

const CarouselTrack = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
`;

const ThematicCard = styled(motion.div)<{ $isActive: boolean }>`
  flex: 0 0 350px;
  background: ${({ $isActive }) =>
    $isActive
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)'
      : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $isActive }) =>
    $isActive ? 'rgba(212, 160, 18, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: var(--radius-2xl);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-secondary-500) 0%, var(--color-primary-400) 100%);
    opacity: ${({ $isActive }) => $isActive ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-8px);

    &::before {
      opacity: 1;
    }

    img {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    flex: 0 0 300px;
    padding: 1.5rem;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(0, 41, 102, 0.6) 100%);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-secondary-400);
  background: rgba(212, 160, 18, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(212, 160, 18, 0.2);
`;

const CardLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary-400);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-secondary-300);
    gap: 0.75rem;
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: var(--spacing-2xl);
`;

const NavButton = styled.button<{ $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $disabled }) =>
    $disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${({ $disabled }) =>
    $disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)'};
  color: ${({ $disabled }) =>
    $disabled ? 'rgba(255, 255, 255, 0.3)' : 'white'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const DotsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => $active ? '24px' : '8px'};
  height: 8px;
  border-radius: var(--radius-full);
  background: ${({ $active }) =>
    $active ? 'var(--color-secondary-500)' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'var(--color-secondary-400)' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const ViewAllContainer = styled(motion.div)`
  text-align: center;
  margin-top: var(--spacing-2xl);
`;

const thematicAreas = [
  {
    id: 1,
    title: 'Environmental Resilience',
    description: 'Promoting sustainable environmental practices and climate resilience through research and community engagement.',
    image: '/images/photo_2_2026-01-12_07-13-36.jpg',
    icon: Leaf,
    color: '#10b981',
    tags: ['Climate', 'Sustainability', 'Agriculture'],
    link: '/thematic/environment',
  },
  {
    id: 2,
    title: 'Innovation Hub',
    description: 'Fostering technological innovation and digital transformation for economic development and modernization.',
    image: '/images/photo_1_2026-01-12_07-13-36.jpg',
    icon: Cpu,
    color: '#3b82f6',
    tags: ['Technology', 'Digital', 'Innovation'],
    link: '/thematic/innovation',
  },
  {
    id: 3,
    title: 'Infrastructure & Development',
    description: 'Supporting reconstruction and development of critical infrastructure for sustainable growth.',
    image: '/images/photo_5_2026-01-12_07-13-36.jpg',
    icon: Building,
    color: '#0052cc',
    tags: ['Infrastructure', 'Urban Planning', 'Transport'],
    link: '/thematic/infrastructure',
  },
  {
    id: 4,
    title: 'Governance & Justice',
    description: 'Advancing transparent governance systems and equitable justice for all citizens.',
    image: '/images/photo_3_2026-01-12_07-13-36.jpg',
    icon: Scale,
    color: '#8b5cf6',
    tags: ['Governance', 'Law', 'Policy'],
    link: '/thematic/governance',
  },
  {
    id: 5,
    title: 'Health & Social Welfare',
    description: 'Improving healthcare systems and social welfare programs for community wellbeing.',
    image: '/images/photo_4_2026-01-12_07-13-36.jpg',
    icon: Heart,
    color: '#ef4444',
    tags: ['Healthcare', 'Welfare', 'Community'],
    link: '/thematic/health',
  },
  {
    id: 6,
    title: 'Entrepreneurship & STEM',
    description: 'Empowering entrepreneurs and advancing STEM education for economic transformation.',
    image: '/images/photo_1_2026-01-12_07-13-36.jpg',
    icon: Lightbulb,
    color: '#d4a012',
    tags: ['Business', 'STEM', 'Education'],
    link: '/thematic/entrepreneurship',
  },
  {
    id: 7,
    title: 'Education & Research',
    description: 'Strengthening educational institutions and promoting academic research excellence.',
    image: '/images/photo_10_2026-01-12_07-13-36.jpg',
    icon: GraduationCap,
    color: '#0891b2',
    tags: ['Education', 'Research', 'Academia'],
    link: '/thematic/education',
  },
  {
    id: 8,
    title: 'Economic Development',
    description: 'Driving economic growth through investment, trade, and industrial development.',
    image: '/images/photo_2_2026-01-12_07-13-36.jpg',
    icon: Factory,
    color: '#059669',
    tags: ['Economy', 'Trade', 'Industry'],
    link: '/thematic/economy',
  },
];

export const ThematicAreas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const itemsPerView = 3;
  const maxIndex = Math.max(0, thematicAreas.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <ThematicSection ref={ref}>
      <BackgroundPattern />
      <FloatingOrb $position="left" />
      <FloatingOrb $position="right" />

      <Container>
        <SectionHeader>
          <SectionLabel
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Lightbulb size={16} />
            Our Focus Areas
          </SectionLabel>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our <span>Thematic Areas</span>
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore our diverse thematic clusters where scholars and professionals
            collaborate to drive sustainable development and positive change.
          </SectionDescription>
        </SectionHeader>

        <CarouselContainer>
          <div style={{ overflow: 'hidden' }}>
            <CarouselTrack
              animate={{ x: -currentIndex * (350 + 24) }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {thematicAreas.map((area, index) => (
                <ThematicCard
                  key={area.id}
                  $isActive={index === currentIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -8 }}
                >
                  <CardImage>
                    <img src={area.image} alt={area.title} />
                    <CardIcon $color={area.color}>
                      <area.icon size={24} />
                    </CardIcon>
                  </CardImage>
                  <CardTitle>{area.title}</CardTitle>
                  <CardDescription>{area.description}</CardDescription>
                  <CardTags>
                    {area.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </CardTags>
                  <CardLink>
                    Learn More <ArrowRight size={16} />
                  </CardLink>
                </ThematicCard>
              ))}
            </CarouselTrack>
          </div>

          <NavigationContainer>
            <NavButton
              onClick={handlePrev}
              $disabled={currentIndex === 0}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} />
            </NavButton>
            <DotsContainer>
              {Array.from({ length: Math.ceil(thematicAreas.length / itemsPerView) }).map((_, i) => (
                <Dot
                  key={i}
                  $active={Math.floor(currentIndex / itemsPerView) === i}
                  onClick={() => goToSlide(i * itemsPerView)}
                />
              ))}
            </DotsContainer>
            <NavButton
              onClick={handleNext}
              $disabled={currentIndex >= maxIndex}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight size={24} />
            </NavButton>
          </NavigationContainer>
        </CarouselContainer>

        <ViewAllContainer
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight size={20} />}
          >
            View All Thematic Areas
          </Button>
        </ViewAllContainer>
      </Container>
    </ThematicSection>
  );
};
