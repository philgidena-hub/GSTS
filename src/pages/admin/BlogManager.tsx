import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, Calendar, Upload, Eye, Image } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { BlogPost } from '../../types';

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

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  width: 300px;

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

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const PostCard = styled(Card)`
  overflow: hidden;
`;

const PostImage = styled.div`
  height: 200px;
  background: var(--color-neutral-100);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--color-primary-600);
  color: white;
  border-radius: var(--radius-md);
`;

const PostContent = styled.div`
  padding: 1.25rem;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const PostTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostExcerpt = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' | 'primary' }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'danger' ? 'var(--color-accent-error)' :
    $variant === 'primary' ? 'var(--color-primary-600)' : 'var(--color-neutral-100)'};
  color: ${({ $variant }) =>
    $variant === 'danger' || $variant === 'primary' ? 'white' : 'var(--color-neutral-700)'};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger' ? '#dc2626' :
      $variant === 'primary' ? 'var(--color-primary-700)' : 'var(--color-neutral-200)'};
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-neutral-100);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-200);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-100);
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
  margin-bottom: 1.5rem;
`;

const ImageUploadArea = styled.div<{ $hasImage: boolean }>`
  border: 2px dashed ${({ $hasImage }) => $hasImage ? 'var(--color-primary-300)' : 'var(--color-neutral-200)'};
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $hasImage }) => $hasImage ? 'var(--color-primary-50)' : 'var(--color-neutral-50)'};

  &:hover {
    border-color: var(--color-primary-400);
    background: var(--color-primary-50);
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin-top: 1rem;

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: var(--radius-md);
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: var(--color-accent-error);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #dc2626;
    }
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadText = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  margin-bottom: 0.25rem;
`;

const UploadHint = styled.p`
  font-size: 0.75rem;
  color: var(--color-neutral-400);
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  color: #dc2626;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  color: #16a34a;
  font-size: 0.875rem;
`;

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

const initialFormData: BlogFormData = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  authorImage: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  image: '',
  slug: '',
};

export const BlogManager = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, uploadFile, isLoading, error } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const authorImageInputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        authorImage: post.authorImage,
        date: post.date,
        category: post.category,
        image: post.image,
        slug: post.slug,
      });
    } else {
      setEditingPost(null);
      setFormData(initialFormData);
    }
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData(initialFormData);
    setSuccessMessage('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !editingPost
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        : {}),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'authorImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const path = `blog/${field}/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.excerpt || !formData.author || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, formData);
        setSuccessMessage('Blog post updated successfully!');
      } else {
        await addBlogPost(formData);
        setSuccessMessage('Blog post created successfully!');
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deleteBlogPost(id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handlePreview = (slug: string) => {
    window.open(`/news/${slug}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Blog Posts</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add Post
          </Button>
        </div>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {filteredPosts.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No blog posts found</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Get started by creating your first blog post'}
          </EmptyText>
          {!searchQuery && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add Post
            </Button>
          )}
        </EmptyState>
      ) : (
        <PostsGrid>
          {filteredPosts.map((post) => (
            <PostCard key={post.id} variant="default">
              <PostImage>
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-neutral-400)' }}>
                    <Image size={48} />
                  </div>
                )}
                <CategoryBadge>{post.category}</CategoryBadge>
              </PostImage>
              <PostContent>
                <PostMeta>
                  <MetaItem>
                    <Calendar size={14} />
                    {formatDate(post.date)}
                  </MetaItem>
                  <MetaItem>By {post.author}</MetaItem>
                </PostMeta>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                <PostActions>
                  <ActionButton $variant="primary" onClick={() => handlePreview(post.slug)}>
                    <Eye size={14} />
                    View
                  </ActionButton>
                  <ActionButton onClick={() => handleOpenModal(post)}>
                    <Edit2 size={14} />
                    Edit
                  </ActionButton>
                  <ActionButton $variant="danger" onClick={() => handleDelete(post.id)}>
                    <Trash2 size={14} />
                    Delete
                  </ActionButton>
                </PostActions>
              </PostContent>
            </PostCard>
          ))}
        </PostsGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <Input
                label="Post Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                fullWidth
              />
              <Input
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="post-url-slug"
                fullWidth
              />
              <Textarea
                label="Excerpt *"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the post (displayed in listings)..."
                fullWidth
              />
              <Textarea
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full post content (supports markdown-like formatting)..."
                fullWidth
                style={{ minHeight: '200px' }}
              />
              <FormRow>
                <Input
                  label="Author Name *"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  fullWidth
                />
                <Input
                  label="Category *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Education, Technology"
                  fullWidth
                />
              </FormRow>
              <FormRow>
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  fullWidth
                />
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Author Image
                  </label>
                  <input
                    ref={authorImageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'authorImage')}
                  />
                  {formData.authorImage ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img
                        src={formData.authorImage}
                        alt="Author"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => authorImageInputRef.current?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => authorImageInputRef.current?.click()}
                      isLoading={uploadingImage}
                    >
                      <Upload size={14} /> Upload Image
                    </Button>
                  )}
                </div>
              </FormRow>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Featured Image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, 'image')}
                />
                <ImageUploadArea
                  $hasImage={!!formData.image}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.image ? (
                    <ImagePreview>
                      <img src={formData.image} alt="Featured" />
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}>
                        <X size={14} />
                      </button>
                    </ImagePreview>
                  ) : (
                    <>
                      <UploadIcon>
                        <Upload size={24} />
                      </UploadIcon>
                      <UploadText>
                        {uploadingImage ? 'Uploading...' : 'Click to upload featured image'}
                      </UploadText>
                      <UploadHint>PNG, JPG up to 5MB</UploadHint>
                    </>
                  )}
                </ImageUploadArea>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isSaving || isLoading}
              >
                {editingPost ? 'Save Changes' : 'Publish Post'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
