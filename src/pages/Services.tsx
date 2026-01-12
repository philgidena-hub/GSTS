import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  Heart,
  Building2,
  Scale,
  Users,
  GraduationCap,
  Briefcase,
  Globe2,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-neutral-100);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary-100);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ServiceIcon = styled.div<{ $color: string }>`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  @media (max-width: 480px) {
    margin: 0 auto;
  }
`;

const ServiceContent = styled.div``;

const ServiceTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const ServiceLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
  transition: gap 0.3s ease;

  &:hover {
    gap: 0.75rem;
  }
`;

// Featured Service Section
const FeaturedSection = styled.section`
  padding: 5rem 0;
  background: var(--color-neutral-50);
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const FeaturedImage = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
`;

const FeaturedContent = styled.div``;

const FeaturedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const FeaturedListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-neutral-100);

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: var(--color-primary-600);
    flex-shrink: 0;
    margin-top: 2px;
  }
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

const services = [
  {
    icon: Heart,
    title: 'Humanitarian Advocacy',
    description: 'Supporting communities through crisis response, relief efforts, and sustainable humanitarian initiatives that make a lasting difference.',
    color: '#ef4444',
    link: '/services/humanitarian'
  },
  {
    icon: Building2,
    title: 'Reconstruction & Development',
    description: 'Building infrastructure, fostering economic growth, and implementing development projects for lasting prosperity.',
    color: '#0052cc',
    link: '/services/development'
  },
  {
    icon: Scale,
    title: 'Governance & Justice',
    description: 'Promoting transparent governance, advocating for equitable justice systems, and supporting institutional development.',
    color: '#10b981',
    link: '/services/governance'
  },
  {
    icon: Users,
    title: 'Professional Networking',
    description: 'Connecting scholars and professionals worldwide, facilitating knowledge exchange and collaborative opportunities.',
    color: '#d4a012',
    link: '/services/networking'
  },
  {
    icon: GraduationCap,
    title: 'Education & Research',
    description: 'Supporting educational initiatives, research programs, and capacity building for sustainable knowledge transfer.',
    color: '#8b5cf6',
    link: '/services/education'
  },
  {
    icon: Briefcase,
    title: 'Economic Empowerment',
    description: 'Facilitating economic opportunities, entrepreneurship support, and workforce development programs.',
    color: '#ec4899',
    link: '/services/economic'
  },
  {
    icon: Globe2,
    title: 'Diaspora Engagement',
    description: 'Connecting diaspora communities, facilitating cultural exchange, and mobilizing resources for development.',
    color: '#14b8a6',
    link: '/services/diaspora'
  },
  {
    icon: Lightbulb,
    title: 'Innovation & Technology',
    description: 'Leveraging technology for development, supporting innovation initiatives, and digital transformation programs.',
    color: '#f59e0b',
    link: '/services/innovation'
  },
];

const featuredPoints = [
  'Expert consultation and advisory services',
  'Capacity building and training programs',
  'Research and policy development',
  'Community engagement initiatives',
  'Partnership facilitation and networking',
  'Project management and implementation',
];

export const Services = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHero>
        <PageHeroContent>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>/</span>
            <span>Services</span>
          </Breadcrumb>
          <PageTitle>Our Services</PageTitle>
          <PageSubtitle>
            Discover how GSTS leverages the expertise of our global network to
            create meaningful impact through our comprehensive service offerings.
          </PageSubtitle>
        </PageHeroContent>
      </PageHero>

      <Section>
        <Container>
          <SectionHeader>
            <SectionLabel>What We Offer</SectionLabel>
            <SectionTitle>Comprehensive Services for Impact</SectionTitle>
            <SectionDescription>
              Our services are designed to address critical challenges and create
              sustainable solutions across multiple sectors.
            </SectionDescription>
          </SectionHeader>
          <ServicesGrid>
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(service.link)}
              >
                <ServiceIcon $color={service.color}>
                  <service.icon size={30} />
                </ServiceIcon>
                <ServiceContent>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                  <ServiceLink>
                    Learn More <ArrowRight size={14} />
                  </ServiceLink>
                </ServiceContent>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </Section>

      <FeaturedSection>
        <Container>
          <FeaturedGrid>
            <FeaturedImage>
              <img src="/images/photo_6_2026-01-12_07-13-36.jpg" alt="GSTS Services" />
            </FeaturedImage>
            <FeaturedContent>
              <SectionLabel>Why Choose Us</SectionLabel>
              <SectionTitle>Expert Solutions for Complex Challenges</SectionTitle>
              <SectionDescription>
                With a global network of over 5,000 professionals and experts across
                50+ countries, GSTS brings unparalleled expertise and resources to
                every initiative.
              </SectionDescription>
              <FeaturedList>
                {featuredPoints.map((point, index) => (
                  <FeaturedListItem key={index}>
                    <ArrowRight size={16} />
                    <span>{point}</span>
                  </FeaturedListItem>
                ))}
              </FeaturedList>
              <PrimaryButton onClick={() => navigate('/contact')}>
                Get in Touch
                <ArrowRight size={16} />
              </PrimaryButton>
            </FeaturedContent>
          </FeaturedGrid>
        </Container>
      </FeaturedSection>
    </>
  );
};
