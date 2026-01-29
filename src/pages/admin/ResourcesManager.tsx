import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Download,
  Star,
  StarOff,
  Upload,
  FileText,
  Link as LinkIcon,
  Video,
  ExternalLink,
  Filter,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { resourceService } from '../../services/resource.service';
import { useAuthStore } from '../../stores/authStore';
import type { Resource, ResourceCategory, ResourceType } from '../../types';
import { resourceCategories } from '../../types';

const PageWrapper = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  width: 280px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.9375rem;
  }

  svg {
    color: var(--color-neutral-400);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--color-neutral-100);
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-600)')};

  &:hover {
    border-color: var(--color-primary-600);
  }
`;

const ResourcesTable = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-100);
`;

const Td = styled.td`
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  color: var(--color-neutral-700);
  border-bottom: 1px solid var(--color-neutral-100);
`;

const ResourceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ResourceIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: ${({ $type }) =>
    $type === 'document'
      ? 'var(--color-primary-100)'
      : $type === 'link'
      ? '#d1fae5'
      : $type === 'video'
      ? '#fee2e2'
      : $type === 'publication'
      ? '#fef3c7'
      : 'var(--color-neutral-100)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type }) =>
    $type === 'document'
      ? 'var(--color-primary-600)'
      : $type === 'link'
      ? '#059669'
      : $type === 'video'
      ? '#dc2626'
      : $type === 'publication'
      ? '#d97706'
      : 'var(--color-neutral-600)'};
`;

const ResourceTitle = styled.div`
  font-weight: 500;
  color: var(--color-neutral-900);
`;

const ResourceSubtitle = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const StatusBadge = styled.span<{ $status: 'published' | 'draft' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: ${({ $status }) => ($status === 'published' ? '#10b98120' : '#f59e0b20')};
  color: ${({ $status }) => ($status === 'published' ? '#10b981' : '#f59e0b')};
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'view' | 'edit' | 'delete' | 'star' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: ${({ $variant }) =>
    $variant === 'view'
      ? 'var(--color-neutral-100)'
      : $variant === 'edit'
      ? 'var(--color-primary-50)'
      : $variant === 'star'
      ? '#fef3c7'
      : '#fee2e2'};
  color: ${({ $variant }) =>
    $variant === 'view'
      ? 'var(--color-neutral-700)'
      : $variant === 'edit'
      ? 'var(--color-primary-600)'
      : $variant === 'star'
      ? '#d97706'
      : 'var(--color-accent-error)'};

  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
`;

const ModalContent = styled.div``;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormFullWidth = styled.div`
  grid-column: 1 / -1;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: 0.5rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: var(--color-primary-500);
  }
`;

const FileUploadArea = styled.div<{ $isDragOver?: boolean }>`
  border: 2px dashed ${({ $isDragOver }) => ($isDragOver ? 'var(--color-primary-500)' : 'var(--color-neutral-300)')};
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $isDragOver }) => ($isDragOver ? 'var(--color-primary-50)' : 'var(--color-neutral-50)')};

  &:hover {
    border-color: var(--color-primary-500);
    background: var(--color-primary-50);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  margin-top: 0.5rem;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 500;
  color: var(--color-neutral-900);
`;

const FileSize = styled.div`
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  min-height: 48px;
  cursor: text;

  &:focus-within {
    border-color: var(--color-primary-500);
  }

  input {
    flex: 1;
    min-width: 100px;
    border: none;
    outline: none;
    padding: 0.25rem;
    font-size: 0.9375rem;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    color: inherit;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  color: var(--color-neutral-700);

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const DeleteWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;

  svg {
    color: #ef4444;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: var(--color-neutral-700);
    font-size: 0.9375rem;
    line-height: 1.5;
  }
`;

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case 'document':
      return <FileText size={18} />;
    case 'link':
      return <LinkIcon size={18} />;
    case 'video':
      return <Video size={18} />;
    case 'publication':
      return <FileText size={18} />;
    default:
      return <FileText size={18} />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
};

export const ResourcesManager = () => {
  const { user } = useAuthStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    documents: 0,
    links: 0,
    totalDownloads: 0,
  });
  const [, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document' as ResourceType,
    category: 'research-papers' as ResourceCategory,
    externalUrl: '',
    videoUrl: '',
    thumbnailUrl: '',
    author: '',
    publishedDate: '',
    tags: [] as string[],
    isFeatured: false,
    isPublished: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const [allResources, statistics] = await Promise.all([
        resourceService.getResources(),
        resourceService.getStatistics(),
      ]);
      setResources(allResources);
      setStats(statistics);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'document',
      category: 'research-papers',
      externalUrl: '',
      videoUrl: '',
      thumbnailUrl: '',
      author: '',
      publishedDate: '',
      tags: [],
      isFeatured: false,
      isPublished: true,
    });
    setSelectedFile(null);
    setTagInput('');
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      externalUrl: resource.externalUrl || '',
      videoUrl: resource.videoUrl || '',
      thumbnailUrl: resource.thumbnailUrl || '',
      author: resource.author || '',
      publishedDate: resource.publishedDate || '',
      tags: resource.tags,
      isFeatured: resource.isFeatured,
      isPublished: resource.isPublished,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteModalOpen(true);
  };

  const handleSaveCreate = async () => {
    setIsSaving(true);
    try {
      await resourceService.createResource(
        {
          ...formData,
          createdBy: user?.id || '',
        },
        selectedFile || undefined
      );
      setIsCreateModalOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error creating resource:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedResource) return;
    setIsSaving(true);
    try {
      await resourceService.updateResource(
        selectedResource.id,
        formData,
        selectedFile || undefined
      );
      setIsEditModalOpen(false);
      setSelectedResource(null);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedResource) return;
    setIsDeleting(true);
    try {
      await resourceService.deleteResource(selectedResource.id);
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (resource: Resource) => {
    try {
      await resourceService.toggleFeatured(resource.id, !resource.isFeatured);
      fetchResources();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleTogglePublished = async (resource: Resource) => {
    try {
      await resourceService.togglePublished(resource.id, !resource.isPublished);
      fetchResources();
    } catch (error) {
      console.error('Error toggling published:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const getCategoryName = (category: ResourceCategory) => {
    return resourceCategories.find((c) => c.id === category)?.name || category;
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Resources</Title>
        <HeaderActions>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={handleCreate}>
            Add Resource
          </Button>
        </HeaderActions>
      </Header>

      <StatsRow>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Resources</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.published}</StatValue>
          <StatLabel>Published</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.documents}</StatValue>
          <StatLabel>Documents</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.links}</StatValue>
          <StatLabel>Links</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalDownloads}</StatValue>
          <StatLabel>Total Downloads</StatLabel>
        </StatCard>
      </StatsRow>

      <FilterTabs>
        <FilterTab $active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>
          <Filter size={14} style={{ marginRight: '0.5rem' }} />
          All
        </FilterTab>
        {resourceCategories.map((cat) => (
          <FilterTab
            key={cat.id}
            $active={filterCategory === cat.id}
            onClick={() => setFilterCategory(cat.id)}
          >
            {cat.name}
          </FilterTab>
        ))}
      </FilterTabs>

      <ResourcesTable>
        {filteredResources.length === 0 ? (
          <EmptyState>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.3, color: 'var(--color-neutral-400)' }} />
            <EmptyTitle>No resources found</EmptyTitle>
            <EmptyText>
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Click "Add Resource" to create your first resource'}
            </EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Resource</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Downloads</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id}>
                  <Td>
                    <ResourceInfo>
                      <ResourceIcon $type={resource.type}>
                        {getTypeIcon(resource.type)}
                      </ResourceIcon>
                      <div>
                        <ResourceTitle>
                          {resource.title}
                          {resource.isFeatured && (
                            <Star
                              size={14}
                              fill="#d97706"
                              color="#d97706"
                              style={{ marginLeft: '0.5rem' }}
                            />
                          )}
                        </ResourceTitle>
                        <ResourceSubtitle>
                          {resource.type === 'document' && resource.fileName
                            ? `${resource.fileName} (${formatFileSize(resource.fileSize)})`
                            : resource.type === 'video' && resource.videoUrl
                            ? resource.videoUrl
                            : resource.type === 'publication'
                            ? resource.fileName
                              ? `${resource.fileName} (${formatFileSize(resource.fileSize)})`
                              : resource.externalUrl || 'Publication'
                            : resource.externalUrl || resource.type}
                        </ResourceSubtitle>
                      </div>
                    </ResourceInfo>
                  </Td>
                  <Td>
                    <CategoryBadge>{getCategoryName(resource.category)}</CategoryBadge>
                  </Td>
                  <Td>
                    <StatusBadge
                      $status={resource.isPublished ? 'published' : 'draft'}
                      onClick={() => handleTogglePublished(resource)}
                      style={{ cursor: 'pointer' }}
                    >
                      {resource.isPublished ? 'Published' : 'Draft'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Download size={14} /> {resource.downloadCount || 0}
                      <Eye size={14} style={{ marginLeft: '0.5rem' }} /> {resource.viewCount || 0}
                    </span>
                  </Td>
                  <Td>
                    <Actions>
                      <ActionButton
                        $variant="star"
                        onClick={() => handleToggleFeatured(resource)}
                        title={resource.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {resource.isFeatured ? <StarOff size={16} /> : <Star size={16} />}
                      </ActionButton>
                      {(resource.fileUrl || resource.externalUrl || resource.videoUrl) && (
                        <ActionButton
                          $variant="view"
                          onClick={() => window.open(
                            resource.fileUrl || resource.videoUrl || resource.externalUrl,
                            '_blank'
                          )}
                          title="View/Open"
                        >
                          <ExternalLink size={16} />
                        </ActionButton>
                      )}
                      <ActionButton
                        $variant="edit"
                        onClick={() => handleEdit(resource)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </ActionButton>
                      <ActionButton
                        $variant="delete"
                        onClick={() => handleDelete(resource)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </Actions>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ResourcesTable>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedResource(null);
          resetForm();
        }}
        title={isCreateModalOpen ? 'Add New Resource' : 'Edit Resource'}
        size="lg"
      >
        <ModalContent>
          <FormGrid>
            <FormFullWidth>
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title"
                fullWidth
              />
            </FormFullWidth>

            <div>
              <FormLabel>Type</FormLabel>
              <FormSelect
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ResourceType })}
              >
                <option value="document">Document (PDF, DOC, etc.)</option>
                <option value="link">External Link</option>
                <option value="video">Video</option>
                <option value="publication">Publication</option>
              </FormSelect>
            </div>

            <div>
              <FormLabel>Category</FormLabel>
              <FormSelect
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
              >
                {resourceCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </FormSelect>
            </div>

            <FormFullWidth>
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this resource"
                fullWidth
              />
            </FormFullWidth>

            {/* Document Type - File Upload */}
            {formData.type === 'document' && (
              <FormFullWidth>
                <FormLabel>Upload File *</FormLabel>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  style={{ display: 'none' }}
                />
                <FileUploadArea
                  $isDragOver={isDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <Upload size={32} style={{ marginBottom: '0.5rem', color: 'var(--color-neutral-400)' }} />
                  <p style={{ margin: 0, color: 'var(--color-neutral-600)' }}>
                    Drag and drop a file here, or click to browse
                  </p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--color-neutral-400)' }}>
                    Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP
                  </p>
                </FileUploadArea>
                {selectedFile && (
                  <FileInfo>
                    <FileText size={24} color="var(--color-primary-600)" />
                    <FileDetails>
                      <FileName>{selectedFile.name}</FileName>
                      <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                    </FileDetails>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X size={16} />
                    </Button>
                  </FileInfo>
                )}
                {isEditModalOpen && selectedResource?.fileName && !selectedFile && (
                  <FileInfo>
                    <FileText size={24} color="var(--color-primary-600)" />
                    <FileDetails>
                      <FileName>{selectedResource.fileName}</FileName>
                      <FileSize>{formatFileSize(selectedResource.fileSize)}</FileSize>
                    </FileDetails>
                  </FileInfo>
                )}
              </FormFullWidth>
            )}

            {/* External Link Type - URL */}
            {formData.type === 'link' && (
              <FormFullWidth>
                <Input
                  label="External URL *"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://example.com/resource"
                  fullWidth
                />
              </FormFullWidth>
            )}

            {/* Video Type - Video URL + Thumbnail */}
            {formData.type === 'video' && (
              <>
                <FormFullWidth>
                  <Input
                    label="Video URL *"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    fullWidth
                  />
                </FormFullWidth>
                <FormFullWidth>
                  <Input
                    label="Thumbnail URL (optional)"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://example.com/thumbnail.jpg"
                    fullWidth
                  />
                </FormFullWidth>
              </>
            )}

            {/* Publication Type - File Upload + External Link (DOI) */}
            {formData.type === 'publication' && (
              <>
                <FormFullWidth>
                  <FormLabel>Upload File (optional)</FormLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                  <FileUploadArea
                    $isDragOver={isDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload size={32} style={{ marginBottom: '0.5rem', color: 'var(--color-neutral-400)' }} />
                    <p style={{ margin: 0, color: 'var(--color-neutral-600)' }}>
                      Drag and drop a file here, or click to browse
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--color-neutral-400)' }}>
                      Supported: PDF, DOC, DOCX
                    </p>
                  </FileUploadArea>
                  {selectedFile && (
                    <FileInfo>
                      <FileText size={24} color="var(--color-primary-600)" />
                      <FileDetails>
                        <FileName>{selectedFile.name}</FileName>
                        <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
                      </FileDetails>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X size={16} />
                      </Button>
                    </FileInfo>
                  )}
                  {isEditModalOpen && selectedResource?.fileName && !selectedFile && (
                    <FileInfo>
                      <FileText size={24} color="var(--color-primary-600)" />
                      <FileDetails>
                        <FileName>{selectedResource.fileName}</FileName>
                        <FileSize>{formatFileSize(selectedResource.fileSize)}</FileSize>
                      </FileDetails>
                    </FileInfo>
                  )}
                </FormFullWidth>
                <FormFullWidth>
                  <Input
                    label="DOI / Journal Link (optional)"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://doi.org/... or journal URL"
                    fullWidth
                  />
                </FormFullWidth>
              </>
            )}

            <Input
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Resource author or source"
              fullWidth
            />

            <Input
              label="Published Date"
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
              fullWidth
            />

            <FormFullWidth>
              <FormLabel>Tags (press Enter to add)</FormLabel>
              <TagsInput>
                {formData.tags.map((tag) => (
                  <Tag key={tag}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X size={12} />
                    </button>
                  </Tag>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tags..."
                />
              </TagsInput>
            </FormFullWidth>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
              Published (visible to public)
            </CheckboxLabel>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              Featured (show on homepage)
            </CheckboxLabel>
          </FormGrid>

          <ModalActions>
            <Button
              variant="ghost"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={isCreateModalOpen ? handleSaveCreate : handleSaveEdit}
              isLoading={isSaving}
            >
              {isCreateModalOpen ? 'Create Resource' : 'Save Changes'}
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedResource(null);
        }}
        title="Delete Resource"
        size="md"
      >
        <ModalContent>
          <DeleteWarning>
            <AlertTriangle size={24} />
            <p>
              Are you sure you want to delete <strong>{selectedResource?.title}</strong>?
              This action cannot be undone and will also delete any associated files.
            </p>
          </DeleteWarning>

          <ModalActions>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} isLoading={isDeleting}>
              Delete Resource
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
};
