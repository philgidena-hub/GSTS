import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Save, Upload, RefreshCw, Plus, X, Trash2 } from 'lucide-react';
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
  flex-wrap: wrap;
  gap: 1rem;
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

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

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
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const PreviewImage = styled.div`
  height: 200px;
  background: var(--color-neutral-100);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PreviewContent = styled.div`
  padding: 1.5rem;
`;

const PreviewSubtitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary-600);
  margin-bottom: 0.5rem;
`;

const PreviewTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const PreviewDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-neutral-600);
  margin-bottom: 1.5rem;
`;

const PreviewMissionVision = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MissionVisionBox = styled.div`
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-neutral-900);
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.8125rem;
    color: var(--color-neutral-600);
    line-height: 1.6;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureBox = styled.div`
  padding: 0.75rem;
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
  text-align: center;

  h5 {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary-700);
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.75rem;
    color: var(--color-neutral-500);
  }
`;

const ImageUploadArea = styled.div<{ $hasImage: boolean }>`
  border: 2px dashed ${({ $hasImage }) => $hasImage ? 'var(--color-primary-300)' : 'var(--color-neutral-200)'};
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $hasImage }) => $hasImage ? 'var(--color-primary-50)' : 'var(--color-neutral-50)'};

  &:hover {
    border-color: var(--color-primary-400);
    background: var(--color-primary-50);
  }
`;

const ImagePreview = styled.div`
  position: relative;

  img {
    max-width: 100%;
    max-height: 150px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: var(--color-accent-error);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #dc2626;
    }
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  margin-bottom: 0.25rem;
`;

const UploadHint = styled.p`
  font-size: 0.75rem;
  color: var(--color-neutral-400);
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  margin-bottom: 0.75rem;
`;

const FeatureInputs = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--color-neutral-400);
  cursor: pointer;
  border-radius: var(--radius-md);

  &:hover {
    background: var(--color-accent-error);
    color: white;
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-lg);
  color: #16a34a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface AboutFormData {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  image: string;
  features: Feature[];
}

export const AboutEditor = () => {
  const { about, updateAbout, uploadFile, isLoading } = useContentStore();
  const [formData, setFormData] = useState<AboutFormData>({
    title: about.title,
    subtitle: about.subtitle,
    description: about.description,
    mission: about.mission,
    vision: about.vision,
    image: about.image,
    features: about.features || [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFeatureChange = (id: string, field: 'title' | 'description', value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    }));
  };

  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      title: '',
      description: '',
      icon: 'Star',
    };
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature],
    }));
  };

  const handleRemoveFeature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const path = `about/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAbout(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: about.title,
      subtitle: about.subtitle,
      description: about.description,
      mission: about.mission,
      vision: about.vision,
      image: about.image,
      features: about.features || [],
    });
  };

  return (
    <EditorWrapper>
      <Header>
        <Title>Edit About Section</Title>
        <Actions>
          <Button variant="ghost" leftIcon={<RefreshCw size={18} />} onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save size={18} />}
            onClick={handleSave}
            isLoading={isSaving || isLoading}
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
            <SectionTitle>About Content</SectionTitle>
            <FormGrid>
              <Input
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="e.g., Who We Are"
                fullWidth
              />

              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., About GSTS"
                fullWidth
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Main description of your organization..."
                fullWidth
              />

              <Textarea
                label="Mission"
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Your organization's mission statement..."
                fullWidth
              />

              <Textarea
                label="Vision"
                name="vision"
                value={formData.vision}
                onChange={handleChange}
                placeholder="Your organization's vision statement..."
                fullWidth
              />
            </FormGrid>
          </Card>

          <Card variant="default" padding="lg">
            <SectionTitle>About Image</SectionTitle>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <ImageUploadArea
              $hasImage={!!formData.image}
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.image ? (
                <ImagePreview>
                  <img src={formData.image} alt="About" />
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setFormData(prev => ({ ...prev, image: '' }));
                  }}>
                    <X size={14} />
                  </button>
                </ImagePreview>
              ) : (
                <>
                  <UploadIcon>
                    <Upload size={24} />
                  </UploadIcon>
                  <UploadText>
                    {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                  </UploadText>
                  <UploadHint>PNG, JPG up to 5MB</UploadHint>
                </>
              )}
            </ImageUploadArea>
          </Card>

          <Card variant="default" padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SectionTitle style={{ marginBottom: 0 }}>Features</SectionTitle>
              <Button variant="outline" size="sm" leftIcon={<Plus size={16} />} onClick={handleAddFeature}>
                Add Feature
              </Button>
            </div>
            {formData.features.map((feature) => (
              <FeatureItem key={feature.id}>
                <FeatureInputs>
                  <Input
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)}
                    placeholder="Feature title"
                    fullWidth
                  />
                  <Input
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                    placeholder="Feature description"
                    fullWidth
                  />
                </FeatureInputs>
                <RemoveButton onClick={() => handleRemoveFeature(feature.id)}>
                  <Trash2 size={16} />
                </RemoveButton>
              </FeatureItem>
            ))}
            {formData.features.length === 0 && (
              <p style={{ color: 'var(--color-neutral-400)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                No features added yet. Click "Add Feature" to get started.
              </p>
            )}
          </Card>
        </FormSection>

        <PreviewSection>
          <SectionTitle>Preview</SectionTitle>
          <PreviewCard>
            {formData.image && (
              <PreviewImage>
                <img src={formData.image} alt="About preview" />
              </PreviewImage>
            )}
            <PreviewContent>
              <PreviewSubtitle>{formData.subtitle}</PreviewSubtitle>
              <PreviewTitle>{formData.title}</PreviewTitle>
              <PreviewDescription>{formData.description}</PreviewDescription>

              <PreviewMissionVision>
                <MissionVisionBox>
                  <h4>Mission</h4>
                  <p>{formData.mission}</p>
                </MissionVisionBox>
                <MissionVisionBox>
                  <h4>Vision</h4>
                  <p>{formData.vision}</p>
                </MissionVisionBox>
              </PreviewMissionVision>

              {formData.features.length > 0 && (
                <FeaturesGrid>
                  {formData.features.map((feature) => (
                    <FeatureBox key={feature.id}>
                      <h5>{feature.title || 'Feature Title'}</h5>
                      <p>{feature.description || 'Description'}</p>
                    </FeatureBox>
                  ))}
                </FeaturesGrid>
              )}
            </PreviewContent>
          </PreviewCard>
        </PreviewSection>
      </EditorGrid>
    </EditorWrapper>
  );
};
