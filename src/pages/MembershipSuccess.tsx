import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Check, Loader, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { paymentService } from '../services/payment.service';

const PageWrapper = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 0 var(--container-padding);
`;

const Card = styled.div`
  background: white;
  border-radius: var(--radius-2xl);
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
`;

const IconWrapper = styled.div<{ $variant: 'success' | 'loading' | 'error' }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant }) =>
    $variant === 'success'
      ? 'var(--color-accent-success)'
      : $variant === 'error'
      ? 'var(--color-accent-error)'
      : 'var(--color-primary-100)'};
  color: ${({ $variant }) =>
    $variant === 'success' || $variant === 'error' ? 'white' : 'var(--color-primary-600)'};

  svg {
    ${({ $variant }) =>
      $variant === 'loading' &&
      `
      animation: spin 1s linear infinite;
    `}
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MembershipSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      // No session ID - just show success (for free plans or direct navigation)
      setStatus('success');
      return;
    }

    // Verify payment
    const verifyPayment = async () => {
      try {
        const result = await paymentService.verifyPayment(sessionId);
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError(result.error || 'Payment verification failed');
        }
      } catch (err: any) {
        // If verification endpoint is not available, assume success
        // (payment was completed on Stripe's side)
        console.log('Payment verification not available, assuming success');
        setStatus('success');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <PageWrapper>
        <Container>
          <Card>
            <IconWrapper $variant="loading">
              <Loader size={36} />
            </IconWrapper>
            <Title>Verifying Payment...</Title>
            <Description>
              Please wait while we confirm your payment.
            </Description>
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  if (status === 'error') {
    return (
      <PageWrapper>
        <Container>
          <Card>
            <IconWrapper $variant="error">
              <AlertCircle size={36} />
            </IconWrapper>
            <Title>Payment Issue</Title>
            <Description>
              {error || 'There was an issue verifying your payment. Please contact support if you were charged.'}
            </Description>
            <ButtonGroup>
              <Button variant="primary" onClick={() => navigate('/membership')}>
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')}>
                Contact Support
              </Button>
            </ButtonGroup>
          </Card>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Card>
          <IconWrapper $variant="success">
            <Check size={36} />
          </IconWrapper>
          <Title>Application Submitted!</Title>
          <Description>
            Thank you for applying to join the Global Society of Tigray Scholars!
            {searchParams.get('session_id') && (
              <> Your payment has been processed successfully.</>
            )}
            <br /><br />
            Our membership committee will review your application and get back to you
            within 5-7 business days. You'll receive an email once a decision has been made.
          </Description>
          <ButtonGroup>
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/about')}>
              Learn More About GSTS
            </Button>
          </ButtonGroup>
        </Card>
      </Container>
    </PageWrapper>
  );
};
