import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Building2,
  Scale,
  Users,
  Play,
  Sparkles,
} from 'lucide-react';
import { useContentStore } from '../../stores/contentStore';

// Animations
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(212, 160, 18, 0.4));
    opacity: 0.8;
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(212, 160, 18, 0.8));
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { border-color: var(--color-secondary-400); }
  51%, 100% { border-color: transparent; }
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 41, 102, 0.85) 0%,
      rgba(0, 51, 128, 0.8) 50%,
      rgba(0, 61, 153, 0.75) 100%
    );
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(0, 41, 102, 0.3) 100%
  );
  z-index: 1;
`;

const AnimatedGridPattern = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
`;

const HeroMain = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
  padding-bottom: 120px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding-top: 100px;
    padding-bottom: 80px;
  }
`;

const HeroContent = styled.div`
  max-width: 1000px;
  text-align: center;
  padding: 0 var(--container-padding);
`;

const HeroLabel = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(212, 160, 18, 0.15);
  border: 1px solid rgba(212, 160, 18, 0.3);
  border-radius: 50px;
  margin-bottom: 1.5rem;
  animation: ${scaleIn} 0.6s ease-out;

  span {
    color: var(--color-secondary-400);
    font-family: var(--font-heading);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  svg {
    color: var(--color-secondary-400);
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const HeroTitleWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled(motion.h1)`
  color: white;
  font-family: var(--font-heading);
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.15;
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
`;

const AnimatedWord = styled.span<{ $delay: number }>`
  display: inline-block;
  animation: ${slideInLeft} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
`;

const HighlightedText = styled.span`
  position: relative;
  display: inline-block;
  color: transparent;
  background: linear-gradient(
    135deg,
    var(--color-secondary-400) 0%,
    var(--color-secondary-500) 50%,
    #ffd700 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  background-size: 200% auto;
  animation: ${shimmer} 3s linear infinite;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--color-secondary-400), var(--color-secondary-600));
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    animation: ${fadeUp} 0.6s ease-out 1.2s forwards;
  }
`;

const HeroTagline = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-primary);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  font-weight: 400;
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  animation: ${fadeUp} 0.8s ease-out 0.8s both;
`;

const TypewriterWrapper = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid var(--color-secondary-400);
  animation: ${typewriter} 2s steps(30) 0.5s forwards, ${blink} 0.8s step-end infinite;
  width: 0;
`;

const FloatingElement = styled.div<{ $top: string; $left: string; $delay: number; $size: number }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 160, 18, 0.3), rgba(212, 160, 18, 0.1));
  animation: ${float} ${({ $delay }) => 4 + $delay}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  pointer-events: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.8s ease-out 0.4s both;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const buttonShine = keyframes`
  0% { left: -100%; }
  50%, 100% { left: 100%; }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.25rem;
  background: linear-gradient(135deg, var(--color-secondary-400) 0%, var(--color-secondary-500) 50%, var(--color-secondary-600) 100%);
  border: none;
  border-radius: 6px;
  color: var(--color-primary-900);
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(212, 160, 18, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 40px rgba(212, 160, 18, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);

    &::before {
      animation: ${buttonShine} 0.8s ease;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const PlayIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

// Service Cards Section
const ServiceCardsSection = styled.div`
  position: relative;
  z-index: 10;
  margin-top: -80px;
  padding: 0 var(--container-padding) 4rem;
`;

const ServiceCardsContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
`;

const ServiceCardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.12);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)<{ $color: string }>`
  background: white;
  padding: 2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  border-right: 1px solid var(--color-neutral-100);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:last-child {
    border-right: none;
  }

  @media (max-width: 1200px) {
    border-right: none;
    border-bottom: 1px solid var(--color-neutral-100);
  }

  /* Colored accent on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color }) => $color};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Subtle background gradient on hover */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to top, ${({ $color }) => $color}08, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
    z-index: 2;

    &::before {
      transform: scaleX(1);
    }

    &::after {
      opacity: 1;
    }

    .service-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .service-number {
      transform: translateY(-5px);
      opacity: 0.2;
    }

    .service-arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:first-of-type {
    border-radius: 8px 0 0 8px;
    @media (max-width: 1200px) {
      border-radius: 8px 8px 0 0;
    }
  }

  &:last-of-type {
    border-radius: 0 8px 8px 0;
    @media (max-width: 1200px) {
      border-radius: 0 0 8px 8px;
    }
  }
`;

const ServiceNumber = styled.span<{ $color: string }>`
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-family: var(--font-display);
  font-size: 4.5rem;
  font-weight: 800;
  color: ${({ $color }) => $color};
  opacity: 0.12;
  line-height: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
`;

const ServiceIconWrapper = styled.div<{ $color: string }>`
  width: 65px;
  height: 65px;
  border-radius: 16px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px -5px ${({ $color }) => $color}40;
`;

const ServiceTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 1.25rem;
`;

const ServiceArrow = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  cursor: pointer;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const services = [
  {
    icon: Heart,
    title: 'Humanitarian Advocacy',
    description: 'Supporting communities through crisis response and sustainable initiatives.',
    color: '#ef4444',
  },
  {
    icon: Building2,
    title: 'Reconstruction & Development',
    description: 'Building infrastructure and fostering economic growth for prosperity.',
    color: '#0052cc',
  },
  {
    icon: Scale,
    title: 'Governance & Justice',
    description: 'Promoting transparent governance and equitable justice systems.',
    color: '#10b981',
  },
  {
    icon: Users,
    title: 'Professional Networking',
    description: 'Connecting scholars and professionals worldwide for impact.',
    color: '#d4a012',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
};

export const Hero = () => {
  const navigate = useNavigate();
  const { hero } = useContentStore();

  const titleWords = ['Global', 'Society', 'of', 'Tigray'];
  const highlightWords = ['Scholars', '&', 'Professionals'];

  return (
    <>
      <HeroSection>
        <HeroBackground>
          <img src={hero.backgroundImage || "/images/Hero_Image.jpg"} alt="GSTS Community" />
        </HeroBackground>
        <HeroOverlay />
        <AnimatedGridPattern />

        {/* Floating decorative elements */}
        <FloatingElement $top="15%" $left="10%" $delay={0} $size={80} />
        <FloatingElement $top="60%" $left="5%" $delay={1.5} $size={50} />
        <FloatingElement $top="25%" $left="85%" $delay={0.8} $size={60} />
        <FloatingElement $top="70%" $left="90%" $delay={2} $size={40} />

        <HeroMain>
          <HeroContent>
            <HeroLabel>
              <Sparkles size={16} />
              <span>Welcome to GSTS</span>
            </HeroLabel>

            <HeroTitleWrapper>
              <HeroTitle>
                {titleWords.map((word, index) => (
                  <AnimatedWord key={index} $delay={0.1 + index * 0.1}>
                    {word}{' '}
                  </AnimatedWord>
                ))}
                <br />
                <HighlightedText>
                  {highlightWords.map((word, index) => (
                    <AnimatedWord key={index} $delay={0.5 + index * 0.1}>
                      {word}{' '}
                    </AnimatedWord>
                  ))}
                </HighlightedText>
              </HeroTitle>
            </HeroTitleWrapper>

            <HeroTagline>
              <TypewriterWrapper>
                Empowering Knowledge, Advancing Tigray
              </TypewriterWrapper>
            </HeroTagline>

            <HeroActions
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <PrimaryButton onClick={() => navigate(hero.primaryButtonLink || '/membership')}>
                {hero.primaryButtonText || 'Join GSTS'}
                <ArrowRight size={18} />
              </PrimaryButton>
              <SecondaryButton onClick={() => navigate(hero.secondaryButtonLink || '/about')}>
                <PlayIcon>
                  <Play size={16} fill="white" />
                </PlayIcon>
                {hero.secondaryButtonText || 'Watch Video'}
              </SecondaryButton>
            </HeroActions>
          </HeroContent>
        </HeroMain>
      </HeroSection>

      <ServiceCardsSection>
        <ServiceCardsContainer>
          <ServiceCardsGrid
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                $color={service.color}
                variants={cardVariants}
                onClick={() => navigate('/membership')}
              >
                <ServiceNumber $color={service.color} className="service-number">
                  {String(index + 1).padStart(2, '0')}
                </ServiceNumber>
                <ServiceIconWrapper $color={service.color} className="service-icon-wrapper">
                  <service.icon size={28} />
                </ServiceIconWrapper>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceArrow $color={service.color} className="service-arrow">
                  Join Now <ArrowRight size={14} />
                </ServiceArrow>
              </ServiceCard>
            ))}
          </ServiceCardsGrid>
        </ServiceCardsContainer>
      </ServiceCardsSection>
    </>
  );
};
