import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { cloudinaryService } from './cloudinary.service';
import type { Resource, ResourceCategory, ResourceType } from '../types';

const COLLECTION_NAME = 'resources';

class ResourceService {
  // Get all resources (no composite index needed)
  async getResources(): Promise<Resource[]> {
    const resourcesRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(resourcesRef);
    const resources = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
    // Sort client-side to avoid index requirement
    return resources.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  // Get published resources only (client-side filtering)
  async getPublishedResources(): Promise<Resource[]> {
    const allResources = await this.getResources();
    return allResources.filter((r) => r.isPublished);
  }

  // Get resources by category (client-side filtering)
  async getResourcesByCategory(category: ResourceCategory): Promise<Resource[]> {
    const publishedResources = await this.getPublishedResources();
    return publishedResources.filter((r) => r.category === category);
  }

  // Get resources by type (client-side filtering)
  async getResourcesByType(type: ResourceType): Promise<Resource[]> {
    const publishedResources = await this.getPublishedResources();
    return publishedResources.filter((r) => r.type === type);
  }

  // Get featured resources (client-side filtering)
  async getFeaturedResources(): Promise<Resource[]> {
    const publishedResources = await this.getPublishedResources();
    return publishedResources.filter((r) => r.isFeatured);
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

  // Upload file to Cloudinary
  async uploadFile(file: File, _resourceId: string): Promise<{ url: string; fileName: string; fileSize: number; fileType: string }> {
    const result = await cloudinaryService.uploadFile(file, 'resources');

    return {
      url: result.url,
      fileName: file.name,
      fileSize: result.fileSize,
      fileType: file.type,
    };
  }

  // Delete file reference (Cloudinary deletion requires server-side API secret)
  async deleteFile(_fileUrl: string): Promise<void> {
    // Cloudinary deletion requires API secret (server-side only)
    // Files can be managed through Cloudinary dashboard
    console.log('File reference removed. Clean up via Cloudinary dashboard if needed.');
  }

  // Create new resource
  async createResource(
    data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount'>,
    file?: File
  ): Promise<string> {
    const now = new Date().toISOString();
    const resourceData: any = {
      ...data,
      downloadCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // If file is provided, upload it first before creating the document
    if (file) {
      // Create a temporary ID for the file name
      const tempId = Math.random().toString(36).substring(2, 15);
      const fileData = await this.uploadFile(file, tempId);
      resourceData.fileUrl = fileData.url;
      resourceData.fileName = fileData.fileName;
      resourceData.fileSize = fileData.fileSize;
      resourceData.fileType = fileData.fileType;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), resourceData);
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
      updatedAt: new Date().toISOString(),
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
    await updateDoc(docRef, { isFeatured, updatedAt: new Date().toISOString() });
  }

  // Toggle published status
  async togglePublished(id: string, isPublished: boolean): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isPublished, updatedAt: new Date().toISOString() });
  }

  // Search resources
  async searchResources(searchTerm: string): Promise<Resource[]> {
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
