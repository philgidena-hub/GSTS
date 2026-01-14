import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Email templates
const EMAIL_TEMPLATES = {
  applicationSubmitted: {
    subject: 'GSTS Membership Application Received',
    getHtml: (data: { firstName: string; lastName: string; planName: string }) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0052cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .highlight { color: #0052cc; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GSTS</h1>
            <p>Global Society of Tigray Scholars</p>
          </div>
          <div class="content">
            <h2>Application Received!</h2>
            <p>Dear <span class="highlight">${data.firstName} ${data.lastName}</span>,</p>
            <p>Thank you for applying to join the Global Society of Tigray Scholars!</p>
            <p>We have received your application for the <span class="highlight">${data.planName}</span> membership plan.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our membership committee will review your application</li>
              <li>You will receive a decision within 5-7 business days</li>
              <li>If approved, you'll receive instructions to complete your membership</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br/>The GSTS Membership Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Global Society of Tigray Scholars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  applicationApproved: {
    subject: 'Congratulations! Your GSTS Membership is Approved',
    getHtml: (data: { firstName: string; lastName: string; planName: string }) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .highlight { color: #059669; font-weight: bold; }
          .button { display: inline-block; background: #0052cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to GSTS!</h1>
          </div>
          <div class="content">
            <h2>Your Application is Approved!</h2>
            <p>Dear <span class="highlight">${data.firstName} ${data.lastName}</span>,</p>
            <p>We are thrilled to inform you that your membership application has been <strong>approved</strong>!</p>
            <p>You are now a <span class="highlight">${data.planName}</span> member of the Global Society of Tigray Scholars.</p>
            <p><strong>Your membership benefits include:</strong></p>
            <ul>
              <li>Access to our global network of 5,000+ scholars</li>
              <li>Participation in exclusive events and workshops</li>
              <li>Collaboration opportunities on impactful projects</li>
              <li>Access to professional development resources</li>
            </ul>
            <p>We're excited to have you as part of our community!</p>
            <p>Best regards,<br/>The GSTS Membership Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Global Society of Tigray Scholars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  applicationRejected: {
    subject: 'Update on Your GSTS Membership Application',
    getHtml: (data: { firstName: string; lastName: string; notes?: string }) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0052cc; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .notes { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GSTS</h1>
            <p>Global Society of Tigray Scholars</p>
          </div>
          <div class="content">
            <h2>Application Status Update</h2>
            <p>Dear ${data.firstName} ${data.lastName},</p>
            <p>Thank you for your interest in joining the Global Society of Tigray Scholars.</p>
            <p>After careful review, we regret to inform you that we are unable to approve your membership application at this time.</p>
            ${data.notes ? `
              <div class="notes">
                <strong>Feedback from our team:</strong>
                <p>${data.notes}</p>
              </div>
            ` : ''}
            <p>We encourage you to:</p>
            <ul>
              <li>Review the membership requirements on our website</li>
              <li>Address any feedback provided above</li>
              <li>Consider reapplying in the future</li>
            </ul>
            <p>If you have questions about this decision, please contact us.</p>
            <p>Best regards,<br/>The GSTS Membership Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Global Society of Tigray Scholars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  newApplicationNotification: {
    subject: 'New GSTS Membership Application',
    getHtml: (data: { firstName: string; lastName: string; email: string; profession: string; planName: string }) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .info-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #0052cc; }
          .button { display: inline-block; background: #0052cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Application</h1>
          </div>
          <div class="content">
            <h2>New Membership Application Received</h2>
            <p>A new membership application has been submitted and requires review.</p>
            <div class="info-box">
              <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Profession:</strong> ${data.profession}</p>
              <p><strong>Plan:</strong> ${data.planName}</p>
            </div>
            <p>Please log in to the admin panel to review this application.</p>
            <a href="https://www.gsts.org/admin/applications" class="button">Review Application</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Global Society of Tigray Scholars. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
};

/**
 * Email Service
 * Uses Firebase Extension "Trigger Email" which watches a 'mail' collection
 * When a document is added to 'mail', the extension sends the email
 */
export const emailService = {
  /**
   * Queue an email to be sent via Firebase Trigger Email extension
   */
  async sendEmail(to: string | string[], subject: string, html: string): Promise<void> {
    try {
      await addDoc(collection(db, 'mail'), {
        to: Array.isArray(to) ? to : [to],
        message: {
          subject,
          html,
        },
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to queue email:', error);
      throw error;
    }
  },

  /**
   * Send application submitted confirmation email
   */
  async sendApplicationSubmittedEmail(
    to: string,
    data: { firstName: string; lastName: string; planName: string }
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.applicationSubmitted;
    await this.sendEmail(to, template.subject, template.getHtml(data));
  },

  /**
   * Send application approved email
   */
  async sendApplicationApprovedEmail(
    to: string,
    data: { firstName: string; lastName: string; planName: string }
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.applicationApproved;
    await this.sendEmail(to, template.subject, template.getHtml(data));
  },

  /**
   * Send application rejected email
   */
  async sendApplicationRejectedEmail(
    to: string,
    data: { firstName: string; lastName: string; notes?: string }
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.applicationRejected;
    await this.sendEmail(to, template.subject, template.getHtml(data));
  },

  /**
   * Send notification to admins about new application
   */
  async sendNewApplicationNotification(
    adminEmails: string[],
    data: { firstName: string; lastName: string; email: string; profession: string; planName: string }
  ): Promise<void> {
    const template = EMAIL_TEMPLATES.newApplicationNotification;
    await this.sendEmail(adminEmails, template.subject, template.getHtml(data));
  },
};
