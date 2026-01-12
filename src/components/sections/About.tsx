import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  GraduationCap,
  Globe2,
  Handshake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutSection = styled.section`
  padding: 5rem 0;
  background: white;
  position: relative;
`;

const AboutContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AboutImageWrapper = styled(motion.div)`
  position: relative;
`;

const MainImage = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 450px;
    object-fit: cover;
    display: block;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 41, 102, 0.8) 0%, transparent 100%);
  padding: 2rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const OverlayStat = styled.div`
  text-align: center;
  color: white;
`;

const OverlayValue = styled.div`
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
`;

const OverlayLabel = styled.div`
  font-size: 0.8125rem;
  opacity: 0.9;
`;

const FloatingCard = styled(motion.div)`
  position: absolute;
  top: -20px;
  right: -20px;
  background: var(--color-secondary-500);
  padding: 1.25rem 1.75rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(212, 160, 18, 0.3);
  color: var(--color-primary-900);

  @media (max-width: 768px) {
    right: 10px;
    top: 10px;
  }
`;

const FloatingValue = styled.div`
  font-family: var(--font-heading);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
`;

const FloatingLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
`;

const AboutContent = styled(motion.div)``;

const SectionLabel = styled.div`
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-secondary-600);
  margin-bottom: 1rem;
  position: relative;
  padding-left: 3rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5rem;
    height: 2px;
    background: var(--color-secondary-500);
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1.5rem;
  line-height: 1.3;

  span {
    color: var(--color-primary-600);
  }
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const CorePillarsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CorePillarItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

const PillarCheck = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary-50);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const PillarText = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-neutral-700);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--color-primary-600);
  border: none;
  border-radius: 4px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-700);
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: transparent;
  border: 2px solid var(--color-neutral-200);
  border-radius: 4px;
  color: var(--color-neutral-700);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary-600);
    color: var(--color-primary-600);
  }
`;

// Values Section
const ValuesSection = styled.section`
  padding: 5rem 0;
  background: var(--color-neutral-50);
`;

const ValuesContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const ValuesHeader = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const ValuesGrid = styled.div`
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

const ValueCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-neutral-100);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary-100);
  }
`;

const ValueIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.25rem;
`;

const ValueTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
`;

const ValueDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin: 0;
`;

const corePillars = [
  'Humanitarian Advocacy',
  'Knowledge Transfer',
  'Global Network',
  'Sustainable Development',
  'Good Governance',
  'Research & Innovation',
];

const values = [
  {
    icon: Heart,
    title: 'Humanitarian Focus',
    description: 'Dedicated to supporting communities through crisis and recovery.',
    color: '#ef4444',
  },
  {
    icon: GraduationCap,
    title: 'Academic Excellence',
    description: 'Promoting education and knowledge sharing across borders.',
    color: '#0052cc',
  },
  {
    icon: Globe2,
    title: 'Global Reach',
    description: 'Connecting professionals from over 50 countries worldwide.',
    color: '#10b981',
  },
  {
    icon: Handshake,
    title: 'Collaboration',
    description: 'Building partnerships for sustainable development.',
    color: '#d4a012',
  },
];

export const About = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      <AboutSection id="about" ref={ref}>
        <AboutContainer>
          <AboutGrid>
            <AboutImageWrapper
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <MainImage>
                <img src="/images/photo_10_2026-01-12_07-13-36.jpg" alt="GSTS Conference" />
                <ImageOverlay>
                  <OverlayStat>
                    <OverlayValue>50+</OverlayValue>
                    <OverlayLabel>Countries</OverlayLabel>
                  </OverlayStat>
                  <OverlayStat>
                    <OverlayValue>5,000+</OverlayValue>
                    <OverlayLabel>Members</OverlayLabel>
                  </OverlayStat>
                  <OverlayStat>
                    <OverlayValue>10+</OverlayValue>
                    <OverlayLabel>Clusters</OverlayLabel>
                  </OverlayStat>
                </ImageOverlay>
              </MainImage>

              <FloatingCard
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FloatingValue>12+</FloatingValue>
                <FloatingLabel>Years of Impact</FloatingLabel>
              </FloatingCard>
            </AboutImageWrapper>

            <AboutContent
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SectionLabel>Who We Are</SectionLabel>

              <SectionTitle>
                Global Society of <span>Tigray Scholars</span> and Professionals
              </SectionTitle>

              <SectionDescription>
                GSTS is a global knowledge network of academics, professionals, and intellectuals
                dedicated to leveraging expertise for the reconstruction and sustainable development
                of Tigray. We unite scholars from around the world to create meaningful impact through
                collaboration, research, and advocacy.
              </SectionDescription>

              <CorePillarsList>
                {corePillars.map((pillar, index) => (
                  <CorePillarItem
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <PillarCheck>
                      <CheckCircle2 size={14} />
                    </PillarCheck>
                    <PillarText>{pillar}</PillarText>
                  </CorePillarItem>
                ))}
              </CorePillarsList>

              <ButtonGroup>
                <PrimaryButton onClick={() => navigate('/about')}>
                  Learn More
                  <ArrowRight size={16} />
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate('/membership')}>
                  Join GSTS
                </SecondaryButton>
              </ButtonGroup>
            </AboutContent>
          </AboutGrid>
        </AboutContainer>
      </AboutSection>

      <ValuesSection>
        <ValuesContainer>
          <ValuesHeader>
            <SectionLabel style={{ paddingLeft: 0 }}>Our Core Values</SectionLabel>
            <SectionTitle>What Drives Us Forward</SectionTitle>
          </ValuesHeader>

          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ValueIcon $color={value.color}>
                  <value.icon size={26} />
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesContainer>
      </ValuesSection>
    </>
  );
};
