import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ContactInfo = styled.div``;

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
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const SectionDescription = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ContactList = styled.div`
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

const ContactIcon = styled.div<{ $color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ContactContent = styled.div``;

const ContactLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-neutral-400);
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-neutral-800);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialLink = styled.a`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-600);
    color: white;
  }
`;

// Form Section
const FormCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 4px 30px -4px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-neutral-100);
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
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 6px;
  font-size: 0.9375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 6px;
  font-size: 0.9375rem;
  min-height: 150px;
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
  border-radius: 6px;
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
  padding: 3rem 2rem;
`;

const SuccessIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--color-accent-success);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

// Map Section
const MapSection = styled.section`
  padding: 0 0 5rem;
`;

const MapContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const MapWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  height: 400px;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapPlaceholder = styled.div`
  text-align: center;
  color: var(--color-neutral-500);

  svg {
    margin-bottom: 1rem;
    color: var(--color-neutral-400);
  }
`;

const contactItems = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+251 123 456 789',
    color: '#10b981',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@gsts.org',
    color: '#0052cc',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Mekelle, Tigray, Ethiopia',
    color: '#ef4444',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: 'Mon - Fri: 9:00 AM - 6:00 PM',
    color: '#d4a012',
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <>
      <PageHero>
        <PageHeroContent>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>/</span>
            <span>Contact</span>
          </Breadcrumb>
          <PageTitle>Contact Us</PageTitle>
          <PageSubtitle>
            Get in touch with us. We'd love to hear from you and explore how
            we can collaborate.
          </PageSubtitle>
        </PageHeroContent>
      </PageHero>

      <Section>
        <Container>
          <ContactGrid>
            <ContactInfo>
              <SectionLabel>Get in Touch</SectionLabel>
              <SectionTitle>We'd Love to Hear From You</SectionTitle>
              <SectionDescription>
                Whether you have a question, want to collaborate, or are interested
                in joining GSTS, we're here to help. Reach out to us through any of
                the following channels.
              </SectionDescription>

              <ContactList>
                {contactItems.map((item, index) => (
                  <ContactItem key={index}>
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

              <SectionLabel>Follow Us</SectionLabel>
              <SocialLinks>
                <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} />
                </SocialLink>
                <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter size={20} />
                </SocialLink>
                <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </SocialLink>
                <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                </SocialLink>
              </SocialLinks>
            </ContactInfo>

            <FormCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isSubmitted ? (
                <SuccessMessage
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SuccessIcon>
                    <CheckCircle2 size={32} />
                  </SuccessIcon>
                  <SuccessTitle>Message Sent!</SuccessTitle>
                  <SuccessText>
                    Thank you for reaching out. We've received your message and will
                    get back to you within 24-48 hours.
                  </SuccessText>
                  <SubmitButton onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </SubmitButton>
                </SuccessMessage>
              ) : (
                <>
                  <FormTitle>Send Us a Message</FormTitle>
                  <FormSubtitle>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </FormSubtitle>

                  <Form onSubmit={handleSubmit}>
                    <FormRow>
                      <FormGroup>
                        <Label>First Name *</Label>
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
                        <Label>Last Name *</Label>
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

                    <FormRow>
                      <FormGroup>
                        <Label>Email *</Label>
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
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="+1 234 567 890"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </FormRow>

                    <FormGroup>
                      <Label>Subject *</Label>
                      <Select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="membership">Membership</option>
                        <option value="partnership">Partnership</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Message *</Label>
                      <Textarea
                        name="message"
                        placeholder="Tell us how we can help you..."
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
            </FormCard>
          </ContactGrid>
        </Container>
      </Section>

      <MapSection>
        <MapContainer>
          <MapWrapper>
            <MapPlaceholder>
              <MapPin size={48} />
              <p>Map integration available</p>
            </MapPlaceholder>
          </MapWrapper>
        </MapContainer>
      </MapSection>
    </>
  );
};
