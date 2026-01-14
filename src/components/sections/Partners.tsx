import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const Section = styled.section`
  padding: 4rem 0;
  background: var(--color-neutral-50);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionLabel = styled.div`
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-secondary-600);
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;

  /* Gradient fade on edges */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 150px;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, var(--color-neutral-50) 0%, transparent 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, var(--color-neutral-50) 0%, transparent 100%);
  }
`;

const SliderTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  width: max-content;
  animation: ${scroll} 30s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const PartnerItemWrapper = styled.div`
  position: relative;
  padding-bottom: 2rem;
`;

const PartnerItem = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 1rem 2rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Target the logo on hover */
  &:hover img {
    filter: grayscale(0%);
    opacity: 1;
  }

  /* Target the name on hover */
  &:hover + span {
    opacity: 1;
  }
`;

const PartnerLogo = styled.img`
  max-height: 50px;
  max-width: 140px;
  width: auto;
  height: auto;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s ease;

  /* Improve rendering of low-res images */
  image-rendering: -webkit-optimize-contrast;
`;

const PartnerName = styled.span`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--color-neutral-500);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

// Partner data
const partners = [
  {
    name: 'Mekelle University',
    logo: '/partner logos/mu_logo_mini.png',
  },
  {
    name: 'Adigrat University',
    logo: '/partner logos/Adigrat_Uni-removebg-preview-1.png',
  },
  {
    name: 'Axum University',
    logo: '/partner logos/Axum university.png',
  },
  {
    name: 'Tigray Development Association',
    logo: '/partner logos/cropped-Site_Logo-removebg-preview.png',
  },
  {
    name: 'Smatrics',
    logo: '/partner logos/Smatrics.png',
  },
];

export const Partners = () => {
  // Duplicate partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionLabel>Our Network</SectionLabel>
          <SectionTitle>Partners & Institutions</SectionTitle>
        </SectionHeader>
      </Container>

      <SliderWrapper>
        <SliderTrack>
          {duplicatedPartners.map((partner, index) => (
            <PartnerItemWrapper key={`${partner.name}-${index}`}>
              <PartnerItem>
                <PartnerLogo
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                />
              </PartnerItem>
              <PartnerName>{partner.name}</PartnerName>
            </PartnerItemWrapper>
          ))}
        </SliderTrack>
      </SliderWrapper>
    </Section>
  );
};
