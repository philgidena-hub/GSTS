import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useContentStore } from '../stores/contentStore';
import type { BlogPost } from '../types';

const PageWrapper = styled.div`
  min-height: 100vh;
`;

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
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const Category = styled.span`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-secondary-500);
  color: var(--color-primary-900);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  max-width: 900px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9375rem;

  svg {
    color: var(--color-secondary-400);
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthorImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const AuthorName = styled.span`
  color: white;
  font-weight: 500;
`;

const ContentSection = styled.section`
  padding: 4rem 0;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const FeaturedImage = styled.div`
  margin: -8rem auto 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;

  img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    display: block;
  }
`;

const ArticleContent = styled.article`
  font-size: 1.125rem;
  line-height: 1.9;
  color: var(--color-neutral-700);

  p {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-neutral-900);
    margin: 2.5rem 0 1rem;
  }

  h3 {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--color-neutral-900);
    margin: 2rem 0 1rem;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  blockquote {
    border-left: 4px solid var(--color-primary-500);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--color-neutral-600);
  }

  img {
    width: 100%;
    border-radius: 8px;
    margin: 2rem 0;
  }

  a {
    color: var(--color-primary-600);
    text-decoration: underline;

    &:hover {
      color: var(--color-primary-700);
    }
  }
`;

const ShareSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  border-top: 1px solid var(--color-neutral-200);
  margin-top: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ShareLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-neutral-700);
`;

const ShareButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ShareButton = styled.a`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &.facebook {
    background: #1877f2;
    &:hover { background: #166fe5; }
  }

  &.twitter {
    background: #1da1f2;
    &:hover { background: #1a91da; }
  }

  &.linkedin {
    background: #0077b5;
    &:hover { background: #006097; }
  }
`;

const RelatedSection = styled.section`
  padding: 4rem 0;
  background: var(--color-neutral-50);
`;

const RelatedContainer = styled.div`
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const SectionTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 2rem;
  text-align: center;
`;

const RelatedGrid = styled.div`
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

const RelatedCard = styled(Link)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.15);
  }
`;

const RelatedImage = styled.div`
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${RelatedCard}:hover & img {
    transform: scale(1.05);
  }
`;

const RelatedContent = styled.div`
  padding: 1.25rem;
`;

const RelatedCategory = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-primary-600);
`;

const RelatedTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  margin-top: 0.5rem;
  line-height: 1.4;
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const NotFoundTitle = styled.h1`
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 1rem;
`;

const NotFoundText = styled.p`
  color: var(--color-neutral-600);
  margin-bottom: 2rem;
`;

const BackToNews = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: var(--color-primary-600);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: var(--color-primary-700);
  }
`;

export const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useContentStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug && blogPosts.length > 0) {
      const foundPost = blogPosts.find((p) => p.slug === slug);
      setPost(foundPost || null);

      if (foundPost) {
        // Get related posts from the same category
        const related = blogPosts
          .filter((p) => p.id !== foundPost.id && p.category === foundPost.category)
          .slice(0, 3);

        // If not enough related posts in the same category, add more from other categories
        if (related.length < 3) {
          const otherPosts = blogPosts
            .filter((p) => p.id !== foundPost.id && !related.includes(p))
            .slice(0, 3 - related.length);
          setRelatedPosts([...related, ...otherPosts]);
        } else {
          setRelatedPosts(related);
        }
      }
    }
  }, [slug, blogPosts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (!post) {
    return (
      <PageWrapper>
        <NotFound>
          <NotFoundTitle>Article Not Found</NotFoundTitle>
          <NotFoundText>
            The article you're looking for doesn't exist or has been removed.
          </NotFoundText>
          <BackToNews to="/news">
            <ArrowLeft size={18} />
            Back to News
          </BackToNews>
        </NotFound>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHero>
        <PageHeroContent>
          <BackButton to="/news">
            <ArrowLeft size={16} />
            Back to News
          </BackButton>
          <Category>{post.category}</Category>
          <Title>{post.title}</Title>
          <Meta>
            <AuthorInfo>
              {post.authorImage ? (
                <AuthorImage src={post.authorImage} alt={post.author} />
              ) : (
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={22} color="white" />
                </div>
              )}
              <AuthorName>{post.author}</AuthorName>
            </AuthorInfo>
            <MetaItem>
              <Calendar size={16} />
              {formatDate(post.date)}
            </MetaItem>
            <MetaItem>
              <Clock size={16} />
              {calculateReadTime(post.content || post.excerpt)}
            </MetaItem>
          </Meta>
        </PageHeroContent>
      </PageHero>

      <ContentSection>
        <Container>
          {post.image && (
            <FeaturedImage>
              <img src={post.image} alt={post.title} />
            </FeaturedImage>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArticleContent>
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </ArticleContent>

            <ShareSection>
              <ShareLabel>
                <Share2 size={18} />
                Share this article
              </ShareLabel>
              <ShareButtons>
                <ShareButton
                  className="facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={20} />
                </ShareButton>
                <ShareButton
                  className="twitter"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={20} />
                </ShareButton>
                <ShareButton
                  className="linkedin"
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={20} />
                </ShareButton>
              </ShareButtons>
            </ShareSection>
          </motion.div>
        </Container>
      </ContentSection>

      {relatedPosts.length > 0 && (
        <RelatedSection>
          <RelatedContainer>
            <SectionTitle>Related Articles</SectionTitle>
            <RelatedGrid>
              {relatedPosts.map((relatedPost) => (
                <RelatedCard key={relatedPost.id} to={`/news/${relatedPost.slug}`}>
                  <RelatedImage>
                    <img src={relatedPost.image || '/images/placeholder.jpg'} alt={relatedPost.title} />
                  </RelatedImage>
                  <RelatedContent>
                    <RelatedCategory>{relatedPost.category}</RelatedCategory>
                    <RelatedTitle>{relatedPost.title}</RelatedTitle>
                  </RelatedContent>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </RelatedContainer>
        </RelatedSection>
      )}
    </PageWrapper>
  );
};
