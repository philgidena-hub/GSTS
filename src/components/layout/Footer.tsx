import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useContentStore } from '../../stores/contentStore';
import { membershipService } from '../../services/membership.service';

const FooterWrapper = styled.footer`
  background: linear-gradient(180deg, var(--color-neutral-900) 0%, var(--color-neutral-950) 100%);
  color: white;
`;

// Contact Bar
const ContactBar = styled.div`
  background: linear-gradient(90deg, var(--color-primary-700) 0%, var(--color-primary-600) 100%);
  padding: 1rem 1.5rem;
`;

const ContactBarContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

const ContactBarItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1.5rem;
  }
`;

const ContactBarItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-secondary-400);
  }

  svg {
    flex-shrink: 0;
  }
`;

const ContactBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarSocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BarSocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-secondary-500);
    transform: scale(1.1);
  }
`;

const FooterTop = styled.div`
  padding: var(--spacing-4xl) var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: var(--spacing-3xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  margin-bottom: var(--spacing-lg);
`;

const LogoImage = styled.img`
  height: 48px;
  width: auto;
  filter: brightness(0) invert(1);
`;

const FooterDescription = styled.p`
  color: var(--color-neutral-400);
  font-size: 0.9375rem;
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: white;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-600);
    border-color: var(--color-primary-600);
    transform: translateY(-3px);
  }
`;

const FooterTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: var(--spacing-lg);
  position: relative;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: var(--color-secondary-500);
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: var(--color-neutral-400);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;

  &::before {
    content: '›';
    color: var(--color-secondary-500);
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.2s ease;
  }

  &:hover {
    color: white;
    transform: translateX(5px);

    &::before {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ContactIcon = styled.div`
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-secondary-500);
`;

const ContactText = styled.div`
  color: var(--color-neutral-400);
  font-size: 0.9375rem;
  line-height: 1.5;

  strong {
    color: white;
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 600;
  }
`;

const NewsletterSection = styled.div`
  margin-top: var(--spacing-xl);
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const NewsletterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const NewsletterDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-400);
  margin-bottom: 1rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const FooterBottom = styled.div`
  padding: var(--spacing-xl) var(--spacing-lg);
`;

const FooterBottomContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--color-neutral-500);
  font-size: 0.875rem;
  margin: 0;
`;

const DesignedBy = styled.p`
  color: var(--color-neutral-500);
  font-size: 0.875rem;
  margin: 0;

  a {
    color: var(--color-secondary-500);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-secondary-400);
    }
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md);
  color: #10b981;
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: #ef4444;
  font-size: 0.875rem;
`;

export const Footer = () => {
  const { contactInfo, settings } = useContentStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await membershipService.subscribeNewsletter(email);
      setIsSubscribed(true);
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription failed:', err);
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FooterWrapper>
      <ContactBar>
        <ContactBarContent>
          <ContactBarItems>
            <ContactBarItem href={`tel:${contactInfo.phone}`}>
              <Phone size={16} />
              <span>{contactInfo.phone}</span>
            </ContactBarItem>
            <ContactBarItem href={`mailto:${contactInfo.email}`}>
              <Mail size={16} />
              <span>{contactInfo.email}</span>
            </ContactBarItem>
            <ContactBarItem href="#">
              <MapPin size={16} />
              <span>{contactInfo.city}, {contactInfo.country}</span>
            </ContactBarItem>
          </ContactBarItems>
          <ContactBarActions>
            <BarSocialLinks>
              {settings.social.facebook && (
                <BarSocialLink href={settings.social.facebook} target="_blank" aria-label="Facebook">
                  <Facebook size={16} />
                </BarSocialLink>
              )}
              {settings.social.twitter && (
                <BarSocialLink href={settings.social.twitter} target="_blank" aria-label="Twitter">
                  <Twitter size={16} />
                </BarSocialLink>
              )}
              {settings.social.linkedin && (
                <BarSocialLink href={settings.social.linkedin} target="_blank" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </BarSocialLink>
              )}
              {settings.social.youtube && (
                <BarSocialLink href={settings.social.youtube} target="_blank" aria-label="YouTube">
                  <Youtube size={16} />
                </BarSocialLink>
              )}
            </BarSocialLinks>
          </ContactBarActions>
        </ContactBarContent>
      </ContactBar>

      <FooterTop>
        <FooterContent>
          <FooterColumn>
            <FooterLogo to="/">
              <LogoImage src="/images/logo-gsts.png" alt="GSTS Logo" />
            </FooterLogo>
            <FooterDescription>
              The Global Society of Tigray Scholars and Professionals is a
              not-for-profit global knowledge network dedicated to
              knowledge-driven solutions for Tigray's development and
              reconstruction.
            </FooterDescription>
            <SocialLinks>
              {settings.social.facebook && (
                <SocialLink href={settings.social.facebook} target="_blank" aria-label="Facebook">
                  <Facebook size={20} />
                </SocialLink>
              )}
              {settings.social.twitter && (
                <SocialLink href={settings.social.twitter} target="_blank" aria-label="Twitter">
                  <Twitter size={20} />
                </SocialLink>
              )}
              {settings.social.instagram && (
                <SocialLink href={settings.social.instagram} target="_blank" aria-label="Instagram">
                  <Instagram size={20} />
                </SocialLink>
              )}
              {settings.social.linkedin && (
                <SocialLink href={settings.social.linkedin} target="_blank" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </SocialLink>
              )}
              {settings.social.youtube && (
                <SocialLink href={settings.social.youtube} target="_blank" aria-label="YouTube">
                  <Youtube size={20} />
                </SocialLink>
              )}
            </SocialLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink to="/about">About Us</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/services">Our Services</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/projects">Projects</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/news">News & Blog</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/membership">Membership</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/contact">Contact Us</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Support</FooterTitle>
            <FooterLinks>
              <FooterLinkItem>
                <FooterLink to="/faq">FAQs</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/careers">Careers</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/donate">Donate</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/volunteer">Volunteer</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </FooterLinkItem>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterTitle>Contact Us</FooterTitle>
            <ContactItem>
              <ContactIcon>
                <MapPin size={20} />
              </ContactIcon>
              <ContactText>
                <strong>Address</strong>
                {contactInfo.address}<br />
                {contactInfo.city}, {contactInfo.country}
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <Mail size={20} />
              </ContactIcon>
              <ContactText>
                <strong>Email</strong>
                {contactInfo.email}
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <Phone size={20} />
              </ContactIcon>
              <ContactText>
                <strong>Phone</strong>
                {contactInfo.phone}
              </ContactText>
            </ContactItem>

            <NewsletterSection>
              <NewsletterTitle>Subscribe to Newsletter</NewsletterTitle>
              <NewsletterDescription>
                Stay updated with our latest news and events.
              </NewsletterDescription>
              {isSubscribed ? (
                <SuccessMessage>
                  <Check size={16} />
                  Thank you for subscribing!
                </SuccessMessage>
              ) : (
                <>
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                  <NewsletterForm onSubmit={handleNewsletterSubmit}>
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none' }}
                    />
                    <Button type="submit" variant="secondary" size="sm" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    </Button>
                  </NewsletterForm>
                </>
              )}
            </NewsletterSection>
          </FooterColumn>
        </FooterContent>
      </FooterTop>

      <FooterBottom>
        <FooterBottomContent>
          <Copyright>
            &copy; {new Date().getFullYear()} Global Society of Tigray Scholars and Professionals. All rights reserved.
          </Copyright>
          <DesignedBy>
            Designed by <a href="https://wezete.net" target="_blank" rel="noopener noreferrer">Wezete Technology</a>
          </DesignedBy>
        </FooterBottomContent>
      </FooterBottom>
    </FooterWrapper>
  );
};
