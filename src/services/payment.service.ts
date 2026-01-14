/**
 * Payment Service using Stripe
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your API keys from the Stripe Dashboard
 * 3. Add your publishable key to .env as VITE_STRIPE_PUBLISHABLE_KEY
 * 4. Configure Firebase Functions with your Stripe secret key:
 *    firebase functions:config:set stripe.secret_key="sk_your_key"
 * 5. Deploy Firebase Functions: cd functions && npm install && npm run deploy
 */

import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

// Stripe publishable key - set in .env file
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface PaymentVerification {
  success: boolean;
  applicationId?: string;
  paymentStatus?: string;
  error?: string;
}

// API base URL - uses relative URLs which Firebase Hosting will route to Functions
const API_BASE = '';

export const paymentService = {
  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return !!STRIPE_PUBLISHABLE_KEY;
  },

  /**
   * Initialize Stripe
   */
  async initialize(): Promise<Stripe | null> {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not configured');
      return null;
    }
    return getStripe();
  },

  /**
   * Create a checkout session for membership payment
   */
  async createCheckoutSession(params: {
    planId: string;
    planName: string;
    price: number;
    currency?: string;
    interval: 'monthly' | 'yearly' | 'lifetime';
    customerEmail: string;
    applicationId: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<CheckoutSession> {
    const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        currency: params.currency || 'usd',
        successUrl: params.successUrl || `${window.location.origin}/membership/success`,
        cancelUrl: params.cancelUrl || `${window.location.origin}/membership`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  },

  /**
   * Redirect to Stripe Checkout
   */
  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    // Use the stripe.redirectToCheckout method
    const result = await (stripe as any).redirectToCheckout({ sessionId });
    if (result?.error) {
      throw new Error(result.error.message || 'Failed to redirect to checkout');
    }
  },

  /**
   * Handle successful payment callback
   */
  async verifyPayment(sessionId: string): Promise<PaymentVerification> {
    const response = await fetch(`${API_BASE}/api/verify-payment?session_id=${sessionId}`);

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Payment verification failed' };
    }

    return response.json();
  },

  /**
   * Create a billing portal session for subscription management
   */
  async createPortalSession(customerId: string, returnUrl?: string): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE}/api/create-portal-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        returnUrl: returnUrl || window.location.origin,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    return response.json();
  },

  /**
   * Format price for display
   */
  formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  },

  /**
   * Check if payment is required for a plan
   */
  isPaidPlan(price: number): boolean {
    return price > 0;
  },

  /**
   * Get interval display text
   */
  getIntervalText(interval: 'monthly' | 'yearly' | 'lifetime'): string {
    switch (interval) {
      case 'monthly':
        return '/month';
      case 'yearly':
        return '/year';
      case 'lifetime':
        return ' one-time';
      default:
        return '';
    }
  },
};
