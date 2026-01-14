import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Edit2, Search, Shield, ShieldOff, UserCog, AlertTriangle, Plus, X, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import { collection, getDocs, doc, updateDoc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import type { User, UserRole } from '../../types';

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

const StatsBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const StatCard = styled(Card)`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 150px;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const UsersTable = styled.div`
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

const TableRow = styled.div<{ $isDisabled?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 150px;
  padding: 1rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid var(--color-neutral-100);
  background: ${({ $isDisabled }) => ($isDisabled ? 'var(--color-neutral-50)' : 'transparent')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.7 : 1)};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const UserInfo = styled.div`
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

const UserDetails = styled.div``;

const UserName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-neutral-900);
`;

const UserEmail = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const Cell = styled.div`
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
`;

const RoleBadge = styled.span<{ $role: UserRole }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${({ $role }) =>
    $role === 'super_admin'
      ? '#fef3c7'
      : $role === 'admin'
      ? '#dbeafe'
      : $role === 'member'
      ? '#d1fae5'
      : '#f3f4f6'};
  color: ${({ $role }) =>
    $role === 'super_admin'
      ? '#92400e'
      : $role === 'admin'
      ? '#1e40af'
      : $role === 'member'
      ? '#065f46'
      : '#374151'};
`;

const StatusBadge = styled.span<{ $isDisabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $isDisabled }) => ($isDisabled ? '#fee2e2' : '#d1fae5')};
  color: ${({ $isDisabled }) => ($isDisabled ? '#dc2626' : '#059669')};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'warning' | 'success' }>`
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
    $variant === 'danger'
      ? '#fee2e2'
      : $variant === 'warning'
      ? '#fef3c7'
      : $variant === 'success'
      ? '#d1fae5'
      : 'var(--color-neutral-100)'};
  color: ${({ $variant }) =>
    $variant === 'danger'
      ? '#dc2626'
      : $variant === 'warning'
      ? '#92400e'
      : $variant === 'success'
      ? '#059669'
      : 'var(--color-neutral-700)'};

  &:hover {
    opacity: 0.8;
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

const RoleSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  color: var(--color-neutral-900);
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: 0.5rem;
`;

const WarningBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-radius: var(--radius-lg);
  color: #92400e;
  font-size: 0.875rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-neutral-500);
`;

export const UsersManager = () => {
  const { user: currentUser } = useAuthStore();
  const permissions = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('guest');
  const [isSaving, setIsSaving] = useState(false);

  // Create user state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'admin' as UserRole,
  });
  const [createError, setCreateError] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), orderBy('createdAt', 'desc'))
        );
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Only super_admin can access this page
  if (!permissions.isSuperAdmin) {
    return (
      <PageWrapper>
        <WarningBox>
          <AlertTriangle size={20} />
          <div>
            <strong>Access Denied</strong>
            <p>You don't have permission to access this page. Only Super Admins can manage users.</p>
          </div>
        </WarningBox>
      </PageWrapper>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    superAdmins: users.filter((u) => u.role === 'super_admin').length,
    admins: users.filter((u) => u.role === 'admin').length,
    disabled: users.filter((u) => u.isDisabled).length,
  };

  const handleEditRole = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        role: editRole,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, role: editRole } : u))
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDisabled = async (user: User) => {
    const action = user.isDisabled ? 'enable' : 'disable';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.id), {
        isDisabled: !user.isDisabled,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isDisabled: !u.isDisabled } : u))
      );
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const formatRole = (role: UserRole) => {
    return role === 'super_admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1);
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password || !newUserData.firstName || !newUserData.lastName) {
      setCreateError('All fields are required');
      return;
    }

    if (newUserData.password.length < 6) {
      setCreateError('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    setCreateError('');

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );

      // Create user document in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        email: newUserData.email,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        role: newUserData.role,
        createdAt: new Date().toISOString(),
        isDisabled: false,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      // Add to local state
      setUsers((prev) => [newUser, ...prev]);

      // Reset form and close modal
      setNewUserData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'admin',
      });
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/email-already-in-use') {
        setCreateError('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        setCreateError('Invalid email address');
      } else {
        setCreateError(error.message || 'Failed to create user');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const resetCreateForm = () => {
    setNewUserData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'admin',
    });
    setCreateError('');
    setShowCreateModal(false);
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Users</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={() => setShowCreateModal(true)}
          >
            Add User
          </Button>
        </div>
      </Header>

      <StatsBar>
        <StatCard variant="default">
          <StatIcon $color="var(--color-primary-500)">
            <UserCog size={20} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard variant="default">
          <StatIcon $color="#f59e0b">
            <Shield size={20} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.superAdmins}</StatValue>
            <StatLabel>Super Admins</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard variant="default">
          <StatIcon $color="#3b82f6">
            <Shield size={20} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.admins}</StatValue>
            <StatLabel>Admins</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard variant="default">
          <StatIcon $color="#ef4444">
            <ShieldOff size={20} />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.disabled}</StatValue>
            <StatLabel>Disabled</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsBar>

      {isLoading ? (
        <EmptyState>Loading users...</EmptyState>
      ) : filteredUsers.length === 0 ? (
        <EmptyState>
          {searchQuery ? 'No users found matching your search.' : 'No users found.'}
        </EmptyState>
      ) : (
        <UsersTable>
          <TableHeader>
            <div>User</div>
            <div>Role</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Actions</div>
          </TableHeader>

          {filteredUsers.map((user) => (
            <TableRow key={user.id} $isDisabled={user.isDisabled}>
              <UserInfo>
                <Avatar>
                  {user.firstName?.[0] || '?'}
                  {user.lastName?.[0] || ''}
                </Avatar>
                <UserDetails>
                  <UserName>
                    {user.firstName} {user.lastName}
                    {user.id === currentUser?.id && ' (You)'}
                  </UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
              </UserInfo>
              <Cell>
                <RoleBadge $role={user.role}>{formatRole(user.role)}</RoleBadge>
              </Cell>
              <Cell>
                <StatusBadge $isDisabled={!!user.isDisabled}>
                  {user.isDisabled ? 'Disabled' : 'Active'}
                </StatusBadge>
              </Cell>
              <Cell>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Cell>
              <Actions>
                {user.id !== currentUser?.id && (
                  <>
                    <ActionButton onClick={() => handleEditRole(user)}>
                      <Edit2 size={14} />
                      Role
                    </ActionButton>
                    <ActionButton
                      $variant={user.isDisabled ? 'success' : 'danger'}
                      onClick={() => handleToggleDisabled(user)}
                    >
                      {user.isDisabled ? (
                        <>
                          <Shield size={14} />
                          Enable
                        </>
                      ) : (
                        <>
                          <ShieldOff size={14} />
                          Disable
                        </>
                      )}
                    </ActionButton>
                  </>
                )}
              </Actions>
            </TableRow>
          ))}
        </UsersTable>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <ModalOverlay onClick={() => setEditingUser(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Change User Role</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div>
                <Label>User</Label>
                <p style={{ color: 'var(--color-neutral-700)' }}>
                  {editingUser.firstName} {editingUser.lastName} ({editingUser.email})
                </p>
              </div>
              <div>
                <Label>Role</Label>
                <RoleSelect
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                >
                  <option value="guest">Guest</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </RoleSelect>
              </div>
              {editRole === 'super_admin' && (
                <WarningBox>
                  <AlertTriangle size={18} />
                  <div>
                    <strong>Warning:</strong> Super Admins have full access to all features including user management.
                  </div>
                </WarningBox>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveRole} isLoading={isSaving}>
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <ModalOverlay onClick={resetCreateForm}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Create New User</ModalTitle>
              <ActionButton onClick={resetCreateForm}>
                <X size={18} />
              </ActionButton>
            </ModalHeader>
            <ModalBody>
              {createError && (
                <WarningBox style={{ background: '#fee2e2', color: '#dc2626' }}>
                  <AlertTriangle size={18} />
                  <div>{createError}</div>
                </WarningBox>
              )}
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
              </div>
              <div>
                <Label>Password *</Label>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, password: e.target.value }))}
                  fullWidth
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={newUserData.firstName}
                    onChange={(e) => setNewUserData((prev) => ({ ...prev, firstName: e.target.value }))}
                    fullWidth
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={newUserData.lastName}
                    onChange={(e) => setNewUserData((prev) => ({ ...prev, lastName: e.target.value }))}
                    fullWidth
                  />
                </div>
              </div>
              <div>
                <Label>Role</Label>
                <RoleSelect
                  value={newUserData.role}
                  onChange={(e) => setNewUserData((prev) => ({ ...prev, role: e.target.value as UserRole }))}
                >
                  <option value="guest">Guest</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </RoleSelect>
              </div>
              {newUserData.role === 'super_admin' && (
                <WarningBox>
                  <AlertTriangle size={18} />
                  <div>
                    <strong>Warning:</strong> Super Admins have full access to all features including user management.
                  </div>
                </WarningBox>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={resetCreateForm}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Mail size={16} />}
                onClick={handleCreateUser}
                isLoading={isSaving}
              >
                Create User
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
