import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Users, Globe, Award } from 'lucide-react';
import { Button } from '../ui/Button';

const CTASection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(
    135deg,
    var(--color-primary-900) 0%,
    var(--color-primary-700) 50%,
    var(--color-secondary-700) 100%
  );
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 10% 90%,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 90% 10%,
    rgba(255, 255, 255, 0.08) 0%,
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

const CTAContent = styled(motion.div)`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const CTALabel = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-secondary-400);
  margin-bottom: var(--spacing-md);
`;

const CTATitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: var(--spacing-xl);
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: var(--spacing-3xl);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const CTAStat = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary-400);
`;

const StatContent = styled.div`
  text-align: left;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
`;

export const CTA = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <CTASection>
      <BackgroundPattern />
      <Container>
        <CTAContent
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <CTALabel>Join Our Community</CTALabel>
          <CTATitle>
            Be Part of the Global Movement for Change
          </CTATitle>
          <CTADescription>
            Join over 5,000 scholars and professionals who are making a
            difference. Together, we can drive sustainable development and
            create lasting impact through knowledge and collaboration.
          </CTADescription>

          <CTAButtons>
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => navigate('/membership')}
            >
              Become a Member
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/donate')}
              style={{
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
              }}
            >
              Support Our Work
            </Button>
          </CTAButtons>

          <CTAStats>
            <CTAStat
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatIcon>
                <Users size={28} />
              </StatIcon>
              <StatContent>
                <StatValue>5,000+</StatValue>
                <StatLabel>Active Members</StatLabel>
              </StatContent>
            </CTAStat>

            <CTAStat
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StatIcon>
                <Globe size={28} />
              </StatIcon>
              <StatContent>
                <StatValue>50+</StatValue>
                <StatLabel>Countries</StatLabel>
              </StatContent>
            </CTAStat>

            <CTAStat
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatIcon>
                <Award size={28} />
              </StatIcon>
              <StatContent>
                <StatValue>12+</StatValue>
                <StatLabel>Active Projects</StatLabel>
              </StatContent>
            </CTAStat>
          </CTAStats>
        </CTAContent>
      </Container>
    </CTASection>
  );
};
