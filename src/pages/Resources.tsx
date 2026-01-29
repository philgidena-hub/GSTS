import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  User,
  Filter,
  Grid,
  List,
  FileCheck,
  GraduationCap,
  BarChart3,
  Mail,
  Presentation,
  Wrench,
  Link as LinkIcon,
  Folder,
  Tag,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { resourceService } from '../services/resource.service';
import type { Resource, ResourceCategory } from '../types';
import { resourceCategories } from '../types';

const PageWrapper = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%);
  position: relative;
  overflow: hidden;
`;

const HeroPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle at 20% 80%,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 50%
  );
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-md);
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    color: var(--color-neutral-800);

    &::placeholder {
      color: var(--color-neutral-400);
    }
  }

  svg {
    color: var(--color-neutral-400);
  }
`;

const MainSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--color-neutral-50);
  min-height: 60vh;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
`;

const SidebarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--color-primary-600);
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li<{ $active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? 'var(--color-primary-50)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-primary-700)' : 'var(--color-neutral-600)')};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  font-size: 0.9375rem;

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
`;

const CategoryCount = styled.span`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  color: var(--color-neutral-500);
`;

const MainContent = styled.div``;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultsCount = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-600);

  strong {
    color: var(--color-neutral-900);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.25rem;
  background: white;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  border: none;
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-500)')};
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-100)')};
  }
`;

const MobileFilters = styled.div`
  display: none;
  margin-bottom: 1.5rem;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const MobileFilterSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
  }
`;

const ResourcesGrid = styled.div<{ $view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${({ $view }) =>
    $view === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr'};
  gap: 1.25rem;
`;

const ResourceCard = styled(motion.div)<{ $view: 'grid' | 'list' }>`
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  display: ${({ $view }) => ($view === 'list' ? 'flex' : 'block')};

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ResourceIcon = styled.div<{ $type: string; $view: 'grid' | 'list' }>`
  width: ${({ $view }) => ($view === 'list' ? '80px' : '100%')};
  height: ${({ $view }) => ($view === 'list' ? '80px' : '140px')};
  background: ${({ $type }) =>
    $type === 'document'
      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
      : $type === 'link'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : $type === 'video'
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  svg {
    width: ${({ $view }) => ($view === 'list' ? '28px' : '40px')};
    height: ${({ $view }) => ($view === 'list' ? '28px' : '40px')};
  }
`;

const ResourceContent = styled.div`
  padding: 1.25rem;
  flex: 1;
`;

const ResourceCategory_Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  margin-bottom: 0.75rem;
`;

const ResourceTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ResourceDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResourceMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
  margin-bottom: 1rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ResourceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
`;

const ResourceTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
`;

const ResourceActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-neutral-100);
`;

const ActionButton = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: var(--color-primary-50);
  color: var(--color-primary-600);

  &:hover {
    background: var(--color-primary-100);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SecondaryActionButton = styled(ActionButton)`
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);

  &:hover {
    background: var(--color-neutral-200);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: var(--radius-xl);
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: var(--color-neutral-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: var(--color-neutral-500);
  font-size: 0.9375rem;
`;

const FeaturedSection = styled.section`
  padding: var(--spacing-2xl) 0;
  background: white;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: var(--color-secondary-500);
  }
`;

const FeaturedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-neutral-200);
    border-top-color: var(--color-primary-600);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const getCategoryIcon = (category: ResourceCategory) => {
  switch (category) {
    case 'research-papers':
      return <FileText size={18} />;
    case 'policy-documents':
      return <FileCheck size={18} />;
    case 'educational-materials':
      return <GraduationCap size={18} />;
    case 'reports':
      return <BarChart3 size={18} />;
    case 'newsletters':
      return <Mail size={18} />;
    case 'presentations':
      return <Presentation size={18} />;
    case 'tools':
      return <Wrench size={18} />;
    case 'external-links':
      return <LinkIcon size={18} />;
    default:
      return <Folder size={18} />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <FileText />;
    case 'link':
      return <ExternalLink />;
    case 'video':
      return <Eye />;
    default:
      return <FileText />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const [allResources, featured] = await Promise.all([
        resourceService.getPublishedResources(),
        resourceService.getFeaturedResources(),
      ]);
      setResources(allResources);
      setFeaturedResources(featured);

      // Calculate category counts
      const counts: Record<string, number> = { all: allResources.length };
      allResources.forEach((r) => {
        counts[r.category] = (counts[r.category] || 0) + 1;
      });
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (resource: Resource) => {
    if (resource.fileUrl) {
      await resourceService.incrementDownloadCount(resource.id);
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleView = async (resource: Resource) => {
    await resourceService.incrementViewCount(resource.id);
    if (resource.externalUrl) {
      window.open(resource.externalUrl, '_blank');
    } else if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  const getCategoryName = (category: ResourceCategory) => {
    return resourceCategories.find((c) => c.id === category)?.name || category;
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroPattern />
        <Container>
          <HeroContent>
            <HeroTitle>Resources</HeroTitle>
            <HeroDescription>
              Access research papers, policy documents, educational materials, and other valuable
              resources shared by GSTS members and partners.
            </HeroDescription>
            <SearchContainer>
              <SearchInput>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInput>
              <Button variant="secondary">Search</Button>
            </SearchContainer>
          </HeroContent>
        </Container>
      </HeroSection>

      {featuredResources.length > 0 && !searchQuery && selectedCategory === 'all' && (
        <FeaturedSection>
          <Container>
            <SectionTitle>
              <Tag size={24} />
              Featured Resources
            </SectionTitle>
            <FeaturedGrid>
              {featuredResources.slice(0, 4).map((resource) => (
                <ResourceCard key={resource.id} $view="grid">
                  <ResourceIcon $type={resource.type} $view="grid">
                    {getTypeIcon(resource.type)}
                  </ResourceIcon>
                  <ResourceContent>
                    <ResourceCategory_Badge>{getCategoryName(resource.category)}</ResourceCategory_Badge>
                    <ResourceTitle>{resource.title}</ResourceTitle>
                    <ResourceDescription>{resource.description}</ResourceDescription>
                    <ResourceActions>
                      {resource.type === 'document' && resource.fileUrl ? (
                        <ActionButton onClick={() => handleDownload(resource)}>
                          <Download /> Download
                        </ActionButton>
                      ) : (
                        <ActionButton onClick={() => handleView(resource)}>
                          <ExternalLink /> View
                        </ActionButton>
                      )}
                    </ResourceActions>
                  </ResourceContent>
                </ResourceCard>
              ))}
            </FeaturedGrid>
          </Container>
        </FeaturedSection>
      )}

      <MainSection>
        <Container>
          <ContentGrid>
            <Sidebar>
              <SidebarCard>
                <SidebarTitle>
                  <Filter size={18} />
                  Categories
                </SidebarTitle>
                <CategoryList>
                  <CategoryItem
                    $active={selectedCategory === 'all'}
                    onClick={() => setSelectedCategory('all')}
                  >
                    <Folder size={18} />
                    <span>All Resources</span>
                    <CategoryCount>{categoryCounts.all || 0}</CategoryCount>
                  </CategoryItem>
                  {resourceCategories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      $active={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {getCategoryIcon(category.id)}
                      <span>{category.name}</span>
                      <CategoryCount>{categoryCounts[category.id] || 0}</CategoryCount>
                    </CategoryItem>
                  ))}
                </CategoryList>
              </SidebarCard>
            </Sidebar>

            <MainContent>
              <MobileFilters>
                <MobileFilterSelect
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | 'all')}
                >
                  <option value="all">All Categories ({categoryCounts.all || 0})</option>
                  {resourceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({categoryCounts[category.id] || 0})
                    </option>
                  ))}
                </MobileFilterSelect>
              </MobileFilters>

              <ContentHeader>
                <ResultsCount>
                  Showing <strong>{filteredResources.length}</strong> resources
                  {selectedCategory !== 'all' && (
                    <> in <strong>{getCategoryName(selectedCategory as ResourceCategory)}</strong></>
                  )}
                </ResultsCount>
                <ViewToggle>
                  <ViewButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                    <Grid size={18} />
                  </ViewButton>
                  <ViewButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
                    <List size={18} />
                  </ViewButton>
                </ViewToggle>
              </ContentHeader>

              {isLoading ? (
                <LoadingSpinner />
              ) : filteredResources.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>
                    <FileText size={32} />
                  </EmptyIcon>
                  <EmptyTitle>No resources found</EmptyTitle>
                  <EmptyText>
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'No resources available in this category yet'}
                  </EmptyText>
                </EmptyState>
              ) : (
                <ResourcesGrid $view={viewMode}>
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      $view={viewMode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ResourceIcon $type={resource.type} $view={viewMode}>
                        {getTypeIcon(resource.type)}
                      </ResourceIcon>
                      <ResourceContent>
                        <ResourceCategory_Badge>
                          {getCategoryName(resource.category)}
                        </ResourceCategory_Badge>
                        <ResourceTitle>{resource.title}</ResourceTitle>
                        <ResourceDescription>{resource.description}</ResourceDescription>
                        <ResourceMeta>
                          {resource.author && (
                            <MetaItem>
                              <User /> {resource.author}
                            </MetaItem>
                          )}
                          {resource.publishedDate && (
                            <MetaItem>
                              <Calendar /> {formatDate(resource.publishedDate)}
                            </MetaItem>
                          )}
                          {resource.fileSize && (
                            <MetaItem>
                              <FileText /> {formatFileSize(resource.fileSize)}
                            </MetaItem>
                          )}
                          <MetaItem>
                            <Download /> {resource.downloadCount || 0}
                          </MetaItem>
                          <MetaItem>
                            <Eye /> {resource.viewCount || 0}
                          </MetaItem>
                        </ResourceMeta>
                        {resource.tags.length > 0 && (
                          <ResourceTags>
                            {resource.tags.slice(0, 3).map((tag, index) => (
                              <ResourceTag key={index}>{tag}</ResourceTag>
                            ))}
                            {resource.tags.length > 3 && (
                              <ResourceTag>+{resource.tags.length - 3}</ResourceTag>
                            )}
                          </ResourceTags>
                        )}
                        <ResourceActions>
                          {resource.type === 'document' && resource.fileUrl ? (
                            <>
                              <ActionButton onClick={() => handleDownload(resource)}>
                                <Download /> Download
                              </ActionButton>
                              <SecondaryActionButton onClick={() => handleView(resource)}>
                                <Eye /> Preview
                              </SecondaryActionButton>
                            </>
                          ) : (
                            <ActionButton onClick={() => handleView(resource)}>
                              <ExternalLink /> Open Link
                            </ActionButton>
                          )}
                        </ResourceActions>
                      </ResourceContent>
                    </ResourceCard>
                  ))}
                </ResourcesGrid>
              )}
            </MainContent>
          </ContentGrid>
        </Container>
      </MainSection>
    </PageWrapper>
  );
};
