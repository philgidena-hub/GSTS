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
import type { Member, MembershipApplication, MembershipPlan } from '../types';

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

    // Update application status
    await updateDoc(doc(db, 'membershipApplications', applicationId), {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy,
    });

    // Create new member
    const memberId = await this.addMember({
      email: application.email,
      firstName: application.firstName,
      lastName: application.lastName,
      profession: application.profession,
      organization: application.organization,
      country: application.country,
      membershipPlanId: application.planId,
      membershipStatus: 'active',
      joinedDate: new Date().toISOString(),
      expertise: application.expertise,
    });

    return memberId;
  },

  async rejectApplication(
    applicationId: string,
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    await updateDoc(doc(db, 'membershipApplications', applicationId), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy,
      notes,
    });
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
