import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import { useContentStore } from '../../stores/contentStore';

const FooterWrapper = styled.footer`
  background: #1a1f2e;
  color: white;
`;

// Top Contact Bar
const TopContactBar = styled.div`
  background: #252b3b;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const TopContactContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const SocialLinksTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SocialLinkCircle = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-secondary-500);
    border-color: var(--color-secondary-500);
    transform: scale(1.1);
  }
`;

const ContactItems = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 2rem;
    justify-content: center;
  }
`;

const ContactItemTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ContactIconBox = styled.div<{ $color?: string }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || '#4ade80'};

  svg {
    stroke-width: 1.5;
  }
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.a`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-secondary-400);
  }
`;

// Main Footer Content
const FooterMain = styled.div`
  padding: 4rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath fill='%23ffffff' fill-opacity='0.03' d='M0 300c50-20 100-40 150-35 50 5 100 35 150 45s100 0 150-15 100-40 150-45 100 10 150 25 100 30 150 25 100-30 150-45 100-15 150 0v345H0z'/%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const WorldMapBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='100' cy='150' r='2'/%3E%3Ccircle cx='120' cy='140' r='2'/%3E%3Ccircle cx='140' cy='160' r='2'/%3E%3Ccircle cx='160' cy='145' r='2'/%3E%3Ccircle cx='180' cy='155' r='2'/%3E%3Ccircle cx='200' cy='140' r='2'/%3E%3Ccircle cx='220' cy='150' r='2'/%3E%3Ccircle cx='240' cy='165' r='2'/%3E%3Ccircle cx='260' cy='155' r='2'/%3E%3Ccircle cx='280' cy='145' r='2'/%3E%3Ccircle cx='300' cy='160' r='2'/%3E%3Ccircle cx='320' cy='150' r='2'/%3E%3Ccircle cx='340' cy='140' r='2'/%3E%3Ccircle cx='360' cy='155' r='2'/%3E%3Ccircle cx='380' cy='165' r='2'/%3E%3Ccircle cx='400' cy='150' r='2'/%3E%3Ccircle cx='420' cy='145' r='2'/%3E%3Ccircle cx='440' cy='160' r='2'/%3E%3Ccircle cx='460' cy='155' r='2'/%3E%3Ccircle cx='480' cy='140' r='2'/%3E%3Ccircle cx='500' cy='150' r='2'/%3E%3Ccircle cx='520' cy='165' r='2'/%3E%3Ccircle cx='540' cy='155' r='2'/%3E%3Ccircle cx='560' cy='145' r='2'/%3E%3Ccircle cx='580' cy='160' r='2'/%3E%3Ccircle cx='600' cy='150' r='2'/%3E%3Ccircle cx='620' cy='140' r='2'/%3E%3Ccircle cx='640' cy='155' r='2'/%3E%3Ccircle cx='660' cy='165' r='2'/%3E%3Ccircle cx='680' cy='150' r='2'/%3E%3Ccircle cx='700' cy='145' r='2'/%3E%3Ccircle cx='720' cy='160' r='2'/%3E%3Ccircle cx='740' cy='155' r='2'/%3E%3Ccircle cx='760' cy='140' r='2'/%3E%3Ccircle cx='780' cy='150' r='2'/%3E%3Ccircle cx='800' cy='165' r='2'/%3E%3Ccircle cx='820' cy='155' r='2'/%3E%3Ccircle cx='840' cy='145' r='2'/%3E%3Ccircle cx='860' cy='160' r='2'/%3E%3Ccircle cx='880' cy='150' r='2'/%3E%3Ccircle cx='900' cy='140' r='2'/%3E%3Ccircle cx='150' cy='200' r='2'/%3E%3Ccircle cx='170' cy='210' r='2'/%3E%3Ccircle cx='190' cy='195' r='2'/%3E%3Ccircle cx='210' cy='205' r='2'/%3E%3Ccircle cx='230' cy='220' r='2'/%3E%3Ccircle cx='250' cy='200' r='2'/%3E%3Ccircle cx='270' cy='190' r='2'/%3E%3Ccircle cx='290' cy='215' r='2'/%3E%3Ccircle cx='310' cy='205' r='2'/%3E%3Ccircle cx='330' cy='195' r='2'/%3E%3Ccircle cx='350' cy='210' r='2'/%3E%3Ccircle cx='370' cy='200' r='2'/%3E%3Ccircle cx='390' cy='220' r='2'/%3E%3Ccircle cx='410' cy='195' r='2'/%3E%3Ccircle cx='430' cy='205' r='2'/%3E%3Ccircle cx='450' cy='215' r='2'/%3E%3Ccircle cx='470' cy='200' r='2'/%3E%3Ccircle cx='490' cy='210' r='2'/%3E%3Ccircle cx='510' cy='195' r='2'/%3E%3Ccircle cx='530' cy='205' r='2'/%3E%3Ccircle cx='550' cy='220' r='2'/%3E%3Ccircle cx='570' cy='200' r='2'/%3E%3Ccircle cx='590' cy='190' r='2'/%3E%3Ccircle cx='610' cy='215' r='2'/%3E%3Ccircle cx='630' cy='205' r='2'/%3E%3Ccircle cx='650' cy='195' r='2'/%3E%3Ccircle cx='670' cy='210' r='2'/%3E%3Ccircle cx='690' cy='200' r='2'/%3E%3Ccircle cx='710' cy='220' r='2'/%3E%3Ccircle cx='730' cy='195' r='2'/%3E%3Ccircle cx='750' cy='205' r='2'/%3E%3Ccircle cx='770' cy='215' r='2'/%3E%3Ccircle cx='790' cy='200' r='2'/%3E%3Ccircle cx='810' cy='210' r='2'/%3E%3Ccircle cx='830' cy='195' r='2'/%3E%3Ccircle cx='850' cy='205' r='2'/%3E%3Ccircle cx='200' cy='250' r='2'/%3E%3Ccircle cx='220' cy='260' r='2'/%3E%3Ccircle cx='240' cy='245' r='2'/%3E%3Ccircle cx='260' cy='255' r='2'/%3E%3Ccircle cx='280' cy='270' r='2'/%3E%3Ccircle cx='300' cy='250' r='2'/%3E%3Ccircle cx='320' cy='240' r='2'/%3E%3Ccircle cx='340' cy='265' r='2'/%3E%3Ccircle cx='360' cy='255' r='2'/%3E%3Ccircle cx='380' cy='245' r='2'/%3E%3Ccircle cx='400' cy='260' r='2'/%3E%3Ccircle cx='420' cy='250' r='2'/%3E%3Ccircle cx='440' cy='270' r='2'/%3E%3Ccircle cx='460' cy='245' r='2'/%3E%3Ccircle cx='480' cy='255' r='2'/%3E%3Ccircle cx='500' cy='265' r='2'/%3E%3Ccircle cx='520' cy='250' r='2'/%3E%3Ccircle cx='540' cy='260' r='2'/%3E%3Ccircle cx='560' cy='245' r='2'/%3E%3Ccircle cx='580' cy='255' r='2'/%3E%3Ccircle cx='600' cy='270' r='2'/%3E%3Ccircle cx='620' cy='250' r='2'/%3E%3Ccircle cx='640' cy='240' r='2'/%3E%3Ccircle cx='660' cy='265' r='2'/%3E%3Ccircle cx='680' cy='255' r='2'/%3E%3Ccircle cx='700' cy='245' r='2'/%3E%3Ccircle cx='720' cy='260' r='2'/%3E%3Ccircle cx='740' cy='250' r='2'/%3E%3Ccircle cx='760' cy='270' r='2'/%3E%3Ccircle cx='780' cy='245' r='2'/%3E%3Ccircle cx='800' cy='255' r='2'/%3E%3Ccircle cx='250' cy='300' r='2'/%3E%3Ccircle cx='270' cy='310' r='2'/%3E%3Ccircle cx='290' cy='295' r='2'/%3E%3Ccircle cx='310' cy='305' r='2'/%3E%3Ccircle cx='330' cy='320' r='2'/%3E%3Ccircle cx='350' cy='300' r='2'/%3E%3Ccircle cx='370' cy='290' r='2'/%3E%3Ccircle cx='390' cy='315' r='2'/%3E%3Ccircle cx='410' cy='305' r='2'/%3E%3Ccircle cx='430' cy='295' r='2'/%3E%3Ccircle cx='450' cy='310' r='2'/%3E%3Ccircle cx='470' cy='300' r='2'/%3E%3Ccircle cx='490' cy='320' r='2'/%3E%3Ccircle cx='510' cy='295' r='2'/%3E%3Ccircle cx='530' cy='305' r='2'/%3E%3Ccircle cx='550' cy='315' r='2'/%3E%3Ccircle cx='570' cy='300' r='2'/%3E%3Ccircle cx='590' cy='310' r='2'/%3E%3Ccircle cx='610' cy='295' r='2'/%3E%3Ccircle cx='630' cy='305' r='2'/%3E%3Ccircle cx='650' cy='320' r='2'/%3E%3Ccircle cx='670' cy='300' r='2'/%3E%3Ccircle cx='690' cy='290' r='2'/%3E%3Ccircle cx='710' cy='315' r='2'/%3E%3Ccircle cx='730' cy='305' r='2'/%3E%3Ccircle cx='750' cy='295' r='2'/%3E%3C/g%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
`;

const FooterContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr 1.5fr;
  gap: 2.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 1.5rem;
`;

const LogoImage = styled.img`
  height: 60px;
  width: auto;
`;

const LogoText = styled.span`
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-secondary-500);
`;

const FooterDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9375rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const AboutButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 2rem;
  background: var(--color-primary-700);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-600);
    transform: translateY(-2px);
  }
`;

const FooterTitle = styled.h4`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  position: relative;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 0.875rem;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-secondary-400);
    padding-left: 5px;
  }
`;

// Blog Posts Section
const BlogPostItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
`;

const BlogPostImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const BlogPostContent = styled.div`
  flex: 1;
`;

const BlogPostTitle = styled.h5`
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-secondary-400);
  }
`;

const BlogPostDate = styled.span`
  font-size: 0.8125rem;
  color: var(--color-secondary-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Newsletter Section
const NewsletterDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9375rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const NewsletterForm = styled.form`
  position: relative;
`;

const NewsletterInput = styled.input`
  width: 100%;
  padding: 1rem 3.5rem 1rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  font-size: 0.9375rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    outline: none;
    border-color: var(--color-secondary-500);
  }
`;

const NewsletterButton = styled.button`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: var(--color-primary-600);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-500);
  }
`;

// Footer Bottom
const FooterBottom = styled.div`
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterBottomContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterBottomLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const FooterBottomLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-secondary-400);
  }
`;

const Separator = styled.span`
  color: rgba(255, 255, 255, 0.3);
`;

const DesignedBy = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  margin: 0;

  a {
    color: var(--color-secondary-500);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Footer = () => {
  const navigate = useNavigate();
  const { contactInfo, settings, blogPosts } = useContentStore();

  // Get 2 recent blog posts
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <FooterWrapper>
      {/* Top Contact Bar */}
      <TopContactBar>
        <TopContactContent>
          <SocialLinksTop>
            {settings.social.facebook && (
              <SocialLinkCircle href={settings.social.facebook} target="_blank" aria-label="Facebook">
                <Facebook size={18} />
              </SocialLinkCircle>
            )}
            {settings.social.twitter && (
              <SocialLinkCircle href={settings.social.twitter} target="_blank" aria-label="Twitter">
                <Twitter size={18} />
              </SocialLinkCircle>
            )}
            {settings.social.instagram && (
              <SocialLinkCircle href={settings.social.instagram} target="_blank" aria-label="Instagram">
                <Instagram size={18} />
              </SocialLinkCircle>
            )}
          </SocialLinksTop>

          <ContactItems>
            <ContactItemTop>
              <ContactIconBox $color="#4ade80">
                <Phone size={24} />
              </ContactIconBox>
              <ContactDetails>
                <ContactLabel>Phone Number</ContactLabel>
                <ContactValue href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</ContactValue>
              </ContactDetails>
            </ContactItemTop>

            <ContactItemTop>
              <ContactIconBox $color="#4ade80">
                <Mail size={24} />
              </ContactIconBox>
              <ContactDetails>
                <ContactLabel>Email Address</ContactLabel>
                <ContactValue href={`mailto:${contactInfo.email}`}>{contactInfo.email}</ContactValue>
              </ContactDetails>
            </ContactItemTop>

            <ContactItemTop>
              <ContactIconBox $color="#ef4444">
                <MapPin size={24} />
              </ContactIconBox>
              <ContactDetails>
                <ContactLabel>Our Address</ContactLabel>
                <ContactValue as="span">{contactInfo.city}, {contactInfo.country}</ContactValue>
              </ContactDetails>
            </ContactItemTop>
          </ContactItems>
        </TopContactContent>
      </TopContactBar>

      {/* Main Footer */}
      <FooterMain>
        <WorldMapBg />
        <FooterContainer>
          <FooterGrid>
            {/* Logo Column */}
            <FooterColumn>
              <FooterLogo to="/">
                <LogoImage src="/images/logo-gsts.png" alt="GSTS Logo" />
                <LogoText>GSTS</LogoText>
              </FooterLogo>
              <FooterDescription>
                The Global Society of Tigray Scholars and Professionals is a not-for-profit global knowledge network dedicated to knowledge-driven solutions for Tigray's development.
              </FooterDescription>
              <AboutButton to="/about">About Us</AboutButton>
            </FooterColumn>

            {/* Useful Links Column 1 */}
            <FooterColumn>
              <FooterTitle>Useful Link</FooterTitle>
              <FooterLinks>
                <FooterLinkItem>
                  <FooterLink to="/">Home</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/services">Services</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/news">Blog</FooterLink>
                </FooterLinkItem>
              </FooterLinks>
            </FooterColumn>

            {/* Useful Links Column 2 */}
            <FooterColumn>
              <FooterTitle>&nbsp;</FooterTitle>
              <FooterLinks>
                <FooterLinkItem>
                  <FooterLink to="/about">About Us</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/projects">Projects</FooterLink>
                </FooterLinkItem>
                <FooterLinkItem>
                  <FooterLink to="/contact">Contact Us</FooterLink>
                </FooterLinkItem>
              </FooterLinks>
            </FooterColumn>

            {/* Blog Posts Column */}
            <FooterColumn>
              <FooterTitle>Blogs & Articles</FooterTitle>
              {recentPosts.map((post) => (
                <BlogPostItem key={post.id} onClick={() => navigate(`/news/${post.slug}`)}>
                  <BlogPostImage src={post.authorImage || post.image} alt={post.title} />
                  <BlogPostContent>
                    <BlogPostTitle>{post.title}</BlogPostTitle>
                    <BlogPostDate>{formatDate(post.date)}</BlogPostDate>
                  </BlogPostContent>
                </BlogPostItem>
              ))}
            </FooterColumn>

            {/* Newsletter Column */}
            <FooterColumn>
              <FooterTitle>Our Newsletter</FooterTitle>
              <NewsletterDescription>
                Stay updated with our latest news, events, and initiatives by subscribing to our newsletter.
              </NewsletterDescription>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput type="email" placeholder="Your email" />
                <NewsletterButton type="submit">
                  <Send size={18} />
                </NewsletterButton>
              </NewsletterForm>
            </FooterColumn>
          </FooterGrid>
        </FooterContainer>
      </FooterMain>

      {/* Footer Bottom */}
      <FooterBottom>
        <FooterBottomContent>
          <FooterBottomLinks>
            <FooterBottomLink to="/privacy">Privacy & Policy</FooterBottomLink>
            <Separator>•</Separator>
            <FooterBottomLink to="/terms">Conditions</FooterBottomLink>
          </FooterBottomLinks>
          <DesignedBy>
            Designed by <a href="https://wezete.net" target="_blank" rel="noopener noreferrer">Wezete Technology</a>. All rights reserved.
          </DesignedBy>
        </FooterBottomContent>
      </FooterBottom>
    </FooterWrapper>
  );
};
