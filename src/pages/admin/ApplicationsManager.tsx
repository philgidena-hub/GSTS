import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  User,
  CreditCard,
  DollarSign,
  Download,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuthStore } from '../../stores/authStore';

const Wrapper = styled.div``;

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
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 300px;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-neutral-400);
  }

  input {
    padding-left: 2.75rem;
  }
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  color: var(--color-neutral-700);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-neutral-300);
  }
`;

const FilterMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: 0.5rem;
  min-width: 160px;
  z-index: 10;
`;

const FilterOption = styled.button<{ $isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--color-primary-50)' : 'transparent'};
  border: none;
  border-radius: var(--radius-md);
  color: ${({ $isActive }) =>
    $isActive ? 'var(--color-primary-700)' : 'var(--color-neutral-700)'};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-neutral-100);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-neutral-100);
`;

const StatIcon = styled.div<{ $type: 'pending' | 'approved' | 'rejected' | 'payment' }>`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $type }) =>
    $type === 'pending'
      ? 'var(--color-secondary-100)'
      : $type === 'approved'
      ? '#d1fae5'
      : $type === 'payment'
      ? '#dbeafe'
      : '#fee2e2'};
  color: ${({ $type }) =>
    $type === 'pending'
      ? 'var(--color-secondary-600)'
      : $type === 'approved'
      ? 'var(--color-accent-success)'
      : $type === 'payment'
      ? '#2563eb'
      : 'var(--color-accent-error)'};
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const Table = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 150px;
  padding: 1rem 1.5rem;
  background: var(--color-neutral-50);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  border-bottom: 1px solid var(--color-neutral-100);

  @media (max-width: 1200px) {
    grid-template-columns: 2fr 1.5fr 1fr 1fr 150px;
    & > div:nth-of-type(4) {
      display: none;
    }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 150px;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background var(--transition-fast);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--color-neutral-50);
  }

  @media (max-width: 1200px) {
    grid-template-columns: 2fr 1.5fr 1fr 1fr 150px;
    & > div:nth-of-type(4) {
      display: none;
    }
  }

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const ApplicantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
  font-weight: 600;
  flex-shrink: 0;
`;

const ApplicantDetails = styled.div``;

const ApplicantName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-neutral-900);
`;

const ApplicantEmail = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const Cell = styled.div`
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'approved' | 'rejected' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ $status }) =>
    $status === 'pending'
      ? 'var(--color-secondary-100)'
      : $status === 'approved'
      ? '#d1fae5'
      : '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'pending'
      ? 'var(--color-secondary-700)'
      : $status === 'approved'
      ? 'var(--color-accent-success)'
      : 'var(--color-accent-error)'};
`;

const PaymentBadge = styled.span<{ $status?: 'pending' | 'paid' | 'failed' | 'free' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ $status }) =>
    $status === 'paid'
      ? '#d1fae5'
      : $status === 'pending'
      ? '#fef3c7'
      : $status === 'failed'
      ? '#fee2e2'
      : 'var(--color-neutral-100)'};
  color: ${({ $status }) =>
    $status === 'paid'
      ? 'var(--color-accent-success)'
      : $status === 'pending'
      ? '#d97706'
      : $status === 'failed'
      ? 'var(--color-accent-error)'
      : 'var(--color-neutral-600)'};
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

const GenderBadge = styled.span<{ $gender: 'M' | 'F' }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  background: ${({ $gender }) => $gender === 'M' ? '#dbeafe' : '#fce7f3'};
  color: ${({ $gender }) => $gender === 'M' ? '#1d4ed8' : '#be185d'};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'view' | 'approve' | 'reject' }>`
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
      : $variant === 'approve'
      ? '#d1fae5'
      : '#fee2e2'};
  color: ${({ $variant }) =>
    $variant === 'view'
      ? 'var(--color-neutral-700)'
      : $variant === 'approve'
      ? 'var(--color-accent-success)'
      : 'var(--color-accent-error)'};

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const ModalContent = styled.div``;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);

  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const DetailSectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--color-primary-600);
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

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
  font-size: 0.9375rem;
  color: var(--color-neutral-900);
`;

const MotivationText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
  line-height: 1.7;
  background: var(--color-neutral-50);
  padding: 1rem;
  border-radius: var(--radius-lg);
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-neutral-500);
`;

const PaymentInfo = styled.div`
  background: var(--color-neutral-50);
  padding: 1rem;
  border-radius: var(--radius-lg);
`;

const PaymentInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-neutral-200);

  &:last-child {
    border-bottom: none;
  }
`;

const PaymentInfoLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const PaymentInfoValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-neutral-900);
`;

export const ApplicationsManager = () => {
  const { applications, approveApplication, rejectApplication, user, plans, fetchApplications } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = applications.filter((app) => {
    const displayName = app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim();
    const matchesSearch =
      displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    paidApplications: applications.filter((a) => a.paymentStatus === 'paid').length,
  };

  const getPlanName = (planId: string): string => {
    const plan = plans.find(p => p.id === planId);
    return plan?.name || planId || 'N/A';
  };

  const getPlanPrice = (planId: string): number => {
    const plan = plans.find(p => p.id === planId);
    return plan?.price || 0;
  };

  const getDisplayName = (app: typeof applications[0]): string => {
    return app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'N/A';
  };

  const getInitials = (app: typeof applications[0]): string => {
    const name = getDisplayName(app);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    approveApplication(id, user?.email || 'admin');
    setProcessingId(null);
    setSelectedApplication(null);
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    setProcessingId(selectedApplication);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    rejectApplication(selectedApplication, user?.email || 'admin', rejectNotes);
    setProcessingId(null);
    setSelectedApplication(null);
    setIsRejectModalOpen(false);
    setRejectNotes('');
  };

  const currentApplication = applications.find((a) => a.id === selectedApplication);

  const getPaymentStatus = (app: typeof applications[0]): 'paid' | 'pending' | 'failed' | 'free' => {
    const price = getPlanPrice(app.planId);
    if (price === 0) return 'free';
    return app.paymentStatus || 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Export applications to CSV
  const handleExport = () => {
    const headers = ['Full Name', 'Gender', 'Email', 'Phone', 'Academic Status', 'Field of Study', 'Specialization', 'R&D Team', 'Organization', 'Country', 'Plan', 'Payment Status', 'Status', 'Submitted Date'];
    const rows = filteredApplications.map(app => [
      getDisplayName(app),
      app.gender || 'N/A',
      app.email,
      app.phone || '',
      app.academicStatus || app.profession || '',
      app.generalFieldOfStudy || '',
      app.fieldOfSpecialization || '',
      app.rdTeam || '',
      app.organization || '',
      app.country,
      getPlanName(app.planId),
      getPaymentStatus(app),
      app.status,
      formatDate(app.submittedAt),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gsts-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Wrapper>
      <Header>
        <Title>Membership Applications</Title>
        <HeaderActions>
          <Filters>
            <SearchWrapper>
              <Search size={18} />
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </SearchWrapper>
            <FilterDropdown>
              <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <Filter size={18} />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
                <ChevronDown size={16} />
              </FilterButton>
              <AnimatePresence>
                {isFilterOpen && (
                  <FilterMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                      <FilterOption
                        key={status}
                        $isActive={statusFilter === status}
                        onClick={() => {
                          setStatusFilter(status as typeof statusFilter);
                          setIsFilterOpen(false);
                        }}
                      >
                        {status === 'all' ? 'All Status' : status}
                      </FilterOption>
                    ))}
                  </FilterMenu>
                )}
              </AnimatePresence>
            </FilterDropdown>
          </Filters>
          <Button variant="outline" leftIcon={<Download size={18} />} onClick={handleExport}>
            Export
          </Button>
        </HeaderActions>
      </Header>

      <StatsBar>
        <StatItem>
          <StatIcon $type="pending">
            <Clock size={18} />
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon $type="approved">
            <CheckCircle size={18} />
          </StatIcon>
          <StatValue>{stats.approved}</StatValue>
          <StatLabel>Approved</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon $type="rejected">
            <XCircle size={18} />
          </StatIcon>
          <StatValue>{stats.rejected}</StatValue>
          <StatLabel>Rejected</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon $type="payment">
            <DollarSign size={18} />
          </StatIcon>
          <StatValue>{stats.paidApplications}</StatValue>
          <StatLabel>Paid</StatLabel>
        </StatItem>
      </StatsBar>

      <Table>
        <TableHeader>
          <div>Applicant</div>
          <div>Academic Status</div>
          <div>R&D Team</div>
          <div>Payment</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>

        {filteredApplications.length === 0 ? (
          <EmptyState>
            <User size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No applications found</p>
          </EmptyState>
        ) : (
          filteredApplications.map((app) => (
            <TableRow key={app.id}>
              <ApplicantInfo>
                <Avatar>
                  {getInitials(app)}
                </Avatar>
                <ApplicantDetails>
                  <ApplicantName>
                    {getDisplayName(app)}
                    {app.gender && <GenderBadge $gender={app.gender} style={{ marginLeft: '0.5rem' }}>{app.gender}</GenderBadge>}
                  </ApplicantName>
                  <ApplicantEmail>{app.email}</ApplicantEmail>
                </ApplicantDetails>
              </ApplicantInfo>
              <Cell>
                <span style={{ fontSize: '0.8125rem' }}>{app.academicStatus || app.profession || 'N/A'}</span>
              </Cell>
              <Cell>
                <span style={{ fontSize: '0.8125rem' }}>{app.rdTeam ? (app.rdTeam.length > 25 ? app.rdTeam.slice(0, 25) + '...' : app.rdTeam) : 'N/A'}</span>
              </Cell>
              <Cell>
                <PaymentBadge $status={getPaymentStatus(app)}>
                  <CreditCard size={12} />
                  {getPaymentStatus(app)}
                </PaymentBadge>
              </Cell>
              <Cell>
                <StatusBadge $status={app.status}>
                  {app.status === 'pending' ? (
                    <Clock size={12} />
                  ) : app.status === 'approved' ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {app.status}
                </StatusBadge>
              </Cell>
              <Actions>
                <ActionButton
                  $variant="view"
                  onClick={() => setSelectedApplication(app.id)}
                  title="View details"
                >
                  <Eye size={16} />
                </ActionButton>
                {app.status === 'pending' && (
                  <>
                    <ActionButton
                      $variant="approve"
                      onClick={() => handleApprove(app.id)}
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </ActionButton>
                    <ActionButton
                      $variant="reject"
                      onClick={() => {
                        setSelectedApplication(app.id);
                        setIsRejectModalOpen(true);
                      }}
                      title="Reject"
                    >
                      <XCircle size={16} />
                    </ActionButton>
                  </>
                )}
              </Actions>
            </TableRow>
          ))
        )}
      </Table>

      {/* View Application Modal */}
      <Modal
        isOpen={!!selectedApplication && !isRejectModalOpen}
        onClose={() => setSelectedApplication(null)}
        title="Application Details"
        size="lg"
      >
        {currentApplication && (
          <ModalContent>
            {/* Personal Information */}
            <DetailSection>
              <DetailSectionTitle>
                <User size={16} />
                Personal Information
              </DetailSectionTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Full Name</DetailLabel>
                  <DetailValue>{getDisplayName(currentApplication)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Gender</DetailLabel>
                  <DetailValue>
                    {currentApplication.gender ? (
                      <GenderBadge $gender={currentApplication.gender}>
                        {currentApplication.gender === 'M' ? 'Male' : 'Female'}
                      </GenderBadge>
                    ) : 'N/A'}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Email</DetailLabel>
                  <DetailValue>{currentApplication.email}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Phone</DetailLabel>
                  <DetailValue>{currentApplication.phone || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Country</DetailLabel>
                  <DetailValue>{currentApplication.country}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Organization</DetailLabel>
                  <DetailValue>{currentApplication.organization || 'N/A'}</DetailValue>
                </DetailItem>
              </DetailGrid>
            </DetailSection>

            {/* Academic & Professional Information */}
            <DetailSection>
              <DetailSectionTitle>
                <GraduationCap size={16} />
                Academic & Professional Information
              </DetailSectionTitle>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Academic Status</DetailLabel>
                  <DetailValue>{currentApplication.academicStatus || currentApplication.profession || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>General Field of Study</DetailLabel>
                  <DetailValue>{currentApplication.generalFieldOfStudy || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Field of Specialization</DetailLabel>
                  <DetailValue>{currentApplication.fieldOfSpecialization || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Sub-Field of Specialization</DetailLabel>
                  <DetailValue>{currentApplication.subFieldOfSpecialization || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Professional Career Status</DetailLabel>
                  <DetailValue>{currentApplication.professionalCareerStatus || 'N/A'}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>R&D Team</DetailLabel>
                  <DetailValue>{currentApplication.rdTeam || 'N/A'}</DetailValue>
                </DetailItem>
              </DetailGrid>

              {currentApplication.researchInterest && (
                <DetailItem style={{ marginTop: '1rem' }}>
                  <DetailLabel>Research/Business Interest</DetailLabel>
                  <MotivationText>{currentApplication.researchInterest}</MotivationText>
                </DetailItem>
              )}
            </DetailSection>

            {/* Additional Contact Info */}
            {(currentApplication.orcidScopusId || currentApplication.skypeAddress) && (
              <DetailSection>
                <DetailSectionTitle>
                  <Briefcase size={16} />
                  Additional Information
                </DetailSectionTitle>
                <DetailGrid>
                  {currentApplication.orcidScopusId && (
                    <DetailItem>
                      <DetailLabel>ORCID/Scopus ID</DetailLabel>
                      <DetailValue>{currentApplication.orcidScopusId}</DetailValue>
                    </DetailItem>
                  )}
                  {currentApplication.skypeAddress && (
                    <DetailItem>
                      <DetailLabel>Skype Address</DetailLabel>
                      <DetailValue>{currentApplication.skypeAddress}</DetailValue>
                    </DetailItem>
                  )}
                </DetailGrid>
              </DetailSection>
            )}

            {/* Activities & Experiences */}
            {currentApplication.activitiesExperiences && (
              <DetailSection>
                <DetailItem>
                  <DetailLabel>Activities, Experiences & Skills</DetailLabel>
                  <MotivationText>{currentApplication.activitiesExperiences}</MotivationText>
                </DetailItem>
              </DetailSection>
            )}

            {/* Legacy expertise field */}
            {currentApplication.expertise && currentApplication.expertise.length > 0 && (
              <DetailSection>
                <DetailItem>
                  <DetailLabel>Expertise</DetailLabel>
                  <ExpertiseList>
                    {currentApplication.expertise.map((exp, index) => (
                      <ExpertiseTag key={index}>{exp}</ExpertiseTag>
                    ))}
                  </ExpertiseList>
                </DetailItem>
              </DetailSection>
            )}

            {/* Legacy motivation field */}
            {currentApplication.motivation && (
              <DetailSection>
                <DetailItem>
                  <DetailLabel>Motivation</DetailLabel>
                  <MotivationText>{currentApplication.motivation}</MotivationText>
                </DetailItem>
              </DetailSection>
            )}

            {/* Comments */}
            {currentApplication.comments && (
              <DetailSection>
                <DetailItem>
                  <DetailLabel>Comments</DetailLabel>
                  <MotivationText>{currentApplication.comments}</MotivationText>
                </DetailItem>
              </DetailSection>
            )}

            {/* Payment & Plan Info */}
            <DetailSection>
              <DetailSectionTitle>
                <CreditCard size={16} />
                Membership & Payment
              </DetailSectionTitle>
              <PaymentInfo>
                <PaymentInfoRow>
                  <PaymentInfoLabel>Membership Plan</PaymentInfoLabel>
                  <PlanBadge>{getPlanName(currentApplication.planId)}</PlanBadge>
                </PaymentInfoRow>
                <PaymentInfoRow>
                  <PaymentInfoLabel>Plan Price</PaymentInfoLabel>
                  <PaymentInfoValue>
                    {getPlanPrice(currentApplication.planId) === 0
                      ? 'Free'
                      : `$${getPlanPrice(currentApplication.planId)}`}
                  </PaymentInfoValue>
                </PaymentInfoRow>
                <PaymentInfoRow>
                  <PaymentInfoLabel>Payment Status</PaymentInfoLabel>
                  <PaymentBadge $status={getPaymentStatus(currentApplication)}>
                    <CreditCard size={12} />
                    {getPaymentStatus(currentApplication)}
                  </PaymentBadge>
                </PaymentInfoRow>
                {currentApplication.paymentCompletedAt && (
                  <PaymentInfoRow>
                    <PaymentInfoLabel>Payment Date</PaymentInfoLabel>
                    <PaymentInfoValue>
                      {formatDate(currentApplication.paymentCompletedAt)}
                    </PaymentInfoValue>
                  </PaymentInfoRow>
                )}
                <PaymentInfoRow>
                  <PaymentInfoLabel>Application Status</PaymentInfoLabel>
                  <StatusBadge $status={currentApplication.status}>
                    {currentApplication.status}
                  </StatusBadge>
                </PaymentInfoRow>
                <PaymentInfoRow>
                  <PaymentInfoLabel>Submitted</PaymentInfoLabel>
                  <PaymentInfoValue>{formatDate(currentApplication.submittedAt)}</PaymentInfoValue>
                </PaymentInfoRow>
              </PaymentInfo>
            </DetailSection>

            {currentApplication.notes && (
              <DetailSection>
                <DetailItem>
                  <DetailLabel>Review Notes</DetailLabel>
                  <MotivationText>{currentApplication.notes}</MotivationText>
                </DetailItem>
              </DetailSection>
            )}

            {currentApplication.reviewedBy && (
              <DetailItem style={{ marginTop: '1rem' }}>
                <DetailLabel>Reviewed By</DetailLabel>
                <DetailValue>
                  {currentApplication.reviewedBy}
                  {currentApplication.reviewedAt && ` on ${formatDate(currentApplication.reviewedAt)}`}
                </DetailValue>
              </DetailItem>
            )}

            {currentApplication.status === 'pending' && (
              <ModalActions>
                <Button
                  variant="danger"
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(currentApplication.id)}
                  isLoading={processingId === currentApplication.id}
                >
                  Approve Application
                </Button>
              </ModalActions>
            )}
          </ModalContent>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectNotes('');
        }}
        title="Reject Application"
        size="md"
      >
        <ModalContent>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-neutral-600)' }}>
            Please provide a reason for rejecting this application. This will be
            recorded for reference.
          </p>
          <Textarea
            label="Rejection Notes"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Enter reason for rejection..."
            fullWidth
          />
          <ModalActions>
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={processingId === selectedApplication}
            >
              Confirm Rejection
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
};
