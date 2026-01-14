import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, ExternalLink, GripVertical, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { Partner } from '../../types';

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

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const PartnerCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
  position: relative;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  color: var(--color-neutral-300);
  cursor: grab;

  &:hover {
    color: var(--color-neutral-500);
  }
`;

const OrderBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
`;

const PartnerLogo = styled.div`
  width: 120px;
  height: 80px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const PartnerName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const PartnerWebsite = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-primary-600);
  text-decoration: none;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const PartnerActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
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

const LogoPreview = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  text-align: center;

  img {
    max-width: 150px;
    max-height: 80px;
    object-fit: contain;
  }

  p {
    font-size: 0.8125rem;
    color: var(--color-neutral-500);
    margin-top: 0.5rem;
  }
`;

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

interface PartnerFormData {
  name: string;
  logo: string;
  website: string;
  order: number;
}

const initialFormData: PartnerFormData = {
  name: '',
  logo: '',
  website: '',
  order: 1,
};

export const PartnersManager = () => {
  const { partners, addPartner, updatePartner, deletePartner, uploadFile } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingLogo(true);
    try {
      const path = `partners/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData((prev) => ({ ...prev, logo: url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const filteredPartners = partners
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleOpenModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        logo: partner.logo,
        website: partner.website || '',
        order: partner.order || partners.length + 1,
      });
    } else {
      setEditingPartner(null);
      setFormData({
        ...initialFormData,
        order: partners.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.logo) {
      alert('Please fill in partner name and logo URL');
      return;
    }

    setIsSaving(true);
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, {
          name: formData.name,
          logo: formData.logo,
          website: formData.website || undefined,
          order: formData.order,
        });
      } else {
        await addPartner({
          name: formData.name,
          logo: formData.logo,
          website: formData.website || undefined,
          order: formData.order,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving partner:', error);
      alert('Failed to save partner. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Failed to delete partner. Please try again.');
      }
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Partners</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add Partner
          </Button>
        </div>
      </Header>

      {filteredPartners.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No partners found</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first partner'}
          </EmptyText>
          {!searchQuery && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add Partner
            </Button>
          )}
        </EmptyState>
      ) : (
        <PartnersGrid>
          {filteredPartners.map((partner) => (
            <PartnerCard key={partner.id} variant="default">
              <DragHandle>
                <GripVertical size={16} />
              </DragHandle>
              <OrderBadge>#{partner.order || '-'}</OrderBadge>
              <PartnerLogo>
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} />
                ) : (
                  <div style={{ color: 'var(--color-neutral-400)', fontSize: '0.875rem' }}>
                    No Logo
                  </div>
                )}
              </PartnerLogo>
              <PartnerName>{partner.name}</PartnerName>
              {partner.website && (
                <PartnerWebsite href={partner.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} />
                  Visit Website
                </PartnerWebsite>
              )}
              <PartnerActions>
                <ActionButton onClick={() => handleOpenModal(partner)}>
                  <Edit2 size={14} />
                  Edit
                </ActionButton>
                <ActionButton $variant="danger" onClick={() => handleDelete(partner.id)}>
                  <Trash2 size={14} />
                  Delete
                </ActionButton>
              </PartnerActions>
            </PartnerCard>
          ))}
        </PartnersGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingPartner ? 'Edit Partner' : 'Add Partner'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Partner Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Mekelle University"
                required
                fullWidth
              />
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-700)', marginBottom: '0.5rem', display: 'block' }}>
                  Partner Logo *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoUpload}
                />
                {formData.logo ? (
                  <LogoPreview>
                    <img src={formData.logo} alt="Logo preview" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                    <p>Logo Preview</p>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={uploadingLogo}
                      >
                        Change Logo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, logo: '' }))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </LogoPreview>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--color-neutral-300)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {uploadingLogo ? (
                      <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>Uploading...</p>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--color-neutral-400)', marginBottom: '0.5rem' }} />
                        <p style={{ color: 'var(--color-neutral-500)', margin: 0, fontSize: '0.875rem' }}>
                          Click to upload partner logo
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Input
                label="Website URL (optional)"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                fullWidth
              />
              <Input
                label="Display Order"
                name="order"
                type="number"
                value={formData.order.toString()}
                onChange={handleChange}
                placeholder="1"
                fullWidth
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isSaving}
              >
                {editingPartner ? 'Save Changes' : 'Add Partner'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
