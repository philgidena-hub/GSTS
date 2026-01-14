import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe - Add your secret key in Firebase config
// firebase functions:config:set stripe.secret_key="sk_your_key"
const stripe = new Stripe(functions.config().stripe?.secret_key || '', {
  apiVersion: '2023-10-16',
});

// CORS middleware
const corsHandler = cors({ origin: true });

/**
 * Create a Stripe Checkout Session for membership payment
 */
export const createCheckoutSession = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const {
        planId,
        planName,
        price,
        currency = 'usd',
        interval,
        customerEmail,
        applicationId,
        successUrl,
        cancelUrl,
      } = req.body;

      // Create line items based on plan type
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency,
            product_data: {
              name: `GSTS ${planName} Membership`,
              description: `${planName} membership plan for Global Society of Tigray Scholars`,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
            ...(interval !== 'lifetime' && {
              recurring: {
                interval: interval === 'monthly' ? 'month' : 'year',
              },
            }),
          },
          quantity: 1,
        },
      ];

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: interval === 'lifetime' ? 'payment' : 'subscription',
        customer_email: customerEmail,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          applicationId,
          planId,
          planName,
        },
      });

      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

/**
 * Verify payment and update application status
 */
export const verifyPayment = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'GET') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const sessionId = req.query.session_id as string;

      if (!sessionId) {
        res.status(400).json({ error: 'Session ID is required' });
        return;
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const applicationId = session.metadata?.applicationId;

        if (applicationId) {
          // Update application with payment info
          await db.collection('membershipApplications').doc(applicationId).update({
            paymentStatus: 'paid',
            paymentSessionId: sessionId,
            paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        res.json({
          success: true,
          applicationId,
          paymentStatus: session.payment_status,
        });
      } else {
        res.json({
          success: false,
          paymentStatus: session.payment_status,
        });
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

/**
 * Stripe Webhook Handler
 * Handles events like payment completion, subscription updates, etc.
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe?.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const applicationId = session.metadata?.applicationId;

      if (applicationId && session.payment_status === 'paid') {
        // Update application status
        await db.collection('membershipApplications').doc(applicationId).update({
          paymentStatus: 'paid',
          paymentSessionId: session.id,
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Queue confirmation email
        await db.collection('mail').add({
          to: [session.customer_email],
          message: {
            subject: 'GSTS Membership Payment Confirmed',
            html: `
              <h2>Payment Confirmed!</h2>
              <p>Thank you for your payment. Your membership application is now being processed.</p>
              <p>You will receive another email once your application has been reviewed.</p>
            `,
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      console.log('Subscription cancelled:', subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      // Handle failed payment
      console.log('Invoice payment failed:', invoice.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export const createPortalSession = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { customerId, returnUrl } = req.body;

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

/**
 * Trigger Email on new mail document (using Firebase Extension)
 * This function is a fallback if the Trigger Email extension is not installed
 */
export const sendEmail = functions.firestore
  .document('mail/{mailId}')
  .onCreate(async (snap) => {
    // This is handled by the Firebase Trigger Email extension
    // This function serves as documentation and backup
    console.log('New email queued:', snap.id);
  });

/**
 * Scheduled function to check for expired memberships
 * Runs daily at midnight UTC
 */
export const checkExpiredMemberships = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight
  .timeZone('UTC')
  .onRun(async () => {
    console.log('Checking for expired memberships...');

    const membersSnapshot = await db
      .collection('members')
      .where('membershipStatus', '==', 'active')
      .get();

    let expiredCount = 0;
    const now = new Date();

    for (const doc of membersSnapshot.docs) {
      const member = doc.data();
      const expiryDate = member.expiryDate?.toDate?.() || (member.expiryDate ? new Date(member.expiryDate) : null);

      if (expiryDate && expiryDate < now) {
        // Mark membership as expired
        await doc.ref.update({
          membershipStatus: 'expired',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Queue expiry notification email
        await db.collection('mail').add({
          to: [member.email],
          message: {
            subject: 'Your GSTS Membership Has Expired',
            html: `
              <h2>Membership Expired</h2>
              <p>Dear ${member.firstName} ${member.lastName},</p>
              <p>Your GSTS membership has expired on ${expiryDate.toLocaleDateString()}.</p>
              <p>To continue enjoying member benefits, please renew your membership by visiting our website.</p>
              <p>Best regards,<br/>The GSTS Membership Team</p>
            `,
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        expiredCount++;
      }
    }

    console.log(`Expired ${expiredCount} memberships`);
    return null;
  });

/**
 * Scheduled function to send renewal reminders
 * Runs daily at 9 AM UTC - sends reminders 30 and 7 days before expiry
 */
export const sendRenewalReminders = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM UTC
  .timeZone('UTC')
  .onRun(async () => {
    console.log('Sending renewal reminders...');

    const membersSnapshot = await db
      .collection('members')
      .where('membershipStatus', '==', 'active')
      .get();

    let reminderCount = 0;
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    for (const doc of membersSnapshot.docs) {
      const member = doc.data();
      const expiryDate = member.expiryDate?.toDate?.() || (member.expiryDate ? new Date(member.expiryDate) : null);

      if (!expiryDate) continue; // Skip lifetime members

      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Send reminder at 30 days and 7 days before expiry
      if (daysUntilExpiry === 30 || daysUntilExpiry === 7) {
        await db.collection('mail').add({
          to: [member.email],
          message: {
            subject: `Your GSTS Membership Expires in ${daysUntilExpiry} Days`,
            html: `
              <h2>Membership Renewal Reminder</h2>
              <p>Dear ${member.firstName} ${member.lastName},</p>
              <p>Your GSTS membership will expire in <strong>${daysUntilExpiry} days</strong> on ${expiryDate.toLocaleDateString()}.</p>
              <p>To ensure uninterrupted access to member benefits, please renew your membership before it expires.</p>
              <p>Visit our website to renew your membership today.</p>
              <p>Best regards,<br/>The GSTS Membership Team</p>
            `,
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        reminderCount++;
      }
    }

    console.log(`Sent ${reminderCount} renewal reminders`);
    return null;
  });
