import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Clock,
  CheckCircle,
  Calendar,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { useContentStore } from '../stores/contentStore';

const PageHero = styled.section`
  padding: 10rem 0 5rem;
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-800) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Hero_Image.jpg') center/cover no-repeat;
    opacity: 0.15;
  }
`;

const PageHeroContent = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  position: relative;
  z-index: 1;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-secondary-400);
    }
  }

  span {
    color: var(--color-secondary-400);
  }
`;

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

// Filter Section
const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: 8px;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  svg {
    color: var(--color-neutral-400);
  }

  input {
    border: none;
    outline: none;
    font-size: 0.9375rem;
    width: 100%;
    color: var(--color-neutral-700);

    &::placeholder {
      color: var(--color-neutral-400);
    }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-600)')};

  &:hover {
    border-color: var(--color-primary-600);
    color: ${({ $active }) => ($active ? 'white' : 'var(--color-primary-600)')};
  }
`;

// Featured Project
const FeaturedProject = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 0;
  margin-bottom: 4rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 400px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    min-height: 300px;
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-secondary-500);
  color: var(--color-primary-900);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 4px;
`;

const FeaturedContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--color-neutral-50);

  @media (max-width: 1024px) {
    padding: 2rem;
  }
`;

const FeaturedStatus = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 50px;
  width: fit-content;
  margin-bottom: 1rem;
  background: ${({ $status }) =>
    $status === 'ongoing'
      ? '#10b98120'
      : $status === 'completed'
      ? '#0052cc20'
      : '#d4a01220'};
  color: ${({ $status }) =>
    $status === 'ongoing'
      ? '#10b981'
      : $status === 'completed'
      ? '#0052cc'
      : '#d4a012'};
`;

const FeaturedTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const FeaturedDescription = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const FeaturedMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  span:first-of-type {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-neutral-400);
    margin-bottom: 0.25rem;
  }

  span:last-of-type {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-neutral-900);
  }
`;

const FeaturedButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--color-primary-600);
  border: none;
  border-radius: 4px;
  color: white;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: var(--color-primary-700);
    transform: translateY(-2px);
  }
`;

// Projects Grid
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-neutral-100);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);

    img {
      transform: scale(1.05);
    }
  }
`;

const ProjectImage = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
`;

const ProjectStatus = styled.span<{ $status: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 50px;
  background: ${({ $status }) =>
    $status === 'ongoing'
      ? '#10b981'
      : $status === 'completed'
      ? '#0052cc'
      : '#d4a012'};
  color: white;
`;

const ProjectCategory = styled.span`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: white;
  color: var(--color-primary-600);
  border-radius: 4px;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
  line-height: 1.4;
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

const ProjectLink = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
  transition: gap 0.3s ease;

  &:hover {
    gap: 0.75rem;
  }
`;

// Stats Section
const StatsSection = styled.section`
  padding: 5rem 0;
  background: var(--color-primary-900);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-secondary-400);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const statusIcons = {
  ongoing: Clock,
  completed: CheckCircle,
  upcoming: Calendar,
};

export const Projects = () => {
  const [ref] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { projects } = useContentStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featuredProject = filteredProjects[0];
  const otherProjects = filteredProjects.slice(1);

  return (
    <>
      <PageHero>
        <PageHeroContent>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>/</span>
            <span>Projects</span>
          </Breadcrumb>
          <PageTitle>Our Projects</PageTitle>
          <PageSubtitle>
            Explore our ongoing initiatives and completed projects that are
            creating tangible impact in communities.
          </PageSubtitle>
        </PageHeroContent>
      </PageHero>

      <Section ref={ref} style={{ background: 'var(--color-neutral-50)' }}>
        <Container>
          <FilterSection>
            <SearchBox>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>
            <FilterTabs>
              <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
                <Filter size={16} />
                All Projects
              </FilterTab>
              <FilterTab $active={filter === 'ongoing'} onClick={() => setFilter('ongoing')}>
                <Clock size={16} />
                Ongoing
              </FilterTab>
              <FilterTab $active={filter === 'completed'} onClick={() => setFilter('completed')}>
                <CheckCircle size={16} />
                Completed
              </FilterTab>
              <FilterTab $active={filter === 'upcoming'} onClick={() => setFilter('upcoming')}>
                <Calendar size={16} />
                Upcoming
              </FilterTab>
            </FilterTabs>
          </FilterSection>

          {featuredProject && (
            <FeaturedProject
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FeaturedImage>
                <img src={featuredProject.image} alt={featuredProject.title} />
                <FeaturedBadge>Featured Project</FeaturedBadge>
              </FeaturedImage>
              <FeaturedContent>
                <FeaturedStatus $status={featuredProject.status}>
                  {(() => {
                    const StatusIcon = statusIcons[featuredProject.status];
                    return <StatusIcon size={14} />;
                  })()}
                  {featuredProject.status}
                </FeaturedStatus>
                <FeaturedTitle>{featuredProject.title}</FeaturedTitle>
                <FeaturedDescription>{featuredProject.description}</FeaturedDescription>
                <FeaturedMeta>
                  <MetaItem>
                    <span>Category</span>
                    <span>{featuredProject.category}</span>
                  </MetaItem>
                  <MetaItem>
                    <span>Status</span>
                    <span style={{ textTransform: 'capitalize' }}>{featuredProject.status}</span>
                  </MetaItem>
                </FeaturedMeta>
                <FeaturedButton>
                  View Project Details
                  <ArrowRight size={18} />
                </FeaturedButton>
              </FeaturedContent>
            </FeaturedProject>
          )}

          <ProjectsGrid>
            {otherProjects.map((project, index) => {
              const StatusIcon = statusIcons[project.status];
              return (
                <ProjectCard
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectImage>
                    <img src={project.image} alt={project.title} />
                    <ProjectStatus $status={project.status}>
                      <StatusIcon size={12} />
                      {project.status}
                    </ProjectStatus>
                    <ProjectCategory>{project.category}</ProjectCategory>
                  </ProjectImage>
                  <ProjectContent>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <ProjectLink>
                      View Project <ArrowRight size={14} />
                    </ProjectLink>
                  </ProjectContent>
                </ProjectCard>
              );
            })}
          </ProjectsGrid>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--color-neutral-500)' }}>
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <StatsSection>
        <Container>
          <StatsGrid>
            <StatItem>
              <StatValue>{projects.filter(p => p.status === 'completed').length}+</StatValue>
              <StatLabel>Completed Projects</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{projects.filter(p => p.status === 'ongoing').length}+</StatValue>
              <StatLabel>Ongoing Initiatives</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>50K+</StatValue>
              <StatLabel>Lives Impacted</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>15+</StatValue>
              <StatLabel>Partner Organizations</StatLabel>
            </StatItem>
          </StatsGrid>
        </Container>
      </StatsSection>
    </>
  );
};
