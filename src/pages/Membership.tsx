import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Users,
  Globe,
  Award,
  Briefcase,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../stores/authStore';
import { paymentService } from '../services/payment.service';

const PageWrapper = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  position: relative;
  overflow: hidden;
`;

const HeroPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 80%,
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

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroLabel = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-secondary-400);
  margin-bottom: var(--spacing-md);
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
`;

const BenefitsSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: white;
`;

const SectionHeader = styled.div`
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

const BenefitsGrid = styled.div`
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

const BenefitCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);

  &:hover {
    background: white;
    box-shadow: var(--shadow-lg);
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div<{ $color: string }>`
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg);
  background: ${({ $color }) => $color}15;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const BenefitTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const BenefitDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
`;

const PlansSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: var(--color-neutral-50);
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const PlanCard = styled(motion.div)<{ $isPopular?: boolean }>`
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  position: relative;
  border: 2px solid
    ${({ $isPopular }) =>
      $isPopular ? 'var(--color-primary-500)' : 'var(--color-neutral-100)'};
  box-shadow: ${({ $isPopular }) =>
    $isPopular ? 'var(--shadow-xl)' : 'var(--shadow-sm)'};
  transform: ${({ $isPopular }) => ($isPopular ? 'scale(1.05)' : 'none')};

  @media (max-width: 1024px) {
    transform: none;
  }
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: white;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.span`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  font-family: var(--font-display);
`;

const PriceCurrency = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-500);
`;

const PriceInterval = styled.span`
  font-size: 1rem;
  color: var(--color-neutral-500);
`;

const PlanDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  font-size: 0.9375rem;
  color: var(--color-neutral-700);

  svg {
    color: var(--color-accent-success);
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: var(--color-neutral-900);
  background: white;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-neutral-300);
  }

  &:focus {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const SelectLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-neutral-700);
  margin-bottom: 0.5rem;
`;

const SuccessContent = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  background: var(--color-accent-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-500);
  margin-bottom: var(--spacing-lg);
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
  color: #dc2626;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-neutral-200);
    border-top-color: var(--color-primary-600);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const benefits = [
  {
    icon: Users,
    color: 'var(--color-primary-600)',
    title: 'Global Network',
    description: 'Connect with 5,000+ scholars and professionals worldwide.',
  },
  {
    icon: Briefcase,
    color: 'var(--color-secondary-600)',
    title: 'Project Access',
    description: 'Participate in impactful development initiatives.',
  },
  {
    icon: Award,
    color: 'var(--color-accent-success)',
    title: 'Professional Growth',
    description: 'Access exclusive resources and development opportunities.',
  },
  {
    icon: Globe,
    color: '#8b5cf6',
    title: 'Make an Impact',
    description: 'Contribute to meaningful change in your community.',
  },
];

export const Membership = () => {
  const navigate = useNavigate();
  const { plans, submitApplication, fetchPlans, setError } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    organization: '',
    country: '',
    expertise: '',
    motivation: '',
  });

  // Fetch plans from Firebase on component mount
  useEffect(() => {
    const loadPlans = async () => {
      setIsLoadingPlans(true);
      try {
        await fetchPlans();
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setIsLoadingPlans(false);
      }
    };
    loadPlans();
  }, [fetchPlans]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setError(null);

    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
    const isPaidPlan = selectedPlanData && selectedPlanData.price > 0;

    try {
      // Submit application first
      const applicationId = await submitApplication({
        ...formData,
        expertise: formData.expertise.split(',').map((exp) => exp.trim()).filter(Boolean),
        planId: selectedPlan || plans[0]?.id || 'associate',
      });

      // If it's a paid plan and Stripe is configured, redirect to payment
      if (isPaidPlan && paymentService.isConfigured()) {
        setIsProcessingPayment(true);
        try {
          const session = await paymentService.createCheckoutSession({
            planId: selectedPlanData.id,
            planName: selectedPlanData.name,
            price: selectedPlanData.price,
            currency: selectedPlanData.currency || 'usd',
            interval: selectedPlanData.interval,
            customerEmail: formData.email,
            applicationId,
          });

          // Redirect to Stripe Checkout
          if (session.url) {
            window.location.href = session.url;
          } else {
            await paymentService.redirectToCheckout(session.sessionId);
          }
        } catch (paymentError: any) {
          // Payment setup failed, but application was submitted
          console.error('Payment processing not available:', paymentError);
          // Redirect to success page anyway - admin will follow up for payment
          navigate('/membership/success');
        }
      } else {
        // Free plan or Stripe not configured - go to success
        setIsSuccess(true);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profession: '',
      organization: '',
      country: '',
      expertise: '',
      motivation: '',
    });
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroPattern />
        <Container>
          <HeroContent>
            <HeroLabel>Membership</HeroLabel>
            <HeroTitle>Join Our Global Community of Scholars</HeroTitle>
            <HeroDescription>
              Become part of a network of over 5,000 professionals and scholars
              dedicated to driving positive change through knowledge and
              collaboration.
            </HeroDescription>
          </HeroContent>
        </Container>
      </HeroSection>

      <BenefitsSection>
        <Container>
          <SectionHeader>
            <SectionLabel>Why Join GSTS</SectionLabel>
            <SectionTitle>Membership Benefits</SectionTitle>
            <SectionDescription>
              As a member, you'll gain access to exclusive opportunities,
              resources, and a global network of like-minded professionals.
            </SectionDescription>
          </SectionHeader>

          <BenefitsGrid>
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BenefitIcon $color={benefit.color}>
                  <benefit.icon size={28} />
                </BenefitIcon>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
              </BenefitCard>
            ))}
          </BenefitsGrid>
        </Container>
      </BenefitsSection>

      <PlansSection id="plans">
        <Container>
          <SectionHeader>
            <SectionLabel>Membership Plans</SectionLabel>
            <SectionTitle>Choose Your Membership Level</SectionTitle>
            <SectionDescription>
              Select the membership plan that best fits your goals and level of
              involvement.
            </SectionDescription>
          </SectionHeader>

          {isLoadingPlans ? (
            <LoadingSpinner />
          ) : (
          <PlansGrid>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                $isPopular={plan.isPopular}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.isPopular && <PopularBadge>Most Popular</PopularBadge>}
                <PlanHeader>
                  <PlanName>{plan.name}</PlanName>
                  <PlanPrice>
                    <PriceCurrency>$</PriceCurrency>
                    <PriceValue>{plan.price}</PriceValue>
                    <PriceInterval>
                      /{plan.interval === 'lifetime' ? 'once' : plan.interval}
                    </PriceInterval>
                  </PlanPrice>
                  <PlanDescription>{plan.description}</PlanDescription>
                </PlanHeader>

                <PlanFeatures>
                  {plan.features.map((feature, featureIndex) => (
                    <PlanFeature key={featureIndex}>
                      <Check size={18} />
                      {feature}
                    </PlanFeature>
                  ))}
                </PlanFeatures>

                <Button
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  fullWidth
                  rightIcon={<ArrowRight size={18} />}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Get Started
                </Button>
              </PlanCard>
            ))}
          </PlansGrid>
          )}
        </Container>
      </PlansSection>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isSuccess ? undefined : 'Membership Application'}
        size="lg"
      >
        {isSuccess ? (
          <SuccessContent>
            <SuccessIcon>
              <Check size={40} />
            </SuccessIcon>
            <SuccessTitle>Application Submitted!</SuccessTitle>
            <SuccessText>
              Thank you for your interest in joining GSTS. Our membership
              committee will review your application and get back to you within
              5-7 business days.
            </SuccessText>
            <Button variant="primary" onClick={closeModal}>
              Close
            </Button>
          </SuccessContent>
        ) : (
          <form onSubmit={handleSubmit}>
            {submitError && (
              <ErrorMessage>
                <AlertCircle size={18} />
                {submitError}
              </ErrorMessage>
            )}
            <FormGrid>
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                fullWidth
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                fullWidth
              />
            </FormGrid>

            <FormGrid>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                fullWidth
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                fullWidth
              />
            </FormGrid>

            <FormGrid>
              <Input
                label="Profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
                fullWidth
              />
              <Input
                label="Organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your company or institution"
                fullWidth
              />
            </FormGrid>

            <FormRow>
              <SelectWrapper>
                <SelectLabel>Country</SelectLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select your country</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </Select>
              </SelectWrapper>
            </FormRow>

            <FormRow>
              <Input
                label="Areas of Expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                placeholder="e.g., Education, Healthcare, Technology (comma-separated)"
                helperText="Enter your expertise areas separated by commas"
                fullWidth
              />
            </FormRow>

            <FormRow>
              <Textarea
                label="Motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Tell us why you want to join GSTS and how you plan to contribute..."
                required
                fullWidth
              />
            </FormRow>

            {(() => {
              const selectedPlanData = plans.find((p) => p.id === selectedPlan);
              const isPaidPlan = selectedPlanData && selectedPlanData.price > 0;
              return (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting || isProcessingPayment}
                  rightIcon={isPaidPlan ? <CreditCard size={18} /> : <ArrowRight size={18} />}
                >
                  {isProcessingPayment
                    ? 'Redirecting to Payment...'
                    : isPaidPlan
                    ? `Submit & Pay ${paymentService.formatPrice(selectedPlanData.price)}`
                    : 'Submit Application'}
                </Button>
              );
            })()}
          </form>
        )}
      </Modal>
    </PageWrapper>
  );
};
