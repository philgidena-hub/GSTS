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
  Clock,
  Globe2,
  Heart,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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

const FooterMiddle = styled.div`
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
`;

const StatsBar = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-neutral-400);
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

const FooterBottomLinks = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterBottomLink = styled(Link)`
  color: var(--color-neutral-500);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color var(--transition-fast);

  &:hover {
    color: white;
  }
`;

const statsData = [
  { icon: Globe2, value: '50+', label: 'Countries' },
  { icon: Mail, value: '5,000+', label: 'Members' },
  { icon: Clock, value: '10+', label: 'Years' },
  { icon: Heart, value: '100+', label: 'Projects' },
];

export const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <FooterWrapper>
      <ContactBar>
        <ContactBarContent>
          <ContactBarItems>
            <ContactBarItem href="tel:+251123456789">
              <Phone size={16} />
              <span>+251 123 456 789</span>
            </ContactBarItem>
            <ContactBarItem href="mailto:info@gsts.org">
              <Mail size={16} />
              <span>info@gsts.org</span>
            </ContactBarItem>
            <ContactBarItem href="#">
              <MapPin size={16} />
              <span>Mekelle, Tigray, Ethiopia</span>
            </ContactBarItem>
          </ContactBarItems>
          <ContactBarActions>
            <BarSocialLinks>
              <BarSocialLink href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Facebook size={16} />
              </BarSocialLink>
              <BarSocialLink href="https://twitter.com" target="_blank" aria-label="Twitter">
                <Twitter size={16} />
              </BarSocialLink>
              <BarSocialLink href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <Linkedin size={16} />
              </BarSocialLink>
              <BarSocialLink href="https://youtube.com" target="_blank" aria-label="YouTube">
                <Youtube size={16} />
              </BarSocialLink>
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
              <SocialLink href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Facebook size={20} />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" aria-label="Twitter">
                <Twitter size={20} />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" aria-label="Instagram">
                <Instagram size={20} />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <Linkedin size={20} />
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" aria-label="YouTube">
                <Youtube size={20} />
              </SocialLink>
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
                Mekelle, Tigray<br />
                Ethiopia
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <Mail size={20} />
              </ContactIcon>
              <ContactText>
                <strong>Email</strong>
                info@gsts.org
              </ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <Phone size={20} />
              </ContactIcon>
              <ContactText>
                <strong>Phone</strong>
                +251 123 456 789
              </ContactText>
            </ContactItem>

            <NewsletterSection>
              <NewsletterTitle>Subscribe to Newsletter</NewsletterTitle>
              <NewsletterDescription>
                Stay updated with our latest news and events.
              </NewsletterDescription>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <Input
                  type="email"
                  placeholder="Your email"
                  style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none' }}
                />
                <Button type="submit" variant="secondary" size="sm">
                  <ArrowRight size={18} />
                </Button>
              </NewsletterForm>
            </NewsletterSection>
          </FooterColumn>
        </FooterContent>
      </FooterTop>

      <FooterMiddle>
        <StatsBar>
          {statsData.map((stat, index) => (
            <StatItem key={index}>
              <StatIcon>
                <stat.icon size={24} />
              </StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatContent>
            </StatItem>
          ))}
        </StatsBar>
      </FooterMiddle>

      <FooterBottom>
        <FooterBottomContent>
          <Copyright>
            &copy; {new Date().getFullYear()} Global Society of Tigray Scholars and Professionals. All rights reserved.
          </Copyright>
          <FooterBottomLinks>
            <FooterBottomLink to="/privacy">Privacy Policy</FooterBottomLink>
            <FooterBottomLink to="/terms">Terms of Service</FooterBottomLink>
            <FooterBottomLink to="/sitemap">Sitemap</FooterBottomLink>
          </FooterBottomLinks>
        </FooterBottomContent>
      </FooterBottom>
    </FooterWrapper>
  );
};
