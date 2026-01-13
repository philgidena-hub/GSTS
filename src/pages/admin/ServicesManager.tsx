import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { ServiceCluster } from '../../types';

const PageWrapper = styled.div``;

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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  width: 300px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9375rem;
  }

  svg {
    color: var(--color-neutral-400);
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ServiceCard = styled(Card)`
  overflow: hidden;
`;

const ServiceHeader = styled.div<{ $color: string }>`
  height: 8px;
  background: ${({ $color }) => $color};
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
`;

const ServiceIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureTag = styled.span<{ $color: string }>`
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  background: ${({ $color }) => `${$color}10`};
  color: ${({ $color }) => $color};
  border-radius: var(--radius-md);
`;

const ServiceActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'danger' ? 'var(--color-accent-error)' : 'var(--color-neutral-100)'};
  color: ${({ $variant }) =>
    $variant === 'danger' ? 'white' : 'var(--color-neutral-700)'};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger' ? '#dc2626' : 'var(--color-neutral-200)'};
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-200);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid ${({ $selected }) => ($selected ? 'var(--color-neutral-900)' : 'transparent')};
  background: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const colorOptions = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: #16a34a;
  font-size: 0.875rem;
`;

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
}

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  icon: 'Layers',
  color: '#3b82f6',
  features: [],
};

export const ServicesManager = () => {
  const { services, addService, updateService, deleteService, isLoading } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCluster | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [featureInput, setFeatureInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (service?: ServiceCluster) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        color: service.color,
        features: service.features || [],
      });
    } else {
      setEditingService(null);
      setFormData(initialFormData);
    }
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData(initialFormData);
    setFeatureInput('');
    setSuccessMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        setSuccessMessage('Thematic area updated successfully!');
      } else {
        await addService(formData);
        setSuccessMessage('Thematic area created successfully!');
      }

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this thematic area? This action cannot be undone.')) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Thematic Areas</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add Thematic Area
          </Button>
        </div>
      </Header>

      {filteredServices.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No thematic areas found</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first thematic area'}
          </EmptyText>
          {!searchQuery && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add Thematic Area
            </Button>
          )}
        </EmptyState>
      ) : (
        <ServicesGrid>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} variant="default">
              <ServiceHeader $color={service.color} />
              <ServiceContent>
                <ServiceIcon $color={service.color}>
                  <Layers size={24} />
                </ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                {service.features && service.features.length > 0 && (
                  <FeaturesList>
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <FeatureTag key={idx} $color={service.color}>
                        {feature}
                      </FeatureTag>
                    ))}
                    {service.features.length > 4 && (
                      <FeatureTag $color={service.color}>
                        +{service.features.length - 4} more
                      </FeatureTag>
                    )}
                  </FeaturesList>
                )}
                <ServiceActions>
                  <ActionButton onClick={() => handleOpenModal(service)}>
                    <Edit2 size={14} />
                    Edit
                  </ActionButton>
                  <ActionButton $variant="danger" onClick={() => handleDelete(service.id)}>
                    <Trash2 size={14} />
                    Delete
                  </ActionButton>
                </ServiceActions>
              </ServiceContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingService ? 'Edit Thematic Area' : 'Add New Thematic Area'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <Input
                label="Thematic Area Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Social Sector, Economic Development"
                fullWidth
              />

              <Textarea
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this thematic area focuses on..."
                fullWidth
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Theme Color
                </label>
                <ColorPicker>
                  {colorOptions.map((color) => (
                    <ColorOption
                      key={color}
                      $color={color}
                      $selected={formData.color === color}
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </ColorPicker>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Features / Focus Areas
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    fullWidth
                  />
                  <Button variant="outline" onClick={handleAddFeature}>
                    Add
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <FeaturesList>
                    {formData.features.map((feature, idx) => (
                      <FeatureTag key={idx} $color={formData.color} style={{ cursor: 'pointer' }} onClick={() => handleRemoveFeature(feature)}>
                        {feature} <X size={12} style={{ marginLeft: '0.25rem' }} />
                      </FeatureTag>
                    ))}
                  </FeaturesList>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isSaving || isLoading}
              >
                {editingService ? 'Save Changes' : 'Create Thematic Area'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
