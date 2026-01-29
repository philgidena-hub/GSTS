import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Resource, ResourceCategory, ResourceType } from '../types';

const COLLECTION_NAME = 'resources';

class ResourceService {
  // Get all resources
  async getResources(): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const q = query(resourcesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  }

  // Get published resources only
  async getPublishedResources(): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const q = query(
      resourcesRef,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  }

  // Get resources by category
  async getResourcesByCategory(category: ResourceCategory): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const q = query(
      resourcesRef,
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  }

  // Get resources by type
  async getResourcesByType(type: ResourceType): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const q = query(
      resourcesRef,
      where('type', '==', type),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  }

  // Get featured resources
  async getFeaturedResources(): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const q = query(
      resourcesRef,
      where('isFeatured', '==', true),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  }

  // Get single resource by ID
  async getResourceById(id: string): Promise<Resource | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resource;
    }
    return null;
  }

  // Upload file to storage
  async uploadFile(file: File, resourceId: string): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${resourceId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `resources/${fileName}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    };
  }

  // Delete file from storage
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  // Create new resource
  async createResource(
    data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount'>,
    file?: File
  ): Promise<string> {
    const resourceData: any = {
      ...data,
      downloadCount: 0,
      viewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), resourceData);

    // Upload file if provided
    if (file) {
      const fileData = await this.uploadFile(file, docRef.id);
      await updateDoc(docRef, {
        fileUrl: fileData.url,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
      });
    }

    return docRef.id;
  }

  // Update resource
  async updateResource(
    id: string,
    data: Partial<Resource>,
    file?: File
  ): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);

    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // Upload new file if provided
    if (file) {
      // Delete old file if exists
      const existingResource = await this.getResourceById(id);
      if (existingResource?.fileUrl) {
        await this.deleteFile(existingResource.fileUrl);
      }

      const fileData = await this.uploadFile(file, id);
      updateData.fileUrl = fileData.url;
      updateData.fileName = fileData.fileName;
      updateData.fileSize = fileData.fileSize;
      updateData.fileType = fileData.fileType;
    }

    await updateDoc(docRef, updateData);
  }

  // Delete resource
  async deleteResource(id: string): Promise<void> {
    const resource = await this.getResourceById(id);

    // Delete file from storage if exists
    if (resource?.fileUrl) {
      await this.deleteFile(resource.fileUrl);
    }

    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      downloadCount: increment(1),
    });
  }

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  }

  // Toggle featured status
  async toggleFeatured(id: string, isFeatured: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isFeatured, updatedAt: serverTimestamp() });
  }

  // Toggle published status
  async togglePublished(id: string, isPublished: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isPublished, updatedAt: serverTimestamp() });
  }

  // Search resources
  async searchResources(searchTerm: string): Promise<Resource[]> {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar
    const allResources = await this.getPublishedResources();
    const term = searchTerm.toLowerCase();
    return allResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  // Get resource statistics
  async getStatistics(): Promise<{
    total: number;
    published: number;
    documents: number;
    links: number;
    totalDownloads: number;
    totalViews: number;
  }> {
    const resources = await this.getResources();
    return {
      total: resources.length,
      published: resources.filter((r) => r.isPublished).length,
      documents: resources.filter((r) => r.type === 'document').length,
      links: resources.filter((r) => r.type === 'link').length,
      totalDownloads: resources.reduce((sum, r) => sum + (r.downloadCount || 0), 0),
      totalViews: resources.reduce((sum, r) => sum + (r.viewCount || 0), 0),
    };
  }
}

export const resourceService = new ResourceService();
