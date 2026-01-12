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
  max-width: 900px;
  text-align: center;
  padding: 0 var(--container-padding);
`;

const HeroTitle = styled(motion.h1)`
  color: white;
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.3);
  animation: ${fadeUp} 0.8s ease-out;

  .highlight {
    color: var(--color-secondary-400);
    display: block;
    font-size: clamp(2rem, 4vw, 3.25rem);
    margin-top: 0.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
  margin: 0 auto 2.5rem;
  max-width: 700px;
  animation: ${fadeUp} 0.8s ease-out 0.2s both;
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

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-600) 100%);
  border: none;
  border-radius: 4px;
  color: var(--color-primary-900);
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(212, 160, 18, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(212, 160, 18, 0.5);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
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
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)<{ $color: string }>`
  background: ${({ $color }) => $color};
  padding: 2rem 1.75rem 5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 220px;
  border-radius: 8px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Folded corner effect */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.15) 50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, transparent 50%, white 50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);

    &::before,
    &::after {
      width: 100px;
      height: 100px;
    }

    .service-icon {
      transform: scale(1.1);
    }

    .service-number {
      transform: translate(5px, -5px);
      opacity: 0.4;
    }

    .service-title {
      transform: translateX(5px);
    }
  }
`;

const ServiceNumber = styled.span`
  position: absolute;
  bottom: 12px;
  right: 20px;
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  opacity: 0.3;
  line-height: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  z-index: 1;
`;

const ServiceIconWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;

  svg {
    stroke-width: 1.5;
  }
`;

const ServiceTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const services = [
  {
    icon: Heart,
    title: 'Humanitarian Advocacy',
    color: '#22c55e',
    link: '/services/humanitarian'
  },
  {
    icon: Building2,
    title: 'Reconstruction & Development',
    color: '#0052cc',
    link: '/services/development'
  },
  {
    icon: Scale,
    title: 'Governance & Justice',
    color: '#f59e0b',
    link: '/services/governance'
  },
  {
    icon: Users,
    title: 'Professional Networking',
    color: '#ef4444',
    link: '/services/networking'
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

  return (
    <>
      <HeroSection>
        <HeroBackground>
          <img src={hero.backgroundImage || "/images/Hero_Image.jpg"} alt="GSTS Community" />
        </HeroBackground>
        <HeroOverlay />

        <HeroMain>
          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {hero.title || 'Global Society of Tigray'}
              <span className="highlight">{hero.subtitle || 'Scholars and Professionals'}</span>
            </HeroTitle>

            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {hero.description || 'A global knowledge network of academics, professionals, and intellectuals dedicated to leveraging expertise for the reconstruction and sustainable development of Tigray.'}
            </HeroSubtitle>

            <HeroActions
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
                <ServiceTitle className="service-title">{service.title}</ServiceTitle>
                <ServiceIconWrapper className="service-icon">
                  <service.icon size={32} />
                </ServiceIconWrapper>
                <ServiceNumber className="service-number">
                  {String(index + 1).padStart(2, '0')}
                </ServiceNumber>
              </ServiceCard>
            ))}
          </ServiceCardsGrid>
        </ServiceCardsContainer>
      </ServiceCardsSection>
    </>
  );
};
