import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  User,
  Briefcase,
  Globe,
  Award,
  LogOut,
  Edit2,
  Check,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../stores/authStore';
import { membershipService } from '../services/membership.service';
import type { Member, MembershipPlan } from '../types';

const PageWrapper = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem var(--container-padding);
`;

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(Card)`
  padding: 2rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: var(--color-primary-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
  font-size: 2.5rem;
  font-weight: 700;
`;

const MemberName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const MemberEmail = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === 'active'
      ? '#d1fae5'
      : $status === 'pending'
      ? '#fef3c7'
      : '#fee2e2'};
  color: ${({ $status }) =>
    $status === 'active'
      ? '#065f46'
      : $status === 'pending'
      ? '#92400e'
      : '#dc2626'};
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled(Card)`
  padding: 1.5rem;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.9375rem;
  color: var(--color-neutral-900);
`;

const ExpertiseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ExpertiseTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
`;

const PlanCard = styled(Card)<{ $isPopular?: boolean }>`
  padding: 1.5rem;
  border: 2px solid ${({ $isPopular }) =>
    $isPopular ? 'var(--color-primary-500)' : 'var(--color-neutral-100)'};
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PlanInfo = styled.div``;

const PlanName = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const PlanPrice = styled.div`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NotMemberCard = styled(Card)`
  padding: 3rem;
  text-align: center;
`;

const NotMemberIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: var(--color-neutral-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
`;

const NotMemberTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const NotMemberText = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-500);
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const FormRow = styled.div`
  margin-bottom: 1.25rem;
`;

export const MemberPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    linkedin: '',
    twitter: '',
    website: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Helper to get display name from member
  const getDisplayName = (m: Member): string => {
    return m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'N/A';
  };

  // Helper to get initials from member
  const getInitials = (m: Member): string => {
    const name = getDisplayName(m);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch member by email
        const memberData = await membershipService.getMemberByEmail(user.email);
        setMember(memberData);

        if (memberData?.membershipPlanId) {
          const planData = await membershipService.getPlanById(memberData.membershipPlanId);
          setPlan(planData);
        }

        if (memberData) {
          setEditData({
            bio: memberData.bio || '',
            linkedin: memberData.social?.linkedin || '',
            twitter: memberData.social?.twitter || '',
            website: memberData.social?.website || '',
          });
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.email]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!member) return;

    setIsSaving(true);
    try {
      await membershipService.updateMember(member.id, {
        bio: editData.bio,
        social: {
          linkedin: editData.linkedin,
          twitter: editData.twitter,
          website: editData.website,
        },
      });

      setMember({
        ...member,
        bio: editData.bio,
        social: {
          linkedin: editData.linkedin,
          twitter: editData.twitter,
          website: editData.website,
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingWrapper>
            <Loader size={40} />
          </LoadingWrapper>
        </Container>
      </PageWrapper>
    );
  }

  if (!user) {
    return (
      <PageWrapper>
        <Container>
          <NotMemberCard>
            <NotMemberIcon>
              <User size={40} />
            </NotMemberIcon>
            <NotMemberTitle>Please Log In</NotMemberTitle>
            <NotMemberText>
              You need to be logged in to access the member portal.
            </NotMemberText>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </NotMemberCard>
        </Container>
      </PageWrapper>
    );
  }

  if (!member) {
    return (
      <PageWrapper>
        <Container>
          <NotMemberCard>
            <NotMemberIcon>
              <AlertCircle size={40} />
            </NotMemberIcon>
            <NotMemberTitle>Not a Member Yet</NotMemberTitle>
            <NotMemberText>
              You don't have an active membership. Apply today to join our global
              community of scholars and professionals.
            </NotMemberText>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => navigate('/membership')}>
                Become a Member
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </NotMemberCard>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>Member Dashboard</Title>
          <Button variant="ghost" leftIcon={<LogOut size={18} />} onClick={handleLogout}>
            Log Out
          </Button>
        </Header>

        <Grid>
          <ProfileCard>
            <Avatar>
              {getInitials(member)}
            </Avatar>
            <MemberName>
              {getDisplayName(member)}
            </MemberName>
            <MemberEmail>{member.email}</MemberEmail>
            <StatusBadge $status={member.membershipStatus}>
              <Check size={14} />
              {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)} Member
            </StatusBadge>

            <div style={{ marginTop: '1.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 size={16} />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          </ProfileCard>

          <ContentArea>
            {/* Membership Plan */}
            {plan && (
              <PlanCard $isPopular={plan.isPopular}>
                <InfoCardTitle>
                  <Award size={20} />
                  Membership Plan
                </InfoCardTitle>
                <PlanHeader>
                  <PlanInfo>
                    <PlanName>{plan.name}</PlanName>
                    <PlanPrice>
                      ${plan.price}
                      {plan.interval !== 'lifetime' && `/${plan.interval}`}
                      {plan.interval === 'lifetime' && ' (Lifetime)'}
                    </PlanPrice>
                  </PlanInfo>
                  <StatusBadge $status="active">Active</StatusBadge>
                </PlanHeader>
                <p style={{ fontSize: '0.9375rem', color: 'var(--color-neutral-600)' }}>
                  {plan.description}
                </p>
              </PlanCard>
            )}

            {/* Personal Information */}
            <InfoCard>
              <InfoCardTitle>
                <User size={20} />
                Personal Information
              </InfoCardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Academic Status</InfoLabel>
                  <InfoValue>{member.academicStatus || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Professional Status</InfoLabel>
                  <InfoValue>{member.professionalCareerStatus || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Field of Study</InfoLabel>
                  <InfoValue>{member.generalFieldOfStudy || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Specialization</InfoLabel>
                  <InfoValue>{member.fieldOfSpecialization || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>R&D Team</InfoLabel>
                  <InfoValue>{member.rdTeam || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Organization</InfoLabel>
                  <InfoValue>{member.organization || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Country</InfoLabel>
                  <InfoValue>{member.country || 'Not specified'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Member Since</InfoLabel>
                  <InfoValue>
                    {member.joinedDate
                      ? new Date(member.joinedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>

              {member.researchInterest && (
                <div style={{ marginTop: '1.5rem' }}>
                  <InfoLabel>Research Interest</InfoLabel>
                  <InfoValue>{member.researchInterest}</InfoValue>
                </div>
              )}

              {member.bio && (
                <div style={{ marginTop: '1.5rem' }}>
                  <InfoLabel>Bio</InfoLabel>
                  <InfoValue>{member.bio}</InfoValue>
                </div>
              )}
            </InfoCard>

            {/* Expertise */}
            {member.expertise && member.expertise.length > 0 && (
              <InfoCard>
                <InfoCardTitle>
                  <Briefcase size={20} />
                  Areas of Expertise
                </InfoCardTitle>
                <ExpertiseList>
                  {member.expertise.map((exp, index) => (
                    <ExpertiseTag key={index}>{exp}</ExpertiseTag>
                  ))}
                </ExpertiseList>
              </InfoCard>
            )}

            {/* Social Links */}
            {member.social && (member.social.linkedin || member.social.twitter || member.social.website) && (
              <InfoCard>
                <InfoCardTitle>
                  <Globe size={20} />
                  Social Links
                </InfoCardTitle>
                <InfoGrid>
                  {member.social.linkedin && (
                    <InfoItem>
                      <InfoLabel>LinkedIn</InfoLabel>
                      <InfoValue>
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          View Profile
                        </a>
                      </InfoValue>
                    </InfoItem>
                  )}
                  {member.social.twitter && (
                    <InfoItem>
                      <InfoLabel>Twitter</InfoLabel>
                      <InfoValue>
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          View Profile
                        </a>
                      </InfoValue>
                    </InfoItem>
                  )}
                  {member.social.website && (
                    <InfoItem>
                      <InfoLabel>Website</InfoLabel>
                      <InfoValue>
                        <a
                          href={member.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-primary-600)' }}
                        >
                          Visit Website
                        </a>
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </InfoCard>
            )}
          </ContentArea>
        </Grid>
      </Container>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        size="md"
      >
        <FormRow>
          <Input
            label="Bio"
            placeholder="Tell us about yourself..."
            value={editData.bio}
            onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
            fullWidth
          />
        </FormRow>
        <FormRow>
          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/yourprofile"
            value={editData.linkedin}
            onChange={(e) => setEditData((prev) => ({ ...prev, linkedin: e.target.value }))}
            fullWidth
          />
        </FormRow>
        <FormRow>
          <Input
            label="Twitter URL"
            placeholder="https://twitter.com/yourhandle"
            value={editData.twitter}
            onChange={(e) => setEditData((prev) => ({ ...prev, twitter: e.target.value }))}
            fullWidth
          />
        </FormRow>
        <FormRow>
          <Input
            label="Website URL"
            placeholder="https://yourwebsite.com"
            value={editData.website}
            onChange={(e) => setEditData((prev) => ({ ...prev, website: e.target.value }))}
            fullWidth
          />
        </FormRow>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProfile} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
};
