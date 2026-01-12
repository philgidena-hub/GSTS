import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const GetInvolvedSection = styled.section`
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 41, 102, 0.75) 0%,
      rgba(0, 61, 153, 0.70) 50%,
      rgba(0, 82, 204, 0.65) 100%
    );
    z-index: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(212, 160, 18, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 3;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const InfoSection = styled(motion.div)``;

const SectionLabel = styled.div`
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-secondary-400);
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.3;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(8px);
  }
`;

const ContactIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ContactContent = styled.div``;

const ContactLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.span`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const FormSection = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.4);
`;

const FormTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 4px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 4px;
  font-size: 0.9375rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--color-primary-600);
  border: none;
  border-radius: 4px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-700);
    transform: translateY(-2px);
  }
`;

const SuccessMessage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--color-accent-success);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-600);
  margin-bottom: 1.5rem;
`;

const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

const contactItems = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+251 123 456 789',
    color: '#10b981',
    href: 'tel:+251123456789',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@gsts.org',
    color: '#0052cc',
    href: 'mailto:info@gsts.org',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Mekelle, Tigray, Ethiopia',
    color: '#ef4444',
    href: '#',
  },
];

export const GetInvolved = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <GetInvolvedSection ref={ref}>
      <BackgroundImage>
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2000&q=80"
          alt=""
        />
      </BackgroundImage>
      <BackgroundPattern />
      <Container>
        <ContentGrid>
          <InfoSection
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel>Get in Touch</SectionLabel>
            <SectionTitle>Ready to Make a Difference?</SectionTitle>
            <SectionDescription>
              Join our global community of scholars and professionals. We'd love
              to hear from you and explore how we can collaborate for meaningful
              impact.
            </SectionDescription>

            <ContactList>
              {contactItems.map((item, index) => (
                <ContactItem key={index} href={item.href}>
                  <ContactIcon $color={item.color}>
                    <item.icon size={22} />
                  </ContactIcon>
                  <ContactContent>
                    <ContactLabel>{item.label}</ContactLabel>
                    <ContactValue>{item.value}</ContactValue>
                  </ContactContent>
                </ContactItem>
              ))}
            </ContactList>
          </InfoSection>

          <FormSection
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {isSubmitted ? (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <SuccessIcon>
                  <CheckCircle2 size={28} />
                </SuccessIcon>
                <SuccessTitle>Message Sent!</SuccessTitle>
                <SuccessText>
                  Thank you for reaching out. We'll get back to you within 24-48 hours.
                </SuccessText>
                <ResetButton onClick={handleReset}>
                  Send Another Message
                  <ArrowRight size={14} />
                </ResetButton>
              </SuccessMessage>
            ) : (
              <>
                <FormTitle>Send Us a Message</FormTitle>
                <FormSubtitle>Fill out the form below and we'll get back to you shortly.</FormSubtitle>

                <Form onSubmit={handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </FormRow>

                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Subject</Label>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Message</Label>
                    <Textarea
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <SubmitButton type="submit">
                    Send Message
                    <Send size={16} />
                  </SubmitButton>
                </Form>
              </>
            )}
          </FormSection>
        </ContentGrid>
      </Container>
    </GetInvolvedSection>
  );
};
