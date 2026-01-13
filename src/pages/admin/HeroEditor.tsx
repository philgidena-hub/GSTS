import { useState } from 'react';
import styled from '@emotion/styled';
import { Save, Upload, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';

const EditorWrapper = styled.div``;

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

const EditorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div``;

const PreviewSection = styled.div``;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PreviewCard = styled.div`
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  border-radius: var(--radius-xl);
  padding: 2rem;
  color: white;
  min-height: 400px;
  position: relative;
  overflow: hidden;
`;

const PreviewPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 25% 25%,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px
  );
  background-size: 40px 40px;
`;

const PreviewContent = styled.div`
  position: relative;
  z-index: 1;
`;

const PreviewBadge = styled.div`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-secondary-400);
  margin-bottom: 1rem;
`;

const PreviewTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
`;

const PreviewDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
`;

const PreviewButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const PreviewButton = styled.div<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'var(--color-secondary-500)'
      : 'rgba(255, 255, 255, 0.1)'};
  border: ${({ $variant }) =>
    $variant === 'secondary' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'};
`;

const ImageUpload = styled.div`
  border: 2px dashed var(--color-neutral-300);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-primary-400);
    background: var(--color-primary-50);
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  background: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-500);
`;

const UploadText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-600);
  margin-bottom: 0.5rem;
`;

const UploadHint = styled.p`
  font-size: 0.75rem;
  color: var(--color-neutral-400);
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: var(--color-accent-success);
  color: white;
  border-radius: var(--radius-lg);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const HeroEditor = () => {
  const { hero, updateHero } = useContentStore();
  const [formData, setFormData] = useState(hero);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateHero(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setFormData(hero);
  };

  return (
    <EditorWrapper>
      <Header>
        <Title>Edit Hero Section</Title>
        <Actions>
          <Button variant="ghost" leftIcon={<RefreshCw size={18} />} onClick={handleReset}>
            Reset
          </Button>
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
          Changes saved successfully!
        </SuccessMessage>
      )}

      <EditorGrid>
        <FormSection>
          <Card variant="default" padding="lg">
            <SectionTitle>Hero Content</SectionTitle>
            <FormGrid>
              <Input
                label="Subtitle / Badge Text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g., Global Society of Tigray Scholars"
                fullWidth
              />

              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Main heading text"
                fullWidth
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Hero section description..."
                fullWidth
              />

              <Input
                label="Primary Button Text"
                name="primaryButtonText"
                value={formData.primaryButtonText}
                onChange={handleChange}
                placeholder="e.g., Become a Member"
                fullWidth
              />

              <Input
                label="Primary Button Link"
                name="primaryButtonLink"
                value={formData.primaryButtonLink}
                onChange={handleChange}
                placeholder="e.g., /membership"
                fullWidth
              />

              <Input
                label="Secondary Button Text"
                name="secondaryButtonText"
                value={formData.secondaryButtonText}
                onChange={handleChange}
                placeholder="e.g., Learn More"
                fullWidth
              />

              <Input
                label="Secondary Button Link"
                name="secondaryButtonLink"
                value={formData.secondaryButtonLink}
                onChange={handleChange}
                placeholder="e.g., /about"
                fullWidth
              />
            </FormGrid>
          </Card>

          <Card variant="default" padding="lg" className="mt-6">
            <SectionTitle>Background Image</SectionTitle>
            <ImageUpload>
              <UploadIcon>
                <Upload size={24} />
              </UploadIcon>
              <UploadText>Click to upload or drag and drop</UploadText>
              <UploadHint>PNG, JPG up to 5MB (Recommended: 1920x1080)</UploadHint>
            </ImageUpload>
            <Input
              label="Or enter image URL"
              name="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleChange}
              placeholder="/images/hero-bg.jpg"
              fullWidth
              style={{ marginTop: '1rem' }}
            />
          </Card>
        </FormSection>

        <PreviewSection>
          <SectionTitle>Preview</SectionTitle>
          <PreviewCard>
            <PreviewPattern />
            <PreviewContent>
              <PreviewBadge>{formData.subtitle}</PreviewBadge>
              <PreviewTitle>{formData.title}</PreviewTitle>
              <PreviewDescription>{formData.description}</PreviewDescription>
              <PreviewButtons>
                <PreviewButton $variant="primary">
                  {formData.primaryButtonText}
                </PreviewButton>
                <PreviewButton $variant="secondary">
                  {formData.secondaryButtonText}
                </PreviewButton>
              </PreviewButtons>
            </PreviewContent>
          </PreviewCard>
        </PreviewSection>
      </EditorGrid>
    </EditorWrapper>
  );
};
