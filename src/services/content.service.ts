import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { cloudinaryService } from './cloudinary.service';
import type {
  HeroContent,
  AboutContent,
  ServiceCluster,
  Statistic,
  Project,
  BlogPost,
  TeamMember,
  ContactInfo,
  FAQ,
  SiteSettings,
  Partner,
} from '../types';

// Helper to convert Firestore timestamps
const convertTimestamp = (data: any) => {
  if (data.createdAt instanceof Timestamp) {
    data.createdAt = data.createdAt.toDate().toISOString();
  }
  if (data.updatedAt instanceof Timestamp) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  if (data.date instanceof Timestamp) {
    data.date = data.date.toDate().toISOString();
  }
  return data;
};

export const contentService = {
  // Hero Content
  async getHeroContent(): Promise<HeroContent | null> {
    const docRef = doc(db, 'content', 'hero');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (convertTimestamp(docSnap.data()) as HeroContent) : null;
  },

  async updateHeroContent(data: Partial<HeroContent>): Promise<void> {
    await setDoc(
      doc(db, 'content', 'hero'),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // About Content
  async getAboutContent(): Promise<AboutContent | null> {
    const docRef = doc(db, 'content', 'about');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (convertTimestamp(docSnap.data()) as AboutContent) : null;
  },

  async updateAboutContent(data: Partial<AboutContent>): Promise<void> {
    await setDoc(
      doc(db, 'content', 'about'),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // Services/Clusters
  async getServices(): Promise<ServiceCluster[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'services'), orderBy('createdAt', 'asc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as ServiceCluster[];
  },

  async addService(data: Omit<ServiceCluster, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'services'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateService(id: string, data: Partial<ServiceCluster>): Promise<void> {
    await setDoc(doc(db, 'services', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deleteService(id: string): Promise<void> {
    await deleteDoc(doc(db, 'services', id));
  },

  // Statistics
  async getStatistics(): Promise<Statistic[]> {
    const querySnapshot = await getDocs(collection(db, 'statistics'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Statistic[];
  },

  async updateStatistic(id: string, data: Partial<Statistic>): Promise<void> {
    await setDoc(
      doc(db, 'statistics', id),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Project[];
  },

  async getProjectById(id: string): Promise<Project | null> {
    const docSnap = await getDoc(doc(db, 'projects', id));
    return docSnap.exists()
      ? ({ id: docSnap.id, ...convertTimestamp(docSnap.data()) } as Project)
      : null;
  },

  async addProject(data: Omit<Project, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'projects'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    await setDoc(doc(db, 'projects', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, 'projects', id));
  },

  // Blog Posts
  async getBlogPosts(limitCount?: number): Promise<BlogPost[]> {
    let q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as BlogPost[];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...convertTimestamp(doc.data()) } as BlogPost;
  },

  async addBlogPost(data: Omit<BlogPost, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'blogPosts'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
    await setDoc(doc(db, 'blogPosts', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deleteBlogPost(id: string): Promise<void> {
    await deleteDoc(doc(db, 'blogPosts', id));
  },

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    const querySnapshot = await getDocs(collection(db, 'teamMembers'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as TeamMember[];
  },

  async addTeamMember(data: Omit<TeamMember, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'teamMembers'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<void> {
    await setDoc(doc(db, 'teamMembers', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deleteTeamMember(id: string): Promise<void> {
    await deleteDoc(doc(db, 'teamMembers', id));
  },

  // Contact Info
  async getContactInfo(): Promise<ContactInfo | null> {
    const docRef = doc(db, 'content', 'contact');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (convertTimestamp(docSnap.data()) as ContactInfo) : null;
  },

  async updateContactInfo(data: Partial<ContactInfo>): Promise<void> {
    await setDoc(
      doc(db, 'content', 'contact'),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    const querySnapshot = await getDocs(collection(db, 'faqs'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as FAQ[];
  },

  async addFAQ(data: Omit<FAQ, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'faqs'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateFAQ(id: string, data: Partial<FAQ>): Promise<void> {
    await setDoc(doc(db, 'faqs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deleteFAQ(id: string): Promise<void> {
    await deleteDoc(doc(db, 'faqs', id));
  },

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    const docRef = doc(db, 'content', 'settings');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as SiteSettings) : null;
  },

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
    await setDoc(
      doc(db, 'content', 'settings'),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  },

  // Partners
  async getPartners(): Promise<Partner[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'partners'), orderBy('order', 'asc'))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...convertTimestamp(doc.data()),
    })) as Partner[];
  },

  async addPartner(data: Omit<Partner, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'partners'));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updatePartner(id: string, data: Partial<Partner>): Promise<void> {
    await setDoc(doc(db, 'partners', id), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async deletePartner(id: string): Promise<void> {
    await deleteDoc(doc(db, 'partners', id));
  },

  // File Upload (using Cloudinary)
  async uploadFile(file: File, path: string): Promise<string> {
    // Extract folder from the path (e.g., 'hero/123_image.jpg' -> 'hero')
    const folder = path.split('/')[0] || 'uploads';
    const result = await cloudinaryService.uploadFile(file, folder);
    return result.url;
  },

  async deleteFile(_path: string): Promise<void> {
    // Cloudinary deletion requires API secret (server-side only)
    // Files are managed through Cloudinary dashboard
    console.log('File reference removed. Clean up via Cloudinary dashboard if needed.');
  },
};
