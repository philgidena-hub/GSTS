import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

// Search and Filter
const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  position: relative;

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-neutral-400);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 6px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.1);
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'var(--color-neutral-200)')};
  background: ${({ $active }) => ($active ? 'var(--color-primary-600)' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'var(--color-neutral-700)')};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary-600);
    color: ${({ $active }) => ($active ? 'white' : 'var(--color-primary-600)')};
  }
`;

// News Grid
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

const NewsImage = styled.div`
  position: relative;
  height: 220px;
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
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    color: var(--color-secondary-500);
  }
`;

const NewsTitle = styled.h3`
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  line-height: 1.4;
  margin-bottom: 0.75rem;
`;

const NewsExcerpt = styled.p`
  font-size: 0.9375rem;
  color: var(--color-neutral-500);
  line-height: 1.6;
  margin-bottom: 1rem;
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
  transition: gap 0.3s ease;

  &:hover {
    gap: 0.75rem;
  }
`;

// Featured Post
const FeaturedPost = styled(motion.article)`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 30px -4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    img {
      transform: scale(1.02);
    }
  }
`;

const FeaturedImage = styled.div`
  height: 100%;
  min-height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
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
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-secondary-500);
  color: var(--color-primary-900);
  border-radius: 4px;
  margin-bottom: 1rem;
  width: fit-content;
`;

const FeaturedTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  line-height: 1.3;
  margin-bottom: 1rem;
`;

const FeaturedExcerpt = styled.p`
  font-size: 1rem;
  color: var(--color-neutral-600);
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const blogPosts = [
  {
    id: '1',
    title: 'GSTS Annual Conference 2024: Building Back Better',
    excerpt: 'Join us for our flagship annual conference where scholars and professionals gather to discuss strategies for sustainable development and reconstruction.',
    image: '/images/photo_9_2026-01-12_07-13-36.jpg',
    category: 'Events',
    date: '2024-08-15',
    author: 'GSTS Editorial',
    readTime: '5 min',
    slug: 'annual-conference-2024',
    featured: true
  },
  {
    id: '2',
    title: 'Research Collaboration Initiative Launch',
    excerpt: 'New partnership program connecting researchers across continents for impactful collaborative projects.',
    image: '/images/photo_10_2026-01-12_07-13-36.jpg',
    category: 'Research',
    date: '2024-08-10',
    author: 'Research Committee',
    readTime: '4 min',
    slug: 'research-collaboration'
  },
  {
    id: '3',
    title: 'Youth Empowerment Workshop Success',
    excerpt: 'Over 500 young professionals participated in our comprehensive career development series.',
    image: '/images/photo_11_2026-01-12_07-13-36.jpg',
    category: 'Education',
    date: '2024-08-05',
    author: 'Youth Affairs',
    readTime: '3 min',
    slug: 'youth-workshop'
  },
  {
    id: '4',
    title: 'Healthcare Infrastructure Report Published',
    excerpt: 'Comprehensive analysis of healthcare needs and development priorities for the region.',
    image: '/images/photo_3_2026-01-12_07-13-36.jpg',
    category: 'Healthcare',
    date: '2024-07-28',
    author: 'Health Cluster',
    readTime: '6 min',
    slug: 'healthcare-report'
  },
  {
    id: '5',
    title: 'New Membership Portal Launched',
    excerpt: 'Enhanced digital platform for member engagement and collaboration.',
    image: '/images/photo_4_2026-01-12_07-13-36.jpg',
    category: 'Announcements',
    date: '2024-07-20',
    author: 'Tech Team',
    readTime: '2 min',
    slug: 'membership-portal'
  },
  {
    id: '6',
    title: 'Economic Development Summit Highlights',
    excerpt: 'Key takeaways from the recent summit on sustainable economic development strategies.',
    image: '/images/photo_5_2026-01-12_07-13-36.jpg',
    category: 'Events',
    date: '2024-07-15',
    author: 'Economics Cluster',
    readTime: '4 min',
    slug: 'economic-summit'
  }
];

const categories = ['All', 'Events', 'Research', 'Education', 'Healthcare', 'Announcements'];

export const News = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = otherPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <PageHero>
        <PageHeroContent>
          <Breadcrumb>
            <a href="/">Home</a>
            <span>/</span>
            <span>News</span>
          </Breadcrumb>
          <PageTitle>News & Updates</PageTitle>
          <PageSubtitle>
            Stay informed with the latest news, articles, and updates from our
            community of scholars and professionals.
          </PageSubtitle>
        </PageHeroContent>
      </PageHero>

      <Section>
        <Container>
          {featuredPost && (
            <FeaturedPost
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(`/news/${featuredPost.slug}`)}
            >
              <FeaturedImage>
                <img src={featuredPost.image} alt={featuredPost.title} />
              </FeaturedImage>
              <FeaturedContent>
                <FeaturedLabel>Featured</FeaturedLabel>
                <NewsMeta>
                  <MetaItem>
                    <Calendar size={14} />
                    {formatDate(featuredPost.date)}
                  </MetaItem>
                  <MetaItem>
                    <Clock size={14} />
                    {featuredPost.readTime} read
                  </MetaItem>
                </NewsMeta>
                <FeaturedTitle>{featuredPost.title}</FeaturedTitle>
                <FeaturedExcerpt>{featuredPost.excerpt}</FeaturedExcerpt>
                <ReadMore>
                  Read More <ArrowRight size={14} />
                </ReadMore>
              </FeaturedContent>
            </FeaturedPost>
          )}

          <FilterBar>
            <SearchBox>
              <Search size={18} />
              <SearchInput
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>
            <CategoryFilter>
              {categories.map((category) => (
                <CategoryButton
                  key={category}
                  $active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </CategoryButton>
              ))}
            </CategoryFilter>
          </FilterBar>

          <NewsGrid>
            {filteredPosts.map((post, index) => (
              <NewsCard
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/news/${post.slug}`)}
              >
                <NewsImage>
                  <img src={post.image} alt={post.title} />
                  <NewsCategory>{post.category}</NewsCategory>
                </NewsImage>
                <NewsContent>
                  <NewsMeta>
                    <MetaItem>
                      <Calendar size={12} />
                      {formatDate(post.date)}
                    </MetaItem>
                    <MetaItem>
                      <Clock size={12} />
                      {post.readTime}
                    </MetaItem>
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
      </Section>
    </>
  );
};
