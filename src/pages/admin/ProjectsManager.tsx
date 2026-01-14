import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Plus, Edit2, Trash2, Save, X, Search, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useContentStore } from '../../stores/contentStore';
import type { Project } from '../../types';

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

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ProjectCard = styled(Card)`
  overflow: hidden;
`;

const ProjectImage = styled.div`
  height: 180px;
  background: var(--color-neutral-100);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: var(--radius-full);
  background: ${({ $status }) =>
    $status === 'ongoing'
      ? '#10b981'
      : $status === 'completed'
      ? '#0052cc'
      : '#d4a012'};
  color: white;
`;

const ProjectContent = styled.div`
  padding: 1.25rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const ProjectCategory = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
`;

const ProjectDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectActions = styled.div`
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
  max-width: 600px;
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

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-neutral-700);
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  color: var(--color-neutral-900);
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
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

const initialFormData: Omit<Project, 'id'> = {
  title: '',
  description: '',
  category: '',
  image: '',
  status: 'upcoming',
};

export const ProjectsManager = () => {
  const { projects, addProject, updateProject, deleteProject, uploadFile } = useContentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const path = `projects/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        image: project.image,
        status: project.status,
      });
    } else {
      setEditingProject(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject({
        ...formData,
        id: `project-${Date.now()}`,
      } as Project);
    }

    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <Title>Manage Projects</Title>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SearchBox>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>
          <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
            Add Project
          </Button>
        </div>
      </Header>

      {filteredProjects.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No projects found</EmptyTitle>
          <EmptyText>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first project'}
          </EmptyText>
          {!searchQuery && (
            <Button variant="primary" leftIcon={<Plus size={18} />} onClick={() => handleOpenModal()}>
              Add Project
            </Button>
          )}
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} variant="default">
              <ProjectImage>
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-neutral-400)' }}>
                    No image
                  </div>
                )}
                <StatusBadge $status={project.status}>{project.status}</StatusBadge>
              </ProjectImage>
              <ProjectContent>
                <ProjectCategory>{project.category}</ProjectCategory>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ProjectActions>
                  <ActionButton onClick={() => handleOpenModal(project)}>
                    <Edit2 size={14} />
                    Edit
                  </ActionButton>
                  <ActionButton $variant="danger" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={14} />
                    Delete
                  </ActionButton>
                </ProjectActions>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Input
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                fullWidth
              />
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project..."
                fullWidth
              />
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Education, Health, Infrastructure"
                fullWidth
              />
              <div>
                <Label>Project Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                {formData.image ? (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                      <img
                        src={formData.image}
                        alt="Project"
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                      <button
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'white',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadingImage}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--color-neutral-300)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                    }}
                  >
                    {uploadingImage ? (
                      <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>Uploading...</p>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--color-neutral-400)', marginBottom: '0.5rem' }} />
                        <p style={{ color: 'var(--color-neutral-500)', margin: 0, fontSize: '0.875rem' }}>
                          Click to upload project image
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <SelectWrapper>
                <Label>Status</Label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </Select>
              </SelectWrapper>
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
                {editingProject ? 'Save Changes' : 'Add Project'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};
