import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Heart,
  TrendingUp,
  Zap,
  Scale,
  Layers,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
// Card imported but using custom ServiceCard instead
import { useContentStore } from '../../stores/contentStore';

const ServicesSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: var(--color-neutral-50);
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    135deg,
    transparent 0%,
    var(--color-primary-50) 100%
  );
  opacity: 0.5;
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
  color: var(--color-primary-600);
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: var(--color-neutral-500);
  line-height: 1.8;
`;

const ServicesGrid = styled.div`
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

const ServiceCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--color-neutral-100);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-color, var(--color-primary-500));
  }
`;

const ServiceIconWrapper = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  background: ${({ $color }) => $color}15;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  margin-bottom: 1.5rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const ServiceFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--color-neutral-600);

  svg {
    color: var(--color-accent-success);
    flex-shrink: 0;
  }
`;

const ServiceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: gap var(--transition-fast);

  &:hover {
    gap: 0.75rem;
  }
`;

const iconMap: { [key: string]: React.ComponentType<{ size: number }> } = {
  Heart,
  TrendingUp,
  Zap,
  Scale,
  Layers,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const Services = () => {
  const { services } = useContentStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <ServicesSection id="services">
      <BackgroundPattern />
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionLabel>Our Service Clusters</SectionLabel>
          <SectionTitle>Driving Development Across Key Sectors</SectionTitle>
          <SectionDescription>
            Our five specialized clusters bring together experts and resources to
            address critical areas of development, ensuring comprehensive and
            sustainable impact.
          </SectionDescription>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <ServicesGrid>
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Layers;
              return (
                <ServiceCard
                  key={service.id}
                  variants={cardVariants}
                  style={{ '--accent-color': service.color } as React.CSSProperties}
                >
                  <ServiceIconWrapper $color={service.color}>
                    <IconComponent size={28} />
                  </ServiceIconWrapper>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                  <ServiceFeatures>
                    {service.features.slice(0, 4).map((feature, index) => (
                      <ServiceFeatureItem key={index}>
                        <CheckCircle size={16} />
                        {feature}
                      </ServiceFeatureItem>
                    ))}
                  </ServiceFeatures>
                  <ServiceLink href={`/services/${service.id}`}>
                    Learn More <ArrowRight size={16} />
                  </ServiceLink>
                </ServiceCard>
              );
            })}
          </ServicesGrid>
        </motion.div>
      </Container>
    </ServicesSection>
  );
};
