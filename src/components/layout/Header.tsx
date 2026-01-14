import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useContentStore } from '../../stores/contentStore';

// Top Bar Styles
const TopBar = styled.div`
  background: var(--color-primary-900);
  padding: 0.5rem 0;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    display: none;
  }
`;

const TopBarContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const TopBarLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: var(--color-secondary-400);
  }
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const TopBarContact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);

  svg {
    color: var(--color-secondary-400);
  }

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--color-secondary-400);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
`;

const SocialLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--color-secondary-400);
  }
`;

// Main Header Styles
const HeaderWrapper = styled.header<{ $isScrolled: boolean }>`
  position: fixed;
  top: ${({ $isScrolled }) => ($isScrolled ? '0' : '36px')};
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  background: ${({ $isScrolled }) =>
    $isScrolled ? 'white' : 'rgba(0, 41, 102, 0.95)'};
  box-shadow: ${({ $isScrolled }) =>
    $isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none'};

  @media (max-width: 768px) {
    top: 0;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  max-width: var(--container-max);
  margin: 0 auto;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
`;

const LogoImage = styled.img<{ $isScrolled: boolean }>`
  height: 45px;
  width: auto;
  transition: filter 0.3s ease;
  filter: ${({ $isScrolled }) => ($isScrolled ? 'none' : 'brightness(0) invert(1)')};
`;

const LogoTitle = styled.span<{ $isScrolled: boolean }>`
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $isScrolled }) => ($isScrolled ? 'var(--color-primary-800)' : 'white')};
  line-height: 1;
  letter-spacing: 0.3px;
  white-space: nowrap;
  margin-top: 2px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)<{ $isScrolled: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $isScrolled, $isActive }) =>
    $isActive
      ? 'var(--color-secondary-500)'
      : $isScrolled
      ? 'var(--color-neutral-700)'
      : 'white'};
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $isActive }) => ($isActive ? '80%' : '0')};
    height: 3px;
    background: var(--color-secondary-500);
    transition: width 0.2s ease;
  }

  &:hover {
    color: var(--color-secondary-500);

    &::after {
      width: 80%;
    }
  }
`;

const DropdownTrigger = styled.button<{ $isScrolled: boolean; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $isScrolled, $isOpen }) =>
    $isOpen
      ? 'var(--color-secondary-500)'
      : $isScrolled
      ? 'var(--color-neutral-700)'
      : 'white'};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $isOpen }) => ($isOpen ? '80%' : '0')};
    height: 3px;
    background: var(--color-secondary-500);
    transition: width 0.2s ease;
  }

  &:hover {
    color: var(--color-secondary-500);

    &::after {
      width: 80%;
    }
  }

  svg {
    transition: transform 0.2s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  list-style: none;
  margin-top: 0;
  border-top: 3px solid var(--color-secondary-500);
`;

const DropdownItem = styled.li``;

const DropdownLink = styled(Link)`
  display: block;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-neutral-700);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: var(--color-neutral-50);
    color: var(--color-primary-600);
    border-left-color: var(--color-secondary-500);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const JoinButton = styled(Link)<{ $isScrolled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-primary-900);
  background: linear-gradient(135deg, var(--color-secondary-400) 0%, var(--color-secondary-500) 50%, var(--color-secondary-600) 100%);
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(212, 160, 18, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(212, 160, 18, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button<{ $isScrolled: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ $isScrolled }) =>
    $isScrolled ? 'var(--color-neutral-100)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $isScrolled }) =>
    $isScrolled ? 'var(--color-neutral-700)' : 'white'};

  &:hover {
    background: ${({ $isScrolled }) =>
      $isScrolled ? 'var(--color-neutral-200)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const MobileMenuButton = styled.button<{ $isScrolled: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: ${({ $isScrolled }) =>
    $isScrolled ? 'var(--color-neutral-100)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ $isScrolled }) =>
    $isScrolled ? 'var(--color-neutral-700)' : 'white'};
  transition: all 0.2s ease;

  @media (max-width: 1024px) {
    display: flex;
  }

  &:hover {
    background: ${({ $isScrolled }) =>
      $isScrolled ? 'var(--color-neutral-200)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 99;
  padding: 5rem 1.5rem 2rem;
  overflow-y: auto;
`;

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MobileNavItem = styled.li`
  border-bottom: 1px solid var(--color-neutral-100);
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 1rem 0;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-800);
  text-decoration: none;
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Who We Are', href: '/about' },
      { label: 'Board Members', href: '/about/board' },
      { label: 'Our Team', href: '/about/team' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { contactInfo, settings } = useContentStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <TopBar>
        <TopBarContainer>
          <TopBarLeft>
            <TopBarLink to="/support">Support</TopBarLink>
            <TopBarLink to="/careers">Careers</TopBarLink>
            <TopBarLink to="/faqs">FAQs</TopBarLink>
          </TopBarLeft>
          <TopBarRight>
            <TopBarContact>
              <Phone size={14} />
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </TopBarContact>
            <TopBarContact>
              <Mail size={14} />
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </TopBarContact>
            <SocialLinks>
              {settings.social.facebook && (
                <SocialLink href={settings.social.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook size={14} />
                </SocialLink>
              )}
              {settings.social.twitter && (
                <SocialLink href={settings.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter size={14} />
                </SocialLink>
              )}
              {settings.social.linkedin && (
                <SocialLink href={settings.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={14} />
                </SocialLink>
              )}
              {settings.social.instagram && (
                <SocialLink href={settings.social.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram size={14} />
                </SocialLink>
              )}
              {settings.social.youtube && (
                <SocialLink href={settings.social.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube size={14} />
                </SocialLink>
              )}
            </SocialLinks>
          </TopBarRight>
        </TopBarContainer>
      </TopBar>

      {/* Main Header */}
      <HeaderWrapper $isScrolled={isScrolled}>
        <HeaderContainer>
          <Logo to="/">
            <LogoImage src="/images/logo-gsts.png" alt="GSTS Logo" $isScrolled={isScrolled} />
            <LogoTitle $isScrolled={isScrolled}>Global Society of Tigray Scholars</LogoTitle>
          </Logo>

          <Nav>
            <NavList>
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <>
                      <DropdownTrigger
                        $isScrolled={isScrolled}
                        $isOpen={openDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDown size={14} />
                      </DropdownTrigger>
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <DropdownMenu
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                          >
                            {item.children.map((child) => (
                              <DropdownItem key={child.label}>
                                <DropdownLink to={child.href}>
                                  {child.label}
                                </DropdownLink>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink
                      to={item.href}
                      $isScrolled={isScrolled}
                      $isActive={location.pathname === item.href}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </NavItem>
              ))}
            </NavList>
          </Nav>

          <HeaderActions>
            {isAuthenticated ? (
              <UserMenu
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <UserButton $isScrolled={isScrolled}>
                  <UserAvatar>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </UserAvatar>
                  <span>{user?.firstName}</span>
                  <ChevronDown size={16} />
                </UserButton>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <DropdownMenu
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      style={{ right: 0, left: 'auto' }}
                    >
                      {user?.role === 'admin' && (
                        <DropdownItem>
                          <DropdownLink to="/admin">
                            <Settings
                              size={16}
                              style={{ marginRight: '0.5rem' }}
                            />
                            Admin Panel
                          </DropdownLink>
                        </DropdownItem>
                      )}
                      <DropdownItem>
                        <DropdownLink to="/profile">
                          <User size={16} style={{ marginRight: '0.5rem' }} />
                          My Profile
                        </DropdownLink>
                      </DropdownItem>
                      <DropdownItem>
                        <DropdownLink to="#" onClick={handleLogout}>
                          <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                          Logout
                        </DropdownLink>
                      </DropdownItem>
                    </DropdownMenu>
                  )}
                </AnimatePresence>
              </UserMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  style={{
                    color: isScrolled ? 'var(--color-neutral-700)' : 'white',
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <JoinButton to="/membership" $isScrolled={isScrolled}>
                  Join GSTS
                </JoinButton>
              </>
            )}
          </HeaderActions>

          <MobileMenuButton
            $isScrolled={isScrolled}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </HeaderContainer>
      </HeaderWrapper>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavList>
              {navItems.map((item) => (
                <MobileNavItem key={item.label}>
                  <MobileNavLink to={item.href}>{item.label}</MobileNavLink>
                </MobileNavItem>
              ))}
            </MobileNavList>
            <MobileActions>
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => navigate('/admin')}
                    >
                      Admin Panel
                    </Button>
                  )}
                  <Button variant="outline" fullWidth onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/membership')}
                  >
                    Join GSTS
                  </Button>
                </>
              )}
            </MobileActions>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};
