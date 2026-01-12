import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsSection = styled.section`
  padding: 5rem 0;
  background: var(--color-neutral-50);
`;

const Container = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 500px;
`;

const SectionLabel = styled.div`
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-secondary-600);
  margin-bottom: 1rem;
  position: relative;
  padding-left: 3rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5rem;
    height: 2px;
    background: var(--color-secondary-500);
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--color-neutral-900);
  line-height: 1.3;
`;

const ViewAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid var(--color-primary-600);
  border-radius: 4px;
  color: var(--color-primary-600);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary-600);
    color: white;
  }
`;

const NewsGrid = styled.div`
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

const NewsCard = styled(motion.article)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
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

const NewsImage = styled.div`
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

const NewsCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-primary-600);
  color: white;
  border-radius: 4px;
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
  margin-bottom: 0.75rem;

  svg {
    color: var(--color-secondary-500);
  }
`;

const NewsTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  line-height: 1.4;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary-600);
  }
`;

const NewsExcerpt = styled.p`
  font-size: 0.875rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
  margin-top: 1rem;
  transition: gap 0.3s ease;

  &:hover {
    gap: 0.75rem;
  }
`;

// Sample blog posts data
const blogPosts = [
  {
    id: '1',
    title: 'GSTS Annual Conference 2024: Building Back Better',
    excerpt: 'Join us for our flagship annual conference where scholars and professionals gather to discuss strategies for sustainable development.',
    image: '/images/photo_9_2026-01-12_07-13-36.jpg',
    category: 'Events',
    date: '2024-08-15',
    slug: 'annual-conference-2024'
  },
  {
    id: '2',
    title: 'Research Collaboration Initiative Launch',
    excerpt: 'New partnership program connecting researchers across continents for impactful collaborative projects.',
    image: '/images/photo_10_2026-01-12_07-13-36.jpg',
    category: 'Research',
    date: '2024-08-10',
    slug: 'research-collaboration'
  },
  {
    id: '3',
    title: 'Youth Empowerment Workshop Success',
    excerpt: 'Over 500 young professionals participated in our comprehensive career development series.',
    image: '/images/photo_11_2026-01-12_07-13-36.jpg',
    category: 'Education',
    date: '2024-08-05',
    slug: 'youth-workshop'
  }
];

export const News = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <NewsSection id="news" ref={ref}>
      <Container>
        <SectionHeader>
          <HeaderContent>
            <SectionLabel>Latest News</SectionLabel>
            <SectionTitle>Stay Updated with GSTS</SectionTitle>
          </HeaderContent>
          <ViewAllButton onClick={() => navigate('/news')}>
            View All News
            <ArrowRight size={16} />
          </ViewAllButton>
        </SectionHeader>

        <NewsGrid>
          {blogPosts.map((post, index) => (
            <NewsCard
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/news/${post.slug}`)}
            >
              <NewsImage>
                <img src={post.image} alt={post.title} />
                <NewsCategory>{post.category}</NewsCategory>
              </NewsImage>
              <NewsContent>
                <NewsMeta>
                  <Calendar size={14} />
                  {formatDate(post.date)}
                </NewsMeta>
                <NewsTitle>{post.title}</NewsTitle>
                <NewsExcerpt>{post.excerpt}</NewsExcerpt>
                <ReadMore>
                  Read More <ArrowRight size={14} />
                </ReadMore>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      </Container>
    </NewsSection>
  );
};
