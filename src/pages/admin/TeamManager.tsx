import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, Mail, Linkedin, Twitter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { TeamMember } from '../../types';

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

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MemberCard = styled(Card)`
  text-align: center;
  padding: 1.5rem;
`;

const MemberImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  background: var(--color-neutral-100);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const MemberRole = styled.p`
  font-size: 0.875rem;
  color: var(--color-primary-600);
  font-weight: 500;
  margin-bottom: 0.75rem;
`;

const MemberBio = styled.p`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  transition: all 0.2s;

  &:hover {
    background: var(--color-primary-600);
    color: white;
  }
`;

const MemberActions = styled.div`
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

const SectionLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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

interface TeamFormData {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const initialFormData: TeamFormData = {
  name: '',
  role: '',
  bio: '',
  image: '',
  social: {
    linkedin: '',
    twitter: '',
    email: '',
  },
};

export const TeamManager = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
        social: member.social || { linkedin: '', twitter: '', email: '' },
      });
    } else {
      setEditingMember(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        social: { ...prev.social, [socialKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingMember) {
      updateTeamMember(editingMember.id, formData);
    } else {
      addTeamMember({
        ...formData,
        id: `team-${Date.now()}`,
      });
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteTeamMember(id);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Team</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add Member
          </Button>
        </div>
      </Header>

      {filteredMembers.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No team members found</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first team member'}
          </EmptyText>
          {!searchQuery && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add Member
            </Button>
          )}
        </EmptyState>
      ) : (
        <MembersGrid>
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} variant="default">
              <MemberImage>
                {member.image ? (
                  <img src={member.image} alt={member.name} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-neutral-400)', fontSize: '2rem', fontWeight: 600 }}>
                    {member.name.charAt(0)}
                  </div>
                )}
              </MemberImage>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
              <MemberBio>{member.bio}</MemberBio>
              <SocialLinks>
                {member.social?.linkedin && (
                  <SocialLink href={member.social.linkedin} target="_blank">
                    <Linkedin size={16} />
                  </SocialLink>
                )}
                {member.social?.twitter && (
                  <SocialLink href={member.social.twitter} target="_blank">
                    <Twitter size={16} />
                  </SocialLink>
                )}
                {member.social?.email && (
                  <SocialLink href={`mailto:${member.social.email}`}>
                    <Mail size={16} />
                  </SocialLink>
                )}
              </SocialLinks>
              <MemberActions>
                <ActionButton onClick={() => handleOpenModal(member)}>
                  <Edit2 size={14} />
                  Edit
                </ActionButton>
                <ActionButton $variant="danger" onClick={() => handleDelete(member.id)}>
                  <Trash2 size={14} />
                  Delete
                </ActionButton>
              </MemberActions>
            </MemberCard>
          ))}
        </MembersGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  fullWidth
                />
                <Input
                  label="Role/Position"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Chairperson"
                  fullWidth
                />
              </FormRow>
              <Textarea
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief biography..."
                fullWidth
              />
              <Input
                label="Profile Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/images/team-member.jpg"
                fullWidth
              />
              <div>
                <SectionLabel>Social Links</SectionLabel>
                <FormRow>
                  <Input
                    label="LinkedIn"
                    name="social.linkedin"
                    value={formData.social.linkedin || ''}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    fullWidth
                  />
                  <Input
                    label="Twitter"
                    name="social.twitter"
                    value={formData.social.twitter || ''}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
                    fullWidth
                  />
                </FormRow>
                <Input
                  label="Email"
                  name="social.email"
                  value={formData.social.email || ''}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  fullWidth
                  style={{ marginTop: '1rem' }}
                />
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
                isLoading={isSaving}
              >
                {editingMember ? 'Save Changes' : 'Add Member'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
