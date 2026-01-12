import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { useContentStore } from '../../stores/contentStore';

const ContactSection = styled.section`
  position: relative;
  padding: var(--spacing-4xl) 0;
  background: linear-gradient(
    135deg,
    rgba(0, 41, 102, 0.95) 0%,
    rgba(0, 51, 128, 0.9) 50%,
    rgba(0, 61, 153, 0.85) 100%
  );
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 41, 102, 0.85) 0%,
      rgba(0, 51, 128, 0.8) 50%,
      rgba(0, 61, 153, 0.75) 100%
    );
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image:
    radial-gradient(
      ellipse at 20% 80%,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 20%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 40%
    );
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
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
  color: var(--color-secondary-400);
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900));
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  color: white;
  position: relative;
  overflow: hidden;
`;

const ContactInfoPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 80% 20%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
`;

const ContactInfoContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ContactInfoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const ContactInfoSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
`;

const ContactItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ContactItemIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ContactItemContent = styled.div``;

const ContactItemLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
`;

const ContactItemValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: white;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SocialLink = styled.a`
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-secondary-500);
    transform: translateY(-2px);
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  border-radius: var(--radius-2xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-neutral-100);
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const FormIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--color-primary-50);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
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

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-accent-success);
  border-radius: var(--radius-lg);
  color: white;
  margin-bottom: 1.5rem;
`;

export const Contact = () => {
  const { contactInfo } = useContentStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <ContactSection id="contact">
      <BackgroundImage>
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          alt=""
          loading="lazy"
        />
      </BackgroundImage>
      <BackgroundPattern />
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <SectionLabel>Contact Us</SectionLabel>
          <SectionTitle>Get in Touch With Us</SectionTitle>
          <SectionDescription>
            Have questions or want to get involved? We'd love to hear from you.
            Reach out to us and we'll respond as soon as possible.
          </SectionDescription>
        </SectionHeader>

        <ContactGrid>
          <ContactInfo
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactInfoPattern />
            <ContactInfoContent>
              <ContactInfoTitle>Contact Information</ContactInfoTitle>
              <ContactInfoSubtitle>
                Reach out to us through any of these channels
              </ContactInfoSubtitle>

              <ContactItems>
                <ContactItem>
                  <ContactItemIcon>
                    <MapPin size={24} />
                  </ContactItemIcon>
                  <ContactItemContent>
                    <ContactItemLabel>Our Location</ContactItemLabel>
                    <ContactItemValue>
                      {contactInfo.address}, {contactInfo.city}
                      <br />
                      {contactInfo.country}
                    </ContactItemValue>
                  </ContactItemContent>
                </ContactItem>

                <ContactItem>
                  <ContactItemIcon>
                    <Mail size={24} />
                  </ContactItemIcon>
                  <ContactItemContent>
                    <ContactItemLabel>Email Us</ContactItemLabel>
                    <ContactItemValue>{contactInfo.email}</ContactItemValue>
                  </ContactItemContent>
                </ContactItem>

                <ContactItem>
                  <ContactItemIcon>
                    <Phone size={24} />
                  </ContactItemIcon>
                  <ContactItemContent>
                    <ContactItemLabel>Call Us</ContactItemLabel>
                    <ContactItemValue>{contactInfo.phone}</ContactItemValue>
                  </ContactItemContent>
                </ContactItem>

                <ContactItem>
                  <ContactItemIcon>
                    <Clock size={24} />
                  </ContactItemIcon>
                  <ContactItemContent>
                    <ContactItemLabel>Working Hours</ContactItemLabel>
                    <ContactItemValue>{contactInfo.workingHours}</ContactItemValue>
                  </ContactItemContent>
                </ContactItem>
              </ContactItems>

              <SocialLinks>
                <SocialLink href="#" aria-label="Facebook">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </SocialLink>
                <SocialLink href="#" aria-label="Twitter">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </SocialLink>
                <SocialLink href="#" aria-label="LinkedIn">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </SocialLink>
                <SocialLink href="#" aria-label="Instagram">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </SocialLink>
              </SocialLinks>
            </ContactInfoContent>
          </ContactInfo>

          <ContactForm
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
          >
            <FormHeader>
              <FormIcon>
                <MessageSquare size={24} />
              </FormIcon>
              <FormTitle>Send us a Message</FormTitle>
            </FormHeader>

            {isSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle size={24} />
                <span>
                  Thank you for your message! We'll get back to you soon.
                </span>
              </SuccessMessage>
            )}

            <FormGrid>
              <Input
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                fullWidth
              />
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
            </FormGrid>

            <FormGrid>
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (234) 567-8900"
                fullWidth
              />
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
                fullWidth
              />
            </FormGrid>

            <FormRow>
              <Textarea
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
                fullWidth
              />
            </FormRow>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<Send size={18} />}
            >
              Send Message
            </Button>
          </ContactForm>
        </ContactGrid>
      </Container>
    </ContactSection>
  );
};
