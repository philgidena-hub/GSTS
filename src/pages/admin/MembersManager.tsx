import { useState } from 'react';
import styled from '@emotion/styled';
import { Search, Mail, Phone, MapPin, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

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

export const MembersManager = () => {
  const { members } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.membershipStatus === statusFilter;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
          <Button variant="outline" leftIcon={<Download size={18} />}>
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
                  <Th>Joined</Th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id}>
                    <Td>
                      <MemberInfo>
                        <MemberAvatar>
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </MemberAvatar>
                        <div>
                          <MemberName>
                            {member.firstName} {member.lastName}
                          </MemberName>
                          <MemberEmail>{member.profession || 'N/A'}</MemberEmail>
                        </div>
                      </MemberInfo>
                    </Td>
                    <Td>
                      <ContactInfo>
                        <ContactItem>
                          <Mail size={12} />
                          {member.email}
                        </ContactItem>
                        {member.social?.website && (
                          <ContactItem>
                            <Phone size={12} />
                            {member.social.website}
                          </ContactItem>
                        )}
                        {member.country && (
                          <ContactItem>
                            <MapPin size={12} />
                            {member.country}
                          </ContactItem>
                        )}
                      </ContactInfo>
                    </Td>
                    <Td>
                      <PlanBadge>{member.membershipPlanId || 'Basic'}</PlanBadge>
                    </Td>
                    <Td>
                      <StatusBadge $status={member.membershipStatus}>{member.membershipStatus}</StatusBadge>
                    </Td>
                    <Td>
                      <ContactItem>
                        <Calendar size={12} />
                        {member.joinedDate ? formatDate(member.joinedDate) : 'N/A'}
                      </ContactItem>
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
    </PageWrapper>
  );
};
