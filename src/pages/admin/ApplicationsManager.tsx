import { useState } from 'react';
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

const StatIcon = styled.div<{ $type: 'pending' | 'approved' | 'rejected' }>`
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
      : '#fee2e2'};
  color: ${({ $type }) =>
    $type === 'pending'
      ? 'var(--color-secondary-600)'
      : $type === 'approved'
      ? 'var(--color-accent-success)'
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
  grid-template-columns: 2fr 1.5fr 1fr 1fr 150px;
  padding: 1rem 1.5rem;
  background: var(--color-neutral-50);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  border-bottom: 1px solid var(--color-neutral-100);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 150px;
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

export const ApplicationsManager = () => {
  const { applications, approveApplication, rejectApplication, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
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

  return (
    <Wrapper>
      <Header>
        <Title>Membership Applications</Title>
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
      </StatsBar>

      <Table>
        <TableHeader>
          <div>Applicant</div>
          <div>Profession</div>
          <div>Country</div>
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
                  {app.firstName[0]}
                  {app.lastName[0]}
                </Avatar>
                <ApplicantDetails>
                  <ApplicantName>
                    {app.firstName} {app.lastName}
                  </ApplicantName>
                  <ApplicantEmail>{app.email}</ApplicantEmail>
                </ApplicantDetails>
              </ApplicantInfo>
              <Cell>{app.profession}</Cell>
              <Cell>{app.country}</Cell>
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
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Full Name</DetailLabel>
                <DetailValue>
                  {currentApplication.firstName} {currentApplication.lastName}
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
                <DetailLabel>Profession</DetailLabel>
                <DetailValue>{currentApplication.profession}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Organization</DetailLabel>
                <DetailValue>{currentApplication.organization || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Country</DetailLabel>
                <DetailValue>{currentApplication.country}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <StatusBadge $status={currentApplication.status}>
                  {currentApplication.status}
                </StatusBadge>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Submitted</DetailLabel>
                <DetailValue>
                  {new Date(currentApplication.submittedAt).toLocaleDateString()}
                </DetailValue>
              </DetailItem>
            </DetailGrid>

            <DetailItem style={{ marginBottom: '1.5rem' }}>
              <DetailLabel>Expertise</DetailLabel>
              <ExpertiseList>
                {currentApplication.expertise.map((exp, index) => (
                  <ExpertiseTag key={index}>{exp}</ExpertiseTag>
                ))}
              </ExpertiseList>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Motivation</DetailLabel>
              <MotivationText>{currentApplication.motivation}</MotivationText>
            </DetailItem>

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
