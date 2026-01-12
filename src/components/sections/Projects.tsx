import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, ExternalLink, Clock, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { useContentStore } from '../../stores/contentStore';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = styled.section`
  padding: var(--spacing-4xl) 0;
  background: white;
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-3xl);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }
`;

const HeaderContent = styled.div`
  max-width: 600px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary-600);
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
`;

const SectionDescription = styled.p`
  font-size: 1.125rem;
  color: var(--color-neutral-500);
  line-height: 1.7;
`;

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
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  border: 1px solid var(--color-neutral-100);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);

    img {
      transform: scale(1.05);
    }
  }
`;

const ProjectImage = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
`;

const ProjectStatus = styled.span<{ $status: 'ongoing' | 'completed' | 'upcoming' }>`
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
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
  background: ${({ $status }) =>
    $status === 'ongoing'
      ? 'var(--color-accent-success)'
      : $status === 'completed'
      ? 'var(--color-primary-600)'
      : 'var(--color-secondary-500)'};
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
  border-radius: var(--radius-md);
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const ProjectDescription = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const ProjectLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: gap var(--transition-fast);

  &:hover {
    gap: 0.75rem;
  }
`;

const FeaturedProject = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: var(--color-neutral-50);
  border-radius: var(--radius-2xl);
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 400px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    min-height: 300px;
  }
`;

const FeaturedContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 2rem;
  }
`;

const FeaturedLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary-600);
  margin-bottom: 1rem;
`;

const FeaturedTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const FeaturedDescription = styled.p`
  font-size: 1.0625rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const statusIcons = {
  ongoing: Clock,
  completed: CheckCircle,
  upcoming: Calendar,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const Projects = () => {
  const navigate = useNavigate();
  const { projects } = useContentStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <ProjectsSection id="projects">
      <Container>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          ref={ref}
        >
          <HeaderContent>
            <SectionLabel>Our Projects</SectionLabel>
            <SectionTitle>Transforming Ideas Into Impact</SectionTitle>
            <SectionDescription>
              Explore our ongoing initiatives and completed projects that are
              making a tangible difference in communities.
            </SectionDescription>
          </HeaderContent>
          <Button
            variant="outline"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/projects')}
          >
            View All Projects
          </Button>
        </SectionHeader>

        {featuredProject && (
          <FeaturedProject
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FeaturedImage>
              <img src={featuredProject.image} alt={featuredProject.title} />
            </FeaturedImage>
            <FeaturedContent>
              <FeaturedLabel>
                <Clock size={16} />
                Featured Project
              </FeaturedLabel>
              <FeaturedTitle>{featuredProject.title}</FeaturedTitle>
              <FeaturedDescription>
                {featuredProject.description}
              </FeaturedDescription>
              <Button
                variant="primary"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate(`/projects/${featuredProject.id}`)}
              >
                Learn More
              </Button>
            </FeaturedContent>
          </FeaturedProject>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <ProjectsGrid>
            {otherProjects.map((project) => {
              const StatusIcon = statusIcons[project.status];
              return (
                <ProjectCard key={project.id} variants={cardVariants}>
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
                    <ProjectDescription>
                      {project.description}
                    </ProjectDescription>
                    <ProjectLink href={`/projects/${project.id}`}>
                      View Project <ExternalLink size={16} />
                    </ProjectLink>
                  </ProjectContent>
                </ProjectCard>
              );
            })}
          </ProjectsGrid>
        </motion.div>
      </Container>
    </ProjectsSection>
  );
};
