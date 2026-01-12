import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, User, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex: 1;
  display: none;
  position: relative;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%);

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LeftBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.2;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 41, 102, 0.9) 0%,
      rgba(0, 51, 128, 0.85) 50%,
      rgba(0, 61, 153, 0.8) 100%
    );
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 500px;
  padding: 3rem;
  text-align: center;
  color: white;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const BrandName = styled.h1`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 3rem;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(5px);
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-secondary-500) 0%, var(--color-secondary-600) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-900);
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;

  @media (max-width: 1023px) {
    background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
    min-height: 100vh;
  }
`;

const MobileBackground = styled.div`
  display: block;
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 80%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  );

  @media (min-width: 1024px) {
    display: none;
  }
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 24px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    0 20px 60px -10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const CardAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-600) 0%, var(--color-secondary-500) 50%, var(--color-primary-600) 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 3s linear infinite;
`;

const CardHeader = styled.div`
  padding: 2.5rem 2.5rem 1.5rem;
  text-align: center;
`;

const MobileLogo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 1.5rem;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileLogoIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MobileLogoText = styled.span`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary-700);
`;

const WelcomeIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-500);
`;

const CardBody = styled.div`
  padding: 0 2.5rem 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ForgotPassword = styled.button`
  font-size: 0.875rem;
  color: var(--color-primary-600);
  text-decoration: none;
  text-align: right;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #dc2626;
  font-size: 0.875rem;
`;

const SuccessMessage = styled(motion.div)`
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  color: #16a34a;
  font-size: 0.875rem;
  text-align: center;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-neutral-200), transparent);
  }

  span {
    font-size: 0.8125rem;
    color: var(--color-neutral-400);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-neutral-700);
  background: white;
  border: 2px solid var(--color-neutral-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-neutral-50);
    border-color: var(--color-neutral-300);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardFooter = styled.div`
  padding: 1.5rem 2.5rem;
  background: linear-gradient(180deg, var(--color-neutral-50) 0%, var(--color-neutral-100) 100%);
  text-align: center;
  border-top: 1px solid var(--color-neutral-100);
`;

const FooterText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-600);

  a, button {
    color: var(--color-primary-600);
    font-weight: 600;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  background: var(--color-neutral-100);
  border-radius: 12px;
  padding: 4px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $active }) => $active ? 'white' : 'transparent'};
  color: ${({ $active }) => $active ? 'var(--color-primary-700)' : 'var(--color-neutral-500)'};
  box-shadow: ${({ $active }) => $active ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'};

  &:hover {
    color: ${({ $active }) => $active ? 'var(--color-primary-700)' : 'var(--color-neutral-700)'};
  }
`;

const PasswordOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary-600);
  }
`;

// Google icon SVG component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const features = [
  { icon: '🌍', text: 'Connect with 5,000+ scholars worldwide' },
  { icon: '🎓', text: 'Access exclusive professional resources' },
  { icon: '🤝', text: 'Collaborate on impactful projects' },
  { icon: '📈', text: 'Advance your career and network' },
];

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, resetPassword, isLoading, error: authError, setError } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const error = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (mode === 'reset') {
      const success = await resetPassword(email);
      if (success) {
        setResetSent(true);
      }
      return;
    }

    if (mode === 'register') {
      if (!firstName || !lastName) {
        setLocalError('Please enter your first and last name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      const success = await register(email, password, { firstName, lastName });
      if (success) {
        navigate('/');
      }
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/admin');
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    setError(null);
    const success = await loginWithGoogle();
    if (success) {
      navigate('/');
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'reset') => {
    setMode(newMode);
    setLocalError('');
    setError(null);
    setResetSent(false);
  };

  return (
    <PageWrapper>
      {/* Left Section - Brand & Features */}
      <LeftSection>
        <LeftBackground>
          <img
            src="/images/Hero_Image.jpg"
            alt=""
          />
        </LeftBackground>
        <LeftContent>
          <BrandLogo>
            <LogoIcon>
              <img src="/images/logo-gsts.png" alt="GSTS Logo" />
            </LogoIcon>
            <BrandName>GSTS</BrandName>
          </BrandLogo>
          <Tagline>
            Global Society of Tigray Scholars and Professionals - Uniting minds,
            transforming futures through knowledge and collaboration.
          </Tagline>
          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureIcon>
                  <span style={{ fontSize: '1.25rem' }}>{feature.icon}</span>
                </FeatureIcon>
                <FeatureText>{feature.text}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </LeftContent>
      </LeftSection>

      {/* Right Section - Login Form */}
      <RightSection>
        <MobileBackground />
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardAccent />
          <CardHeader>
            <MobileLogo to="/">
              <MobileLogoIcon>
                <img src="/images/logo-gsts.png" alt="GSTS Logo" />
              </MobileLogoIcon>
              <MobileLogoText>GSTS</MobileLogoText>
            </MobileLogo>
            <WelcomeIcon>
              {mode === 'login' && <User size={28} />}
              {mode === 'register' && <Sparkles size={28} />}
              {mode === 'reset' && <Mail size={28} />}
            </WelcomeIcon>
            <Title>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </Title>
            <Subtitle>
              {mode === 'login' && 'Sign in to continue to your account'}
              {mode === 'register' && 'Join the global community of scholars'}
              {mode === 'reset' && 'Enter your email to receive reset link'}
            </Subtitle>
          </CardHeader>

          <CardBody>
            {mode !== 'reset' && (
              <TabContainer>
                <Tab $active={mode === 'login'} onClick={() => switchMode('login')}>
                  Sign In
                </Tab>
                <Tab $active={mode === 'register'} onClick={() => switchMode('register')}>
                  Register
                </Tab>
              </TabContainer>
            )}

            {mode !== 'reset' && (
              <>
                <GoogleButton onClick={handleGoogleSignIn} disabled={isLoading}>
                  <GoogleIcon />
                  Continue with Google
                </GoogleButton>
                <Divider><span>or continue with email</span></Divider>
              </>
            )}

            <Form onSubmit={handleSubmit}>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={18} />
                  {error}
                </ErrorMessage>
              )}

              {resetSent && (
                <SuccessMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Password reset email sent! Check your inbox.
                </SuccessMessage>
              )}

              {mode === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    fullWidth
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    fullWidth
                  />
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                required
                fullWidth
              />

              {mode !== 'reset' && (
                <div>
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                    leftIcon={<Lock size={18} />}
                    required
                    fullWidth
                  />
                  <PasswordOptions>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      Show password
                    </CheckboxLabel>
                    {mode === 'login' && (
                      <ForgotPassword type="button" onClick={() => switchMode('reset')}>
                        Forgot password?
                      </ForgotPassword>
                    )}
                  </PasswordOptions>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Link'}
              </Button>

              {mode === 'reset' && (
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => switchMode('login')}
                >
                  Back to Sign In
                </Button>
              )}
            </Form>
          </CardBody>

          <CardFooter>
            <FooterText>
              {mode === 'login' ? (
                <>Want to become a member? <Link to="/membership">Apply for membership</Link></>
              ) : mode === 'register' ? (
                <>Already a member? <Link to="/membership">Apply for full membership</Link></>
              ) : (
                <>Remember your password? <button onClick={() => switchMode('login')}>Sign in</button></>
              )}
            </FooterText>
          </CardFooter>
        </LoginCard>
      </RightSection>
    </PageWrapper>
  );
};
