import { useState } from 'react';
import styled from '@emotion/styled';
import { Save, RefreshCw, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';

const PageWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled(Card)`
  padding: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--color-primary-600);
  }
`;

const FormGrid = styled.div`
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

const SocialInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SocialIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const FullWidthCard = styled(SettingsCard)`
  grid-column: 1 / -1;
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: var(--color-accent-success);
  color: white;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DangerZone = styled.div`
  border: 1px solid var(--color-accent-error);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
`;

const DangerTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent-error);
  margin-bottom: 0.5rem;
`;

const DangerText = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  margin-bottom: 1rem;
`;

export const SiteSettings = () => {
  const { settings, contactInfo, updateSettings, updateContactInfo, resetToDefaults } = useContentStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: settings.siteName,
    tagline: settings.tagline,
  });

  const [seoSettings, setSeoSettings] = useState({
    title: settings.seo.title,
    description: settings.seo.description,
    keywords: settings.seo.keywords.join(', '),
  });

  const [contact, setContact] = useState({
    address: contactInfo.address,
    city: contactInfo.city,
    country: contactInfo.country,
    email: contactInfo.email,
    phone: contactInfo.phone,
    workingHours: contactInfo.workingHours,
  });

  const [social, setSocial] = useState({
    facebook: settings.social.facebook,
    twitter: settings.social.twitter,
    instagram: settings.social.instagram,
    linkedin: settings.social.linkedin,
    youtube: settings.social.youtube,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateSettings({
      siteName: generalSettings.siteName,
      tagline: generalSettings.tagline,
      social,
      seo: {
        title: seoSettings.title,
        description: seoSettings.description,
        keywords: seoSettings.keywords.split(',').map((k) => k.trim()),
      },
    });

    updateContactInfo(contact);

    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Site Settings</Title>
        <Actions>
          <Button
            variant="primary"
            leftIcon={<Save size={18} />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </Actions>
      </Header>

      {showSuccess && (
        <SuccessMessage>
          <Save size={18} />
          Settings saved successfully!
        </SuccessMessage>
      )}

      <SettingsGrid>
        <SettingsCard variant="default">
          <CardTitle>
            <Globe size={20} />
            General Settings
          </CardTitle>
          <FormGrid>
            <Input
              label="Site Name"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings((prev) => ({ ...prev, siteName: e.target.value }))}
              placeholder="GSTS"
              fullWidth
            />
            <Input
              label="Tagline"
              value={generalSettings.tagline}
              onChange={(e) => setGeneralSettings((prev) => ({ ...prev, tagline: e.target.value }))}
              placeholder="Global Society of Tigray Scholars and Professionals"
              fullWidth
            />
          </FormGrid>
        </SettingsCard>

        <SettingsCard variant="default">
          <CardTitle>
            <MapPin size={20} />
            Contact Information
          </CardTitle>
          <FormGrid>
            <FormRow>
              <Input
                label="City"
                value={contact.city}
                onChange={(e) => setContact((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Mekelle"
                fullWidth
              />
              <Input
                label="Country"
                value={contact.country}
                onChange={(e) => setContact((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="Ethiopia"
                fullWidth
              />
            </FormRow>
            <Input
              label="Address"
              value={contact.address}
              onChange={(e) => setContact((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Full address"
              fullWidth
            />
            <FormRow>
              <Input
                label="Email"
                value={contact.email}
                onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="info@gsts.org"
                fullWidth
              />
              <Input
                label="Phone"
                value={contact.phone}
                onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+251 123 456 789"
                fullWidth
              />
            </FormRow>
            <Input
              label="Working Hours"
              value={contact.workingHours}
              onChange={(e) => setContact((prev) => ({ ...prev, workingHours: e.target.value }))}
              placeholder="Mon - Fri: 9:00 AM - 5:00 PM"
              fullWidth
            />
          </FormGrid>
        </SettingsCard>

        <SettingsCard variant="default">
          <CardTitle>Social Media Links</CardTitle>
          <FormGrid>
            <SocialInputWrapper>
              <SocialIcon $color="#1877f2">
                <Facebook size={20} />
              </SocialIcon>
              <Input
                value={social.facebook}
                onChange={(e) => setSocial((prev) => ({ ...prev, facebook: e.target.value }))}
                placeholder="https://facebook.com/gsts"
                fullWidth
              />
            </SocialInputWrapper>
            <SocialInputWrapper>
              <SocialIcon $color="#1da1f2">
                <Twitter size={20} />
              </SocialIcon>
              <Input
                value={social.twitter}
                onChange={(e) => setSocial((prev) => ({ ...prev, twitter: e.target.value }))}
                placeholder="https://twitter.com/gsts"
                fullWidth
              />
            </SocialInputWrapper>
            <SocialInputWrapper>
              <SocialIcon $color="#e4405f">
                <Instagram size={20} />
              </SocialIcon>
              <Input
                value={social.instagram}
                onChange={(e) => setSocial((prev) => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/gsts"
                fullWidth
              />
            </SocialInputWrapper>
            <SocialInputWrapper>
              <SocialIcon $color="#0077b5">
                <Linkedin size={20} />
              </SocialIcon>
              <Input
                value={social.linkedin}
                onChange={(e) => setSocial((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/gsts"
                fullWidth
              />
            </SocialInputWrapper>
            <SocialInputWrapper>
              <SocialIcon $color="#ff0000">
                <Youtube size={20} />
              </SocialIcon>
              <Input
                value={social.youtube}
                onChange={(e) => setSocial((prev) => ({ ...prev, youtube: e.target.value }))}
                placeholder="https://youtube.com/gsts"
                fullWidth
              />
            </SocialInputWrapper>
          </FormGrid>
        </SettingsCard>

        <SettingsCard variant="default">
          <CardTitle>SEO Settings</CardTitle>
          <FormGrid>
            <Input
              label="Page Title"
              value={seoSettings.title}
              onChange={(e) => setSeoSettings((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="GSTS - Global Society of Tigray Scholars"
              fullWidth
            />
            <Textarea
              label="Meta Description"
              value={seoSettings.description}
              onChange={(e) => setSeoSettings((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="A global knowledge network dedicated to Tigray's development..."
              fullWidth
            />
            <Input
              label="Keywords (comma separated)"
              value={seoSettings.keywords}
              onChange={(e) => setSeoSettings((prev) => ({ ...prev, keywords: e.target.value }))}
              placeholder="GSTS, Tigray, scholars, professionals, development"
              fullWidth
            />
          </FormGrid>
        </SettingsCard>

        <FullWidthCard variant="default">
          <DangerZone>
            <DangerTitle>Danger Zone</DangerTitle>
            <DangerText>
              Reset all content to factory defaults. This will remove all customizations and cannot be undone.
            </DangerText>
            <Button
              variant="ghost"
              leftIcon={<RefreshCw size={18} />}
              onClick={handleReset}
              style={{ color: 'var(--color-accent-error)', borderColor: 'var(--color-accent-error)' }}
            >
              Reset to Defaults
            </Button>
          </DangerZone>
        </FullWidthCard>
      </SettingsGrid>
    </PageWrapper>
  );
};
