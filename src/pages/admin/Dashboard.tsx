import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { useContentStore } from '../../stores/contentStore';

const DashboardWrapper = styled.div``;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-500);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  border: 1px solid var(--color-neutral-100);
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${({ $color }) => $color}15;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
`;

const StatTrend = styled.span<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $isPositive }) =>
    $isPositive ? 'var(--color-accent-success)' : 'var(--color-accent-error)'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
`;

const ActivityIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $type }) =>
    $type === 'member'
      ? 'var(--color-primary-100)'
      : $type === 'message'
      ? 'var(--color-secondary-100)'
      : 'var(--color-accent-success)'};
  color: ${({ $type }) =>
    $type === 'member'
      ? 'var(--color-primary-600)'
      : $type === 'message'
      ? 'var(--color-secondary-600)'
      : 'var(--color-accent-success)'};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-neutral-500);
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuickAction = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--color-neutral-700);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
  }
`;

const QuickActionLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
`;

const PendingBadge = styled.span`
  background: var(--color-accent-error);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
`;

export const Dashboard = () => {
  const { members, applications } = useAuthStore();
  const { projects, blogPosts } = useContentStore();

  const pendingApplications = applications.filter((a) => a.status === 'pending');

  const stats = [
    {
      icon: Users,
      color: 'var(--color-primary-600)',
      value: members.length.toString(),
      label: 'Total Members',
      trend: '+12%',
      isPositive: true,
    },
    {
      icon: UserPlus,
      color: 'var(--color-secondary-600)',
      value: pendingApplications.length.toString(),
      label: 'Pending Applications',
      trend: '+5',
      isPositive: true,
    },
    {
      icon: FileText,
      color: 'var(--color-accent-success)',
      value: projects.length.toString(),
      label: 'Active Projects',
      trend: '+2',
      isPositive: true,
    },
    {
      icon: MessageSquare,
      color: '#8b5cf6',
      value: blogPosts.length.toString(),
      label: 'Blog Posts',
      trend: '+3',
      isPositive: true,
    },
  ];

  const recentActivity = [
    {
      type: 'member',
      title: 'New member application received',
      time: '2 hours ago',
    },
    {
      type: 'message',
      title: 'New contact message from John Doe',
      time: '4 hours ago',
    },
    {
      type: 'success',
      title: 'Member application approved',
      time: '6 hours ago',
    },
    {
      type: 'member',
      title: 'New member application received',
      time: '1 day ago',
    },
  ];

  return (
    <DashboardWrapper>
      <Header>
        <Title>Dashboard Overview</Title>
        <Subtitle>Welcome back! Here's what's happening with GSTS.</Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon size={24} />
              </StatIcon>
              <StatTrend $isPositive={stat.isPositive}>
                {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <Card variant="default" padding="lg">
          <SectionTitle>Recent Activity</SectionTitle>
          <ActivityList>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon $type={activity.type}>
                  {activity.type === 'member' ? (
                    <UserPlus size={18} />
                  ) : activity.type === 'message' ? (
                    <MessageSquare size={18} />
                  ) : (
                    <Users size={18} />
                  )}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityTime>
                    <Clock size={12} />
                    {activity.time}
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </Card>

        <Card variant="default" padding="lg">
          <SectionTitle>Quick Actions</SectionTitle>
          <QuickActions>
            <QuickAction href="/admin/applications">
              <QuickActionLabel>Review Applications</QuickActionLabel>
              {pendingApplications.length > 0 && (
                <PendingBadge>{pendingApplications.length}</PendingBadge>
              )}
            </QuickAction>
            <QuickAction href="/admin/blog">
              <QuickActionLabel>Add Blog Post</QuickActionLabel>
              <ArrowUpRight size={18} />
            </QuickAction>
            <QuickAction href="/admin/projects">
              <QuickActionLabel>Manage Projects</QuickActionLabel>
              <ArrowUpRight size={18} />
            </QuickAction>
            <QuickAction href="/admin/hero">
              <QuickActionLabel>Edit Hero Section</QuickActionLabel>
              <ArrowUpRight size={18} />
            </QuickAction>
            <QuickAction href="/admin/settings">
              <QuickActionLabel>Site Settings</QuickActionLabel>
              <ArrowUpRight size={18} />
            </QuickAction>
          </QuickActions>
        </Card>
      </ContentGrid>
    </DashboardWrapper>
  );
};
