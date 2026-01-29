import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  MessageSquare,
  Newspaper,
  UserCheck,
  ClipboardList,
  BarChart3,
  Layers,
  HelpCircle,
  Handshake,
  UserCog,
  FolderOpen,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePermissions } from '../../hooks/usePermissions';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-neutral-50);
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 280px;
  background: white;
  border-right: 1px solid var(--color-neutral-100);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform var(--transition-base);

  @media (max-width: 1024px) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-primary-700);
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoText = styled.span`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const NavSectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-400);
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  color: ${({ $isActive }) =>
    $isActive ? 'var(--color-primary-700)' : 'var(--color-neutral-600)'};
  background: ${({ $isActive }) =>
    $isActive ? 'var(--color-primary-50)' : 'transparent'};
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition-fast);

  &:hover {
    background: ${({ $isActive }) =>
      $isActive ? 'var(--color-primary-50)' : 'var(--color-neutral-100)'};
    color: ${({ $isActive }) =>
      $isActive ? 'var(--color-primary-700)' : 'var(--color-neutral-900)'};
  }

  svg {
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  background: var(--color-neutral-50);
  margin-bottom: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: var(--color-neutral-500);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  border: none;
  background: transparent;
  color: var(--color-neutral-600);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-accent-error);
    color: white;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--color-neutral-100);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  color: var(--color-neutral-700);
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-neutral-500);

  a {
    color: var(--color-neutral-500);
    text-decoration: none;

    &:hover {
      color: var(--color-primary-600);
    }
  }

  span {
    color: var(--color-neutral-900);
    font-weight: 500;
  }
`;

const ViewSiteButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-primary-100);
  }
`;

const PageContent = styled.div`
  padding: 1.5rem;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;

  @media (max-width: 1024px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  }
`;

// Nav items with permission keys for filtering
const navItems = [
  {
    section: 'Dashboard',
    items: [
      { icon: LayoutDashboard, label: 'Overview', path: '/admin', permission: null },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', permission: null },
    ],
  },
  {
    section: 'Content',
    items: [
      { icon: Home, label: 'Hero Section', path: '/admin/hero', permission: 'canEditHero' as const },
      { icon: FileText, label: 'About', path: '/admin/about', permission: 'canEditAbout' as const },
      { icon: Layers, label: 'Thematic Areas', path: '/admin/thematic-areas', permission: 'canEditServices' as const },
      { icon: ClipboardList, label: 'Projects', path: '/admin/projects', permission: 'canEditProjects' as const },
      { icon: Newspaper, label: 'Blog Posts', path: '/admin/blog', permission: 'canEditBlog' as const },
      { icon: Users, label: 'Team', path: '/admin/team', permission: 'canEditTeam' as const },
      { icon: Handshake, label: 'Partners', path: '/admin/partners', permission: 'canEditPartners' as const },
      { icon: BarChart3, label: 'Statistics', path: '/admin/statistics', permission: 'canEditStatistics' as const },
      { icon: HelpCircle, label: 'FAQs', path: '/admin/faqs', permission: 'canEditFAQs' as const },
      { icon: FolderOpen, label: 'Resources', path: '/admin/resources', permission: 'canEditSettings' as const },
    ],
  },
  {
    section: 'Membership',
    items: [
      { icon: UserCheck, label: 'Members', path: '/admin/members', permission: 'canManageMembers' as const },
      { icon: Briefcase, label: 'Applications', path: '/admin/applications', permission: 'canManageApplications' as const },
    ],
  },
  {
    section: 'Communication',
    items: [
      { icon: MessageSquare, label: 'Contact Messages', path: '/admin/messages', permission: 'canViewMessages' as const },
    ],
  },
  {
    section: 'Settings',
    items: [
      { icon: Settings, label: 'Site Settings', path: '/admin/settings', permission: 'canEditSettings' as const },
    ],
  },
  {
    section: 'User Management',
    superAdminOnly: true,
    items: [
      { icon: UserCog, label: 'Manage Users', path: '/admin/users', permission: 'canManageUsers' as const },
    ],
  },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const permissions = usePermissions();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getCurrentPageTitle = () => {
    for (const section of navItems) {
      for (const item of section.items) {
        if (item.path === location.pathname) {
          return item.label;
        }
      }
    }
    return 'Dashboard';
  };

  return (
    <LayoutWrapper>
      <Overlay $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />

      <Sidebar $isOpen={isSidebarOpen}>
        <SidebarHeader>
          <Logo to="/">
            <LogoImage src="/images/logo-gsts.png" alt="GSTS Logo" />
            <LogoText>GSTS</LogoText>
          </Logo>
        </SidebarHeader>

        <SidebarNav>
          {navItems
            .filter((section) => {
              // Hide super admin only sections from regular admins
              if ('superAdminOnly' in section && section.superAdminOnly && !permissions.isSuperAdmin) {
                return false;
              }
              return true;
            })
            .map((section) => {
              // Filter items based on permissions
              const visibleItems = section.items.filter((item) => {
                if (item.permission === null) return true;
                return permissions[item.permission];
              });

              // Don't render section if no visible items
              if (visibleItems.length === 0) return null;

              return (
                <NavSection key={section.section}>
                  <NavSectionTitle>{section.section}</NavSectionTitle>
                  <NavList>
                    {visibleItems.map((item) => (
                      <NavItem key={item.path}>
                        <NavLink
                          to={item.path}
                          $isActive={location.pathname === item.path}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon size={20} />
                          {item.label}
                        </NavLink>
                      </NavItem>
                    ))}
                  </NavList>
                </NavSection>
              );
            })}
        </SidebarNav>

        <SidebarFooter>
          <UserInfo>
            <UserAvatar>
              {permissions.isSuperAdmin ? 'SA' : 'A'}
            </UserAvatar>
            <UserDetails>
              <UserName>
                {permissions.isSuperAdmin ? 'Super Admin' : 'Admin'}
              </UserName>
              <UserRole>{user?.email}</UserRole>
            </UserDetails>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MobileMenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </MobileMenuButton>
            <Breadcrumbs>
              <a href="/admin">Admin</a>
              <ChevronRight size={14} />
              <span>{getCurrentPageTitle()}</span>
            </Breadcrumbs>
          </div>
          <ViewSiteButton to="/" target="_blank">
            <Home size={16} />
            View Site
          </ViewSiteButton>
        </TopBar>

        <PageContent>
          <Outlet />
        </PageContent>
      </MainContent>
    </LayoutWrapper>
  );
};
