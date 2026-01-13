import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Users, Globe, Briefcase, Grid } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { Statistic } from '../../types';

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

const Description = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: 0.25rem;
`;

const StatDescription = styled.div`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  margin-bottom: 1rem;
`;

const StatActions = styled.div`
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
  max-width: 500px;
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

const IconPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const IconOption = styled.button<{ $selected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 2px solid ${({ $selected }) => ($selected ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $selected }) => ($selected ? 'var(--color-primary-50)' : 'white')};
  color: ${({ $selected }) => ($selected ? 'var(--color-primary-600)' : 'var(--color-neutral-600)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-primary-400);
  }
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: #16a34a;
  font-size: 0.875rem;
`;

const iconOptions = [
  { name: 'Users', icon: Users },
  { name: 'Globe', icon: Globe },
  { name: 'Grid', icon: Grid },
  { name: 'Briefcase', icon: Briefcase },
];

const getIconComponent = (iconName: string) => {
  const found = iconOptions.find((i) => i.name === iconName);
  return found ? found.icon : Users;
};

interface StatFormData {
  value: string;
  label: string;
  description: string;
  icon: string;
}

const initialFormData: StatFormData = {
  value: '',
  label: '',
  description: '',
  icon: 'Users',
};

export const StatisticsManager = () => {
  const { statistics, addStatistic, updateStatistic, deleteStatistic, isLoading } = useContentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState<StatFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleOpenModal = (stat?: Statistic) => {
    if (stat) {
      setEditingStat(stat);
      setFormData({
        value: stat.value,
        label: stat.label,
        description: stat.description,
        icon: stat.icon,
      });
    } else {
      setEditingStat(null);
      setFormData(initialFormData);
    }
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStat(null);
    setFormData(initialFormData);
    setSuccessMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.value || !formData.label) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingStat) {
        await updateStatistic(editingStat.id, formData);
        setSuccessMessage('Statistic updated successfully!');
      } else {
        await addStatistic(formData);
        setSuccessMessage('Statistic created successfully!');
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
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await deleteStatistic(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <PageWrapper>
      <Header>
        <div>
          <Title>Manage Statistics</Title>
          <Description>
            Update the key statistics displayed on the homepage to showcase GSTS impact.
          </Description>
        </div>
        <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
          Add Statistic
        </Button>
      </Header>

      <StatsGrid>
        {statistics.map((stat) => {
          const IconComponent = getIconComponent(stat.icon);
          return (
            <StatCard key={stat.id} variant="default">
              <StatIcon>
                <IconComponent size={28} />
              </StatIcon>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
              <StatDescription>{stat.description}</StatDescription>
              <StatActions>
                <ActionButton onClick={() => handleOpenModal(stat)}>
                  <Edit2 size={14} />
                  Edit
                </ActionButton>
                <ActionButton $variant="danger" onClick={() => handleDelete(stat.id)}>
                  <Trash2 size={14} />
                  Delete
                </ActionButton>
              </StatActions>
            </StatCard>
          );
        })}
      </StatsGrid>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingStat ? 'Edit Statistic' : 'Add New Statistic'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <Input
                label="Value *"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 5,000+, 50+, 12"
                fullWidth
              />

              <Input
                label="Label *"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="e.g., Members, Countries, Projects"
                fullWidth
              />

              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Researchers and professionals worldwide"
                fullWidth
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Icon
                </label>
                <IconPicker>
                  {iconOptions.map((option) => (
                    <IconOption
                      key={option.name}
                      $selected={formData.icon === option.name}
                      onClick={() => setFormData((prev) => ({ ...prev, icon: option.name }))}
                    >
                      <option.icon size={24} />
                    </IconOption>
                  ))}
                </IconPicker>
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
                {editingStat ? 'Save Changes' : 'Create Statistic'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
