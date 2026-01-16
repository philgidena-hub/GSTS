import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { emailService } from './email.service';
import type { Member, MembershipApplication, MembershipPlan } from '../types';

// Admin emails to notify for new applications
const ADMIN_NOTIFICATION_EMAILS = ['admin@gsts.org']; // Configure this

// Helper to convert Firestore timestamps
const convertTimestamp = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate().toISOString();
    }
  });
  return converted;
};

export const membershipService = {
  // Membership Plans
  async getPlans(): Promise<MembershipPlan[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'membershipPlans'), orderBy('price', 'asc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as MembershipPlan[];
  },

  async getPlanById(id: string): Promise<MembershipPlan | null> {
    const docSnap = await getDoc(doc(db, 'membershipPlans', id));
    return docSnap.exists()
      ? ({ id: docSnap.id, ...convertTimestamp(docSnap.data()) } as MembershipPlan)
      : null;
  },

  async addPlan(data: Omit<MembershipPlan, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'membershipPlans'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updatePlan(id: string, data: Partial<MembershipPlan>): Promise<void> {
    await updateDoc(doc(db, 'membershipPlans', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePlan(id: string): Promise<void> {
    await deleteDoc(doc(db, 'membershipPlans', id));
  },

  // Members
  async getMembers(): Promise<Member[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'members'), orderBy('joinedDate', 'desc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Member[];
  },

  async getMemberById(id: string): Promise<Member | null> {
    const docSnap = await getDoc(doc(db, 'members', id));
    return docSnap.exists()
      ? ({ id: docSnap.id, ...convertTimestamp(docSnap.data()) } as Member)
      : null;
  },

  async getMemberByEmail(email: string): Promise<Member | null> {
    const q = query(collection(db, 'members'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...convertTimestamp(doc.data()) } as Member;
  },

  async addMember(data: Omit<Member, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'members'));
    await setDoc(docRef, {
      ...data,
      joinedDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateMember(id: string, data: Partial<Member>): Promise<void> {
    await updateDoc(doc(db, 'members', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteMember(id: string): Promise<void> {
    await deleteDoc(doc(db, 'members', id));
  },

  // Membership Applications
  async getApplications(status?: 'pending' | 'approved' | 'rejected'): Promise<MembershipApplication[]> {
    let q = query(collection(db, 'membershipApplications'), orderBy('submittedAt', 'desc'));
    if (status) {
      q = query(
        collection(db, 'membershipApplications'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as MembershipApplication[];
  },

  async getApplicationById(id: string): Promise<MembershipApplication | null> {
    const docSnap = await getDoc(doc(db, 'membershipApplications', id));
    return docSnap.exists()
      ? ({ id: docSnap.id, ...convertTimestamp(docSnap.data()) } as MembershipApplication)
      : null;
  },

  async submitApplication(
    data: Omit<MembershipApplication, 'id' | 'status' | 'submittedAt'>
  ): Promise<string> {
    const docRef = doc(collection(db, 'membershipApplications'));
    await setDoc(docRef, {
      ...data,
      status: 'pending',
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Get plan name for email
    const plan = await this.getPlanById(data.planId);
    const planName = plan?.name || 'Membership';

    // Extract name for email (use fullName or firstName/lastName)
    const displayName = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Applicant';
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || 'Applicant';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Send confirmation email to applicant
    try {
      await emailService.sendApplicationSubmittedEmail(data.email, {
        firstName,
        lastName,
        planName,
      });

      // Notify admins about new application
      await emailService.sendNewApplicationNotification(ADMIN_NOTIFICATION_EMAILS, {
        firstName,
        lastName,
        email: data.email,
        profession: data.professionalCareerStatus || data.profession || 'Not specified',
        planName,
      });
    } catch (emailError) {
      // Log but don't fail the application submission
      console.error('Failed to send notification emails:', emailError);
    }

    return docRef.id;
  },

  async approveApplication(
    applicationId: string,
    reviewedBy: string
  ): Promise<string> {
    const application = await this.getApplicationById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Get plan to calculate expiry date
    const plan = await this.getPlanById(application.planId);
    const expiryDate = this.calculateExpiryDate(plan?.interval || 'yearly');

    // Update application status
    await updateDoc(doc(db, 'membershipApplications', applicationId), {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy,
    });

    // Extract name parts from fullName or use legacy fields
    const displayName = application.fullName || `${application.firstName || ''} ${application.lastName || ''}`.trim();
    const nameParts = displayName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create new member with all fields from application
    const memberId = await this.addMember({
      email: application.email,
      fullName: application.fullName || displayName,
      firstName,
      lastName,
      gender: application.gender,
      academicStatus: application.academicStatus,
      generalFieldOfStudy: application.generalFieldOfStudy,
      fieldOfSpecialization: application.fieldOfSpecialization,
      subFieldOfSpecialization: application.subFieldOfSpecialization,
      professionalCareerStatus: application.professionalCareerStatus,
      researchInterest: application.researchInterest,
      rdTeam: application.rdTeam,
      country: application.country,
      organization: application.organization,
      phone: application.phone,
      orcidScopusId: application.orcidScopusId,
      skypeAddress: application.skypeAddress,
      activitiesExperiences: application.activitiesExperiences,
      comments: application.comments,
      membershipPlanId: application.planId,
      membershipStatus: 'active',
      joinedDate: new Date().toISOString(),
      expiryDate,
      expertise: application.expertise || [],
    });

    // Send approval email
    try {
      const planName = plan?.name || 'Membership';

      await emailService.sendApplicationApprovedEmail(application.email, {
        firstName,
        lastName,
        planName,
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    return memberId;
  },

  /**
   * Calculate expiry date based on plan interval
   */
  calculateExpiryDate(interval: 'monthly' | 'yearly' | 'lifetime'): string | undefined {
    const now = new Date();

    switch (interval) {
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        return now.toISOString();
      case 'yearly':
        now.setFullYear(now.getFullYear() + 1);
        return now.toISOString();
      case 'lifetime':
        return undefined; // No expiry for lifetime members
      default:
        now.setFullYear(now.getFullYear() + 1);
        return now.toISOString();
    }
  },

  /**
   * Check if a membership is expired
   */
  isMembershipExpired(expiryDate: string | undefined): boolean {
    if (!expiryDate) return false; // Lifetime membership
    return new Date(expiryDate) < new Date();
  },

  /**
   * Get days until membership expires
   */
  getDaysUntilExpiry(expiryDate: string | undefined): number | null {
    if (!expiryDate) return null; // Lifetime membership
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Renew membership for a member
   */
  async renewMembership(memberId: string): Promise<void> {
    const member = await this.getMemberById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const plan = await this.getPlanById(member.membershipPlanId);
    const newExpiryDate = this.calculateExpiryDate(plan?.interval || 'yearly');

    await updateDoc(doc(db, 'members', memberId), {
      membershipStatus: 'active',
      expiryDate: newExpiryDate,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Expire memberships that have passed their expiry date
   * This should be called by a scheduled Firebase Function
   */
  async checkAndExpireMemberships(): Promise<number> {
    const members = await this.getMembers();
    let expiredCount = 0;

    for (const member of members) {
      if (
        member.membershipStatus === 'active' &&
        member.expiryDate &&
        this.isMembershipExpired(member.expiryDate)
      ) {
        await updateDoc(doc(db, 'members', member.id), {
          membershipStatus: 'expired',
          updatedAt: serverTimestamp(),
        });
        expiredCount++;

        // Send expiry notification email
        try {
          const memberName = member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Member';
          await emailService.sendEmail(
            member.email,
            'Your GSTS Membership Has Expired',
            `
              <h2>Membership Expired</h2>
              <p>Dear ${memberName},</p>
              <p>Your GSTS membership has expired. To continue enjoying member benefits, please renew your membership.</p>
              <p>Visit our website to renew your membership today.</p>
            `
          );
        } catch (emailError) {
          console.error('Failed to send expiry email:', emailError);
        }
      }
    }

    return expiredCount;
  },

  async rejectApplication(
    applicationId: string,
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    const application = await this.getApplicationById(applicationId);

    await updateDoc(doc(db, 'membershipApplications', applicationId), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy,
      notes,
    });

    // Send rejection email
    if (application) {
      try {
        const displayName = application.fullName || `${application.firstName || ''} ${application.lastName || ''}`.trim();
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || 'Applicant';
        const lastName = nameParts.slice(1).join(' ') || '';

        await emailService.sendApplicationRejectedEmail(application.email, {
          firstName,
          lastName,
          notes,
        });
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }
    }
  },

  async deleteApplication(id: string): Promise<void> {
    await deleteDoc(doc(db, 'membershipApplications', id));
  },

  // Contact Form Submissions
  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<string> {
    const docRef = doc(collection(db, 'contactSubmissions'));
    await setDoc(docRef, {
      ...data,
      status: 'new',
      submittedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getContactSubmissions(): Promise<any[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'contactSubmissions'), orderBy('submittedAt', 'desc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    }));
  },

  // Newsletter Subscriptions
  async subscribeNewsletter(email: string): Promise<void> {
    await setDoc(doc(db, 'newsletterSubscriptions', email), {
      email,
      subscribedAt: serverTimestamp(),
      status: 'active',
    });
  },

  async unsubscribeNewsletter(email: string): Promise<void> {
    await updateDoc(doc(db, 'newsletterSubscriptions', email), {
      status: 'unsubscribed',
      unsubscribedAt: serverTimestamp(),
    });
  },
};
