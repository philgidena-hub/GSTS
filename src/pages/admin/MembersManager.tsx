import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Search,
  Mail,
  MapPin,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Globe,
  Linkedin,
  Twitter,
  User,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuthStore } from '../../stores/authStore';
import { membershipService } from '../../services/membership.service';
import type { Member } from '../../types';

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

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
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

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-600)')};

  &:hover {
    border-color: var(--color-primary-600);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--color-neutral-100);
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const MembersTable = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-100);
`;

const Td = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
  border-bottom: 1px solid var(--color-neutral-100);
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MemberAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
  font-weight: 600;
  font-size: 0.875rem;
`;

const MemberName = styled.div`
  font-weight: 500;
  color: var(--color-neutral-900);
`;

const MemberEmail = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-600);

  svg {
    color: var(--color-neutral-400);
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: ${({ $status }) =>
    $status === 'active'
      ? '#10b98120'
      : $status === 'pending'
      ? '#f59e0b20'
      : '#ef444420'};
  color: ${({ $status }) =>
    $status === 'active'
      ? '#10b981'
      : $status === 'pending'
      ? '#f59e0b'
      : '#ef4444'};
`;

const PlanBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: var(--color-primary-50);
  color: var(--color-primary-600);
`;

const ExpiryBadge = styled.span<{ $isExpiring?: boolean; $isExpired?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: ${({ $isExpiring, $isExpired }) =>
    $isExpired ? '#ef444420' : $isExpiring ? '#f59e0b20' : 'var(--color-neutral-100)'};
  color: ${({ $isExpiring, $isExpired }) =>
    $isExpired ? '#ef4444' : $isExpiring ? '#f59e0b' : 'var(--color-neutral-600)'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
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
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  border-radius: var(--radius-md);
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-700)')};
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary-600);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'view' | 'edit' | 'delete' | 'renew' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $variant }) =>
    $variant === 'view'
      ? 'var(--color-neutral-100)'
      : $variant === 'edit'
      ? 'var(--color-primary-50)'
      : $variant === 'renew'
      ? '#d1fae5'
      : '#fee2e2'};
  color: ${({ $variant }) =>
    $variant === 'view'
      ? 'var(--color-neutral-700)'
      : $variant === 'edit'
      ? 'var(--color-primary-600)'
      : $variant === 'renew'
      ? 'var(--color-accent-success)'
      : 'var(--color-accent-error)'};

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal styled components
const ModalContent = styled.div``;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div``;

const DetailLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: var(--color-neutral-900);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  transition: all 0.2s;

  &:hover {
    background: var(--color-primary-100);
    color: var(--color-primary-600);
  }
`;

const ExpertiseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ExpertiseTag = styled.span`
  padding: 0.375rem 0.75rem;
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
`;

const BioText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
  line-height: 1.7;
  background: var(--color-neutral-50);
  padding: 1rem;
  border-radius: var(--radius-lg);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DeleteWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;

  svg {
    color: #ef4444;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: var(--color-neutral-700);
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`;

export const MembersManager = () => {
  const { members, updateMember, deleteMember, fetchMembers, plans } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Member>>({});

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const getDisplayName = (member: Member): string => {
    return member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'N/A';
  };

  const getInitials = (member: Member): string => {
    const name = getDisplayName(member);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const filteredMembers = members.filter((m) => {
    const displayName = getDisplayName(m);
    const matchesSearch =
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = m.membershipStatus === 'active';
    } else if (statusFilter === 'pending') {
      matchesStatus = m.membershipStatus === 'pending';
    } else if (statusFilter === 'inactive') {
      matchesStatus = m.membershipStatus === 'expired' || m.membershipStatus === 'cancelled';
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: members.length,
    active: members.filter((m) => m.membershipStatus === 'active').length,
    pending: members.filter((m) => m.membershipStatus === 'pending').length,
    inactive: members.filter((m) => m.membershipStatus === 'expired' || m.membershipStatus === 'cancelled').length,
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiryDate: string | undefined): number | null => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isExpiringSoon = (expiryDate: string | undefined): boolean => {
    const days = getDaysUntilExpiry(expiryDate);
    return days !== null && days > 0 && days <= 30;
  };

  const isExpired = (expiryDate: string | undefined): boolean => {
    const days = getDaysUntilExpiry(expiryDate);
    return days !== null && days <= 0;
  };

  const getPlanName = (planId: string): string => {
    const plan = plans.find(p => p.id === planId);
    return plan?.name || planId || 'Basic';
  };

  // View member
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Edit member
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setEditForm({
      fullName: member.fullName,
      email: member.email,
      gender: member.gender,
      academicStatus: member.academicStatus,
      generalFieldOfStudy: member.generalFieldOfStudy,
      fieldOfSpecialization: member.fieldOfSpecialization,
      professionalCareerStatus: member.professionalCareerStatus,
      organization: member.organization,
      country: member.country,
      phone: member.phone,
      bio: member.bio || '',
      membershipStatus: member.membershipStatus,
      social: member.social || {},
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    try {
      await updateMember(selectedMember.id, editForm);
      setIsEditModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete member
  const handleDeleteMember = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      await deleteMember(selectedMember.id);
      setIsDeleteModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Renew membership
  const handleRenewMembership = async (member: Member) => {
    setIsRenewing(true);
    try {
      await membershipService.renewMembership(member.id);
      await fetchMembers();
    } catch (error) {
      console.error('Error renewing membership:', error);
    } finally {
      setIsRenewing(false);
    }
  };

  // Export members to CSV
  const handleExport = () => {
    const headers = ['Full Name', 'Gender', 'Email', 'Phone', 'Academic Status', 'Specialization', 'Organization', 'Country', 'Plan', 'Status', 'Joined Date', 'Expiry Date'];
    const rows = filteredMembers.map(m => [
      getDisplayName(m),
      m.gender || 'N/A',
      m.email,
      m.phone || '',
      m.academicStatus || '',
      m.fieldOfSpecialization || '',
      m.organization,
      m.country,
      getPlanName(m.membershipPlanId),
      m.membershipStatus,
      formatDate(m.joinedDate),
      formatDate(m.expiryDate),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gsts-members-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Members</Title>
        <HeaderActions>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="outline" leftIcon={<Download size={18} />} onClick={handleExport}>
            Export
          </Button>
        </HeaderActions>
      </Header>

      <StatsRow>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Members</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active Members</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>Inactive</StatLabel>
        </StatCard>
      </StatsRow>

      <FilterTabs>
        <FilterTab $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
          <Filter size={14} style={{ marginRight: '0.5rem' }} />
          All
        </FilterTab>
        <FilterTab $active={statusFilter === 'active'} onClick={() => setStatusFilter('active')}>
          Active
        </FilterTab>
        <FilterTab $active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>
          Pending
        </FilterTab>
        <FilterTab $active={statusFilter === 'inactive'} onClick={() => setStatusFilter('inactive')}>
          Inactive
        </FilterTab>
      </FilterTabs>

      <MembersTable>
        {paginatedMembers.length === 0 ? (
          <EmptyState>
            <User size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--color-neutral-400)' }} />
            <EmptyTitle>No members found</EmptyTitle>
            <EmptyText>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No members have registered yet'}
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <Th>Member</Th>
                  <Th>Contact</Th>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>Expiry</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id}>
                    <Td>
                      <MemberInfo>
                        <MemberAvatar>
                          {getInitials(member)}
                        </MemberAvatar>
                        <div>
                          <MemberName>
                            {getDisplayName(member)}
                          </MemberName>
                          <MemberEmail>{member.academicStatus || member.professionalCareerStatus || 'N/A'}</MemberEmail>
                        </div>
                      </MemberInfo>
                    </Td>
                    <Td>
                      <ContactInfo>
                        <ContactItem>
                          <Mail size={12} />
                          {member.email}
                        </ContactItem>
                        {member.country && (
                          <ContactItem>
                            <MapPin size={12} />
                            {member.country}
                          </ContactItem>
                        )}
                      </ContactInfo>
                    </Td>
                    <Td>
                      <PlanBadge>{getPlanName(member.membershipPlanId)}</PlanBadge>
                    </Td>
                    <Td>
                      <StatusBadge $status={member.membershipStatus}>{member.membershipStatus}</StatusBadge>
                    </Td>
                    <Td>
                      {member.expiryDate ? (
                        <ExpiryBadge $isExpiring={isExpiringSoon(member.expiryDate)} $isExpired={isExpired(member.expiryDate)}>
                          {isExpired(member.expiryDate) && <AlertTriangle size={12} />}
                          {formatDate(member.expiryDate)}
                        </ExpiryBadge>
                      ) : (
                        <ExpiryBadge>Lifetime</ExpiryBadge>
                      )}
                    </Td>
                    <Td>
                      <Actions>
                        <ActionButton
                          $variant="view"
                          onClick={() => handleViewMember(member)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton
                          $variant="edit"
                          onClick={() => handleEditMember(member)}
                          title="Edit member"
                        >
                          <Edit2 size={16} />
                        </ActionButton>
                        {(isExpired(member.expiryDate) || isExpiringSoon(member.expiryDate)) && (
                          <ActionButton
                            $variant="renew"
                            onClick={() => handleRenewMembership(member)}
                            title="Renew membership"
                            disabled={isRenewing}
                          >
                            <RefreshCw size={16} />
                          </ActionButton>
                        )}
                        <ActionButton
                          $variant="delete"
                          onClick={() => handleDeleteMember(member)}
                          title="Delete member"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </Actions>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {totalPages > 1 && (
              <Pagination>
                <PageInfo>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{' '}
                  {filteredMembers.length} members
                </PageInfo>
                <PageButtons>
                  <PageButton
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </PageButton>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <PageButton
                      key={page}
                      $active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </PageButton>
                </PageButtons>
              </Pagination>
            )}
          </>
        )}
      </MembersTable>

      {/* View Member Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMember(null);
        }}
        title="Member Details"
        size="lg"
      >
        {selectedMember && (
          <ModalContent>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Full Name</DetailLabel>
                <DetailValue>{getDisplayName(selectedMember)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{selectedMember.email}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Gender</DetailLabel>
                <DetailValue>{selectedMember.gender === 'M' ? 'Male' : selectedMember.gender === 'F' ? 'Female' : 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Phone</DetailLabel>
                <DetailValue>{selectedMember.phone || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Academic Status</DetailLabel>
                <DetailValue>{selectedMember.academicStatus || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Professional Status</DetailLabel>
                <DetailValue>{selectedMember.professionalCareerStatus || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Field of Study</DetailLabel>
                <DetailValue>{selectedMember.generalFieldOfStudy || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Specialization</DetailLabel>
                <DetailValue>{selectedMember.fieldOfSpecialization || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>R&D Team</DetailLabel>
                <DetailValue>{selectedMember.rdTeam || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Organization</DetailLabel>
                <DetailValue>{selectedMember.organization || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Country</DetailLabel>
                <DetailValue>{selectedMember.country || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Membership Plan</DetailLabel>
                <PlanBadge>{getPlanName(selectedMember.membershipPlanId)}</PlanBadge>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <StatusBadge $status={selectedMember.membershipStatus}>
                  {selectedMember.membershipStatus}
                </StatusBadge>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Joined Date</DetailLabel>
                <DetailValue>{formatDate(selectedMember.joinedDate)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Expiry Date</DetailLabel>
                <DetailValue>
                  {selectedMember.expiryDate ? (
                    <ExpiryBadge $isExpiring={isExpiringSoon(selectedMember.expiryDate)} $isExpired={isExpired(selectedMember.expiryDate)}>
                      {formatDate(selectedMember.expiryDate)}
                      {isExpired(selectedMember.expiryDate) && ' (Expired)'}
                      {isExpiringSoon(selectedMember.expiryDate) && ` (${getDaysUntilExpiry(selectedMember.expiryDate)} days left)`}
                    </ExpiryBadge>
                  ) : (
                    'Lifetime'
                  )}
                </DetailValue>
              </DetailItem>
            </DetailGrid>

            {selectedMember.researchInterest && (
              <DetailItem style={{ marginBottom: '1.5rem' }}>
                <DetailLabel>Research Interest</DetailLabel>
                <BioText>{selectedMember.researchInterest}</BioText>
              </DetailItem>
            )}

            {selectedMember.activitiesExperiences && (
              <DetailItem style={{ marginBottom: '1.5rem' }}>
                <DetailLabel>Activities & Experiences</DetailLabel>
                <BioText>{selectedMember.activitiesExperiences}</BioText>
              </DetailItem>
            )}

            {selectedMember.expertise && selectedMember.expertise.length > 0 && (
              <DetailItem style={{ marginBottom: '1.5rem' }}>
                <DetailLabel>Expertise</DetailLabel>
                <ExpertiseList>
                  {selectedMember.expertise.map((exp, index) => (
                    <ExpertiseTag key={index}>{exp}</ExpertiseTag>
                  ))}
                </ExpertiseList>
              </DetailItem>
            )}

            {selectedMember.bio && (
              <DetailItem style={{ marginBottom: '1.5rem' }}>
                <DetailLabel>Bio</DetailLabel>
                <BioText>{selectedMember.bio}</BioText>
              </DetailItem>
            )}

            {selectedMember.social && Object.values(selectedMember.social).some(Boolean) && (
              <DetailItem>
                <DetailLabel>Social Links</DetailLabel>
                <SocialLinks>
                  {selectedMember.social.website && (
                    <SocialLink href={selectedMember.social.website} target="_blank" rel="noopener noreferrer">
                      <Globe size={18} />
                    </SocialLink>
                  )}
                  {selectedMember.social.linkedin && (
                    <SocialLink href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin size={18} />
                    </SocialLink>
                  )}
                  {selectedMember.social.twitter && (
                    <SocialLink href={selectedMember.social.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter size={18} />
                    </SocialLink>
                  )}
                </SocialLinks>
              </DetailItem>
            )}

            <ModalActions>
              <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                setIsViewModalOpen(false);
                handleEditMember(selectedMember);
              }}>
                Edit Member
              </Button>
            </ModalActions>
          </ModalContent>
        )}
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        title="Edit Member"
        size="lg"
      >
        <ModalContent>
          <FormGrid>
            <Input
              label="Full Name"
              value={editForm.fullName || ''}
              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              fullWidth
            />
            <Input
              label="Phone"
              value={editForm.phone || ''}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              fullWidth
            />
            <div>
              <DetailLabel style={{ marginBottom: '0.5rem' }}>Gender</DetailLabel>
              <select
                value={editForm.gender || ''}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as 'M' | 'F' })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--color-neutral-200)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <Input
              label="Academic Status"
              value={editForm.academicStatus || ''}
              onChange={(e) => setEditForm({ ...editForm, academicStatus: e.target.value })}
              fullWidth
            />
            <Input
              label="Professional Status"
              value={editForm.professionalCareerStatus || ''}
              onChange={(e) => setEditForm({ ...editForm, professionalCareerStatus: e.target.value })}
              fullWidth
            />
            <Input
              label="Field of Study"
              value={editForm.generalFieldOfStudy || ''}
              onChange={(e) => setEditForm({ ...editForm, generalFieldOfStudy: e.target.value })}
              fullWidth
            />
            <Input
              label="Specialization"
              value={editForm.fieldOfSpecialization || ''}
              onChange={(e) => setEditForm({ ...editForm, fieldOfSpecialization: e.target.value })}
              fullWidth
            />
            <Input
              label="Organization"
              value={editForm.organization || ''}
              onChange={(e) => setEditForm({ ...editForm, organization: e.target.value })}
              fullWidth
            />
            <Input
              label="Country"
              value={editForm.country || ''}
              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
              fullWidth
            />
          </FormGrid>

          <div style={{ marginTop: '1rem' }}>
            <Textarea
              label="Bio"
              value={editForm.bio || ''}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Member bio..."
              fullWidth
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <DetailLabel style={{ marginBottom: '0.5rem' }}>Membership Status</DetailLabel>
            <select
              value={editForm.membershipStatus || 'active'}
              onChange={(e) => setEditForm({ ...editForm, membershipStatus: e.target.value as Member['membershipStatus'] })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.9375rem',
                outline: 'none',
              }}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <DetailLabel style={{ marginBottom: '0.5rem' }}>Social Links</DetailLabel>
            <FormGrid>
              <Input
                label="Website"
                value={editForm.social?.website || ''}
                onChange={(e) => setEditForm({
                  ...editForm,
                  social: { ...editForm.social, website: e.target.value }
                })}
                placeholder="https://..."
                fullWidth
              />
              <Input
                label="LinkedIn"
                value={editForm.social?.linkedin || ''}
                onChange={(e) => setEditForm({
                  ...editForm,
                  social: { ...editForm.social, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/in/..."
                fullWidth
              />
              <Input
                label="Twitter"
                value={editForm.social?.twitter || ''}
                onChange={(e) => setEditForm({
                  ...editForm,
                  social: { ...editForm.social, twitter: e.target.value }
                })}
                placeholder="https://twitter.com/..."
                fullWidth
              />
            </FormGrid>
          </div>

          <ModalActions>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} isLoading={isSaving}>
              Save Changes
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMember(null);
        }}
        title="Delete Member"
        size="md"
      >
        <ModalContent>
          <DeleteWarning>
            <AlertTriangle size={24} />
            <p>
              Are you sure you want to delete <strong>{selectedMember ? getDisplayName(selectedMember) : ''}</strong>?
              This action cannot be undone and will remove all member data permanently.
            </p>
          </DeleteWarning>

          <ModalActions>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
              Delete Member
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
};
