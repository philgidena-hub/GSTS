import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Target,
  Eye,
  Heart,
  GraduationCap,
  Globe2,
  Handshake,
  Shield,
  Lightbulb,
  Users,
  Award,
} from 'lucide-react';

const PageHero = styled.section`
  padding: 10rem 0 5rem;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Hero_Image.jpg') center/cover no-repeat;
    opacity: 0.15;
  }
`;

const PageHeroContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-secondary-400);
    }
  }

  span {
    color: var(--color-secondary-400);
  }
`;

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem;
`;

const SectionLabel = styled.div`
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-secondary-600);
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
`;

// About Content Section
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

const AboutImage = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 450px;
    object-fit: cover;
  }
`;

const AboutContent = styled.div``;

const AboutText = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

// Mission Vision Section
const MissionVisionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MissionVisionCard = styled(motion.div)<{ $variant: 'primary' | 'secondary' }>`
  padding: 2.5rem;
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)'
      : 'linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-600) 100%)'};
  border-radius: 8px;
  color: white;
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CardText = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.9;
`;

// Values Section
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
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-neutral-100);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
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

const ValueTitle = styled.h4`
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
`;

// Stats Section
const StatsSection = styled.section`
  padding: 5rem 0;
  background: var(--color-primary-900);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-secondary-400);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

// Pillars Section
const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PillarCard = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary-600);
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
`;

const PillarIcon = styled.div<{ $color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
`;

const PillarTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
`;

const PillarDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
`;

const values = [
  { icon: Heart, title: 'Compassion', description: 'Dedicated to humanitarian causes.', color: '#ef4444' },
  { icon: Shield, title: 'Integrity', description: 'Upholding ethical standards.', color: '#0052cc' },
  { icon: Users, title: 'Collaboration', description: 'Working together for impact.', color: '#10b981' },
  { icon: Award, title: 'Excellence', description: 'Striving for the highest quality.', color: '#d4a012' },
];

const pillars = [
  { icon: Heart, title: 'Humanitarian Advocacy', description: 'Supporting relief efforts and advocating for communities in need.', color: '#ef4444' },
  { icon: GraduationCap, title: 'Knowledge Transfer', description: 'Empowering through education and research initiatives.', color: '#0052cc' },
  { icon: Globe2, title: 'Global Network', description: 'Connecting professionals across 50+ countries worldwide.', color: '#10b981' },
  { icon: Handshake, title: 'Sustainable Development', description: 'Building lasting prosperity through strategic initiatives.', color: '#d4a012' },
  { icon: Shield, title: 'Good Governance', description: 'Promoting transparency and accountability in all endeavors.', color: '#8b5cf6' },
  { icon: Lightbulb, title: 'Innovation & Research', description: 'Driving progress through knowledge and technology.', color: '#ec4899' },
];

export const About = () => {
  const [ref] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      <PageHero>
        <PageHeroContent>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>/</span>
            <span>About Us</span>
          </Breadcrumb>
          <PageTitle>About GSTS</PageTitle>
          <PageSubtitle>
            Learn about our mission, vision, and the global community of scholars
            and professionals driving positive change.
          </PageSubtitle>
        </PageHeroContent>
      </PageHero>

      <Section ref={ref}>
        <Container>
          <AboutGrid>
            <AboutImage>
              <img src="/images/photo_10_2026-01-12_07-13-36.jpg" alt="GSTS Team" />
            </AboutImage>
            <AboutContent>
              <SectionLabel>Who We Are</SectionLabel>
              <SectionTitle>Global Society of Tigray Scholars and Professionals</SectionTitle>
              <AboutText>
                GSTS is a global knowledge network of academics, professionals, and intellectuals
                dedicated to leveraging expertise for the reconstruction and sustainable development
                of Tigray.
              </AboutText>
              <AboutText>
                We unite scholars from around the world to create meaningful impact through
                collaboration, research, and advocacy. Our members include researchers, educators,
                healthcare professionals, engineers, economists, and experts from various fields.
              </AboutText>
              <AboutText>
                Together, we work towards building a prosperous future through knowledge sharing,
                capacity building, and strategic partnerships with organizations worldwide.
              </AboutText>
            </AboutContent>
          </AboutGrid>
        </Container>
      </Section>

      <Section style={{ background: 'var(--color-neutral-50)' }}>
        <Container>
          <SectionHeader>
            <SectionLabel>Our Purpose</SectionLabel>
            <SectionTitle>Mission & Vision</SectionTitle>
          </SectionHeader>
          <MissionVisionGrid>
            <MissionVisionCard
              $variant="primary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CardIcon>
                <Target size={28} />
              </CardIcon>
              <CardTitle>Our Mission</CardTitle>
              <CardText>
                To mobilize and coordinate the global Tigrayan intellectual community for
                humanitarian assistance, reconstruction, and sustainable development. We aim to
                leverage the expertise of our members to address critical challenges and create
                lasting positive impact.
              </CardText>
            </MissionVisionCard>
            <MissionVisionCard
              $variant="secondary"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardIcon>
                <Eye size={28} />
              </CardIcon>
              <CardTitle>Our Vision</CardTitle>
              <CardText>
                A prosperous, knowledge-driven Tigray where every citizen has access to quality
                education, healthcare, and economic opportunities. We envision a community where
                expertise and innovation drive sustainable progress for generations to come.
              </CardText>
            </MissionVisionCard>
          </MissionVisionGrid>
        </Container>
      </Section>

      <StatsSection>
        <Container>
          <StatsGrid>
            <StatItem>
              <StatValue>5,000+</StatValue>
              <StatLabel>Active Members</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>50+</StatValue>
              <StatLabel>Countries</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>10+</StatValue>
              <StatLabel>Sectoral Clusters</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>12+</StatValue>
              <StatLabel>Years of Impact</StatLabel>
            </StatItem>
          </StatsGrid>
        </Container>
      </StatsSection>

      <Section>
        <Container>
          <SectionHeader>
            <SectionLabel>Our Core Pillars</SectionLabel>
            <SectionTitle>What We Stand For</SectionTitle>
            <SectionDescription>
              Our work is guided by six core pillars that define our approach to
              creating sustainable impact.
            </SectionDescription>
          </SectionHeader>
          <PillarsGrid>
            {pillars.map((pillar, index) => (
              <PillarCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PillarIcon $color={pillar.color}>
                  <pillar.icon size={24} />
                </PillarIcon>
                <PillarTitle>{pillar.title}</PillarTitle>
                <PillarDescription>{pillar.description}</PillarDescription>
              </PillarCard>
            ))}
          </PillarsGrid>
        </Container>
      </Section>

      <Section style={{ background: 'var(--color-neutral-50)' }}>
        <Container>
          <SectionHeader>
            <SectionLabel>Our Values</SectionLabel>
            <SectionTitle>What Drives Us</SectionTitle>
          </SectionHeader>
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
        </Container>
      </Section>
    </>
  );
};
