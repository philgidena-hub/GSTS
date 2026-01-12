import { useState } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, Calendar } from 'lucide-react';
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

const ActionButton = styled.button<{ $variant?: 'danger' }>`
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
    $variant === 'danger' ? 'var(--color-accent-error)' : 'var(--color-neutral-100)'};
  color: ${({ $variant }) =>
    $variant === 'danger' ? 'white' : 'var(--color-neutral-700)'};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger' ? '#dc2626' : 'var(--color-neutral-200)'};
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
  max-width: 700px;
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
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData(initialFormData);
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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingPost) {
      updateBlogPost(editingPost.id, formData);
    } else {
      addBlogPost({
        ...formData,
        id: `blog-${Date.now()}`,
      });
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteBlogPost(id);
    }
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
                    No image
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
              <Input
                label="Post Title"
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
                label="Excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the post..."
                fullWidth
              />
              <Textarea
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Full post content..."
                fullWidth
                style={{ minHeight: '150px' }}
              />
              <FormRow>
                <Input
                  label="Author Name"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  fullWidth
                />
                <Input
                  label="Category"
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
                <Input
                  label="Author Image URL"
                  name="authorImage"
                  value={formData.authorImage}
                  onChange={handleChange}
                  placeholder="/images/author.jpg"
                  fullWidth
                />
              </FormRow>
              <Input
                label="Featured Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/images/blog-image.jpg"
                fullWidth
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<Save size={18} />}
                onClick={handleSave}
                isLoading={isSaving}
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
