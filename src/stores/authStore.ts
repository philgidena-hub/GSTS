import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Member, MembershipApplication, MembershipPlan } from '../types';
import { authService } from '../services/auth.service';
import { membershipService } from '../services/membership.service';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Default membership plans (fallback if Firestore is empty)
const defaultPlans: MembershipPlan[] = [
  {
    id: 'associate',
    name: 'Associate Member',
    price: 0,
    currency: 'USD',
    interval: 'yearly',
    description: 'For students and early-career professionals interested in contributing to GSTS initiatives.',
    features: [
      'Access to member directory',
      'Newsletter subscription',
      'Event notifications',
      'Basic networking access',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Member',
    price: 50,
    currency: 'USD',
    interval: 'yearly',
    description: 'For established professionals looking to actively contribute to GSTS projects and initiatives.',
    features: [
      'All Associate benefits',
      'Voting rights',
      'Project participation',
      'Working group membership',
      'Professional development resources',
      'Priority event registration',
    ],
    isPopular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Member',
    price: 500,
    currency: 'USD',
    interval: 'lifetime',
    description: 'One-time payment for lifetime access to all GSTS benefits and recognition as a founding supporter.',
    features: [
      'All Professional benefits',
      'Lifetime membership status',
      'Leadership opportunities',
      'Special recognition',
      'Exclusive events access',
      'Advisory board eligibility',
    ],
  },
];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  members: Member[];
  applications: MembershipApplication[];
  plans: MembershipPlan[];
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: { firstName: string; lastName: string }) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Firebase data actions
  fetchPlans: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchApplications: (status?: 'pending' | 'approved' | 'rejected') => Promise<void>;

  // Member actions
  addMember: (member: Omit<Member, 'id'>) => Promise<string>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  // Application actions
  submitApplication: (application: Omit<MembershipApplication, 'id' | 'status' | 'submittedAt'>) => Promise<string>;
  approveApplication: (id: string, reviewedBy: string) => Promise<void>;
  rejectApplication: (id: string, reviewedBy: string, notes?: string) => Promise<void>;

  // Plan actions (admin only)
  updatePlan: (id: string, plan: Partial<MembershipPlan>) => Promise<void>;
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => Promise<string>;
  deletePlan: (id: string) => Promise<void>;

  // Initialize auth listener
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      members: [],
      applications: [],
      plans: defaultPlans,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Initialize Firebase auth state listener
      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userData = await authService.getUserData(firebaseUser.uid);
              set({ user: userData, isAuthenticated: true, isLoading: false });
            } catch (error) {
              // User document doesn't exist yet, create basic user
              const user: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                firstName: firebaseUser.displayName?.split(' ')[0] || '',
                lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
                role: 'guest',
                createdAt: new Date().toISOString(),
              };
              set({ user, isAuthenticated: true, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.signIn(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Login failed' });
          return false;
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.signInWithGoogle();
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Google login failed' });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
        }
      },

      register: async (email, password, userData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.signUp(email, password, userData);
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Registration failed' });
          return false;
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
          return true;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Password reset failed' });
          return false;
        }
      },

      // Fetch membership plans from Firestore
      fetchPlans: async () => {
        try {
          const plans = await membershipService.getPlans();
          if (plans.length > 0) {
            set({ plans });
          }
        } catch (error) {
          console.error('Error fetching plans:', error);
          // Keep default plans on error
        }
      },

      // Fetch members from Firestore
      fetchMembers: async () => {
        try {
          const members = await membershipService.getMembers();
          set({ members });
        } catch (error) {
          console.error('Error fetching members:', error);
        }
      },

      // Fetch applications from Firestore
      fetchApplications: async (status) => {
        try {
          const applications = await membershipService.getApplications(status);
          set({ applications });
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      },

      // Submit membership application to Firestore
      submitApplication: async (applicationData) => {
        set({ isLoading: true, error: null });
        try {
          const applicationId = await membershipService.submitApplication(applicationData);
          // Refresh applications list
          const applications = await membershipService.getApplications();
          set({ applications, isLoading: false });
          return applicationId;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Application submission failed' });
          throw error;
        }
      },

      // Approve application in Firestore
      approveApplication: async (id, reviewedBy) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.approveApplication(id, reviewedBy);
          // Refresh both applications and members
          const [applications, members] = await Promise.all([
            membershipService.getApplications(),
            membershipService.getMembers(),
          ]);
          set({ applications, members, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Application approval failed' });
          throw error;
        }
      },

      // Reject application in Firestore
      rejectApplication: async (id, reviewedBy, notes) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.rejectApplication(id, reviewedBy, notes);
          const applications = await membershipService.getApplications();
          set({ applications, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Application rejection failed' });
          throw error;
        }
      },

      // Add member to Firestore
      addMember: async (memberData) => {
        set({ isLoading: true, error: null });
        try {
          const memberId = await membershipService.addMember(memberData);
          const members = await membershipService.getMembers();
          set({ members, isLoading: false });
          return memberId;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to add member' });
          throw error;
        }
      },

      // Update member in Firestore
      updateMember: async (id, memberData) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.updateMember(id, memberData);
          const members = await membershipService.getMembers();
          set({ members, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to update member' });
          throw error;
        }
      },

      // Delete member from Firestore
      deleteMember: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.deleteMember(id);
          const members = await membershipService.getMembers();
          set({ members, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to delete member' });
          throw error;
        }
      },

      // Add plan to Firestore
      addPlan: async (planData) => {
        set({ isLoading: true, error: null });
        try {
          const planId = await membershipService.addPlan(planData);
          const plans = await membershipService.getPlans();
          set({ plans: plans.length > 0 ? plans : get().plans, isLoading: false });
          return planId;
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to add plan' });
          throw error;
        }
      },

      // Update plan in Firestore
      updatePlan: async (id, planData) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.updatePlan(id, planData);
          const plans = await membershipService.getPlans();
          set({ plans: plans.length > 0 ? plans : get().plans, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to update plan' });
          throw error;
        }
      },

      // Delete plan from Firestore
      deletePlan: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await membershipService.deletePlan(id);
          const plans = await membershipService.getPlans();
          set({ plans: plans.length > 0 ? plans : get().plans, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'Failed to delete plan' });
          throw error;
        }
      },
    }),
    {
      name: 'gsts-auth-storage',
      partialize: (state) => ({
        // Only persist user data, not the full lists
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
