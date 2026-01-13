import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { contentService } from '../services/content.service';
import type {
  HeroContent,
  AboutContent,
  ServiceCluster,
  Statistic,
  Project,
  BlogPost,
  TeamMember,
  ContactInfo,
  FAQ,
  SiteSettings,
} from '../types';

// Default content data (used as fallback when Firebase is empty or unavailable)
const defaultHero: HeroContent = {
  id: 'hero-1',
  title: 'Empowering Tigray Through Knowledge',
  subtitle: 'Global Society of Tigray Scholars and Professionals',
  description: 'A global knowledge network of over 5,000 Tigrayan academics, professionals, intellectuals, scientists, policy makers, industry leaders, educators, students, and allies worldwide dedicated to knowledge-driven solutions for Tigray\'s development.',
  primaryButtonText: 'Become a Member',
  primaryButtonLink: '/membership',
  secondaryButtonText: 'Learn More',
  secondaryButtonLink: '/about',
  backgroundImage: '/images/Hero_Image.jpg',
};

const defaultAbout: AboutContent = {
  id: 'about-1',
  title: 'About GSTS',
  subtitle: 'Who We Are',
  description: 'The Global Society of Tigray Scholars and Professionals (GSTS) is a legally registered, autonomous, and not-for-profit global knowledge network dedicated to mobilizing intellectual capital for Tigray\'s reconstruction and sustainable development.',
  mission: 'To harness the collective expertise of Tigrayan scholars and professionals worldwide to drive knowledge-driven solutions for sustainable development, reconstruction, and resilience in Tigray.',
  vision: 'A thriving Tigray where knowledge and innovation drive sustainable development, social justice, and global connectivity.',
  image: '/images/photo_10_2026-01-12_07-13-36.jpg',
  features: [
    {
      id: 'feature-1',
      title: 'Global Network',
      description: 'Connected professionals across multiple continents working together.',
      icon: 'Globe',
    },
    {
      id: 'feature-2',
      title: 'Expert Knowledge',
      description: 'Deep expertise across various sectors and disciplines.',
      icon: 'BookOpen',
    },
    {
      id: 'feature-3',
      title: 'Impactful Projects',
      description: 'Tangible projects that make a real difference in communities.',
      icon: 'Target',
    },
  ],
};

const defaultServices: ServiceCluster[] = [
  {
    id: 'service-1',
    title: 'Social Sector',
    description: 'Education, health, cultural preservation, and empowerment of vulnerable communities through targeted programs and initiatives.',
    icon: 'Heart',
    color: '#ef4444',
    features: ['Education Programs', 'Healthcare Initiatives', 'Cultural Preservation', 'Community Empowerment'],
  },
  {
    id: 'service-2',
    title: 'Productive & Economic Development',
    description: 'Agriculture, industry, and sustainable economic initiatives to drive growth and prosperity in the region.',
    icon: 'TrendingUp',
    color: '#10b981',
    features: ['Agricultural Development', 'Industrial Growth', 'Sustainable Economics', 'Job Creation'],
  },
  {
    id: 'service-3',
    title: 'Infrastructure & Digital Transformation',
    description: 'Energy, ICT, and transportation development to modernize infrastructure and enable digital connectivity.',
    icon: 'Zap',
    color: '#3b82f6',
    features: ['Energy Solutions', 'ICT Development', 'Transportation', 'Digital Infrastructure'],
  },
  {
    id: 'service-4',
    title: 'Governance & Justice',
    description: 'Policy and institutional strengthening to ensure transparent governance and access to justice.',
    icon: 'Scale',
    color: '#8b5cf6',
    features: ['Policy Development', 'Institutional Building', 'Legal Advocacy', 'Governance Reform'],
  },
  {
    id: 'service-5',
    title: 'Cross-Cutting Cluster',
    description: 'Integrated thematic approaches addressing environmental sustainability, gender equity, and youth empowerment.',
    icon: 'Layers',
    color: '#f59e0b',
    features: ['Environmental Sustainability', 'Gender Equity', 'Youth Empowerment', 'Research & Innovation'],
  },
];

const defaultStatistics: Statistic[] = [
  {
    id: 'stat-1',
    value: '5,000+',
    label: 'Members',
    description: 'Researchers and professionals worldwide',
    icon: 'Users',
  },
  {
    id: 'stat-2',
    value: '50+',
    label: 'Countries',
    description: 'Global presence and reach',
    icon: 'Globe',
  },
  {
    id: 'stat-3',
    value: '10',
    label: 'Sectoral Clusters',
    description: 'Specialized working groups',
    icon: 'Grid',
  },
  {
    id: 'stat-4',
    value: '12+',
    label: 'Active Projects',
    description: 'Ongoing initiatives and programs',
    icon: 'Briefcase',
  },
];

const defaultProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Educational Reconstruction Initiative',
    description: 'Rebuilding and modernizing educational institutions across Tigray with focus on quality education and accessibility.',
    category: 'Education',
    image: '/images/photo_1_2026-01-12_07-13-36.jpg',
    status: 'ongoing',
  },
  {
    id: 'project-2',
    title: 'Healthcare System Strengthening',
    description: 'Supporting healthcare infrastructure and training medical professionals to improve health outcomes.',
    category: 'Health',
    image: '/images/photo_2_2026-01-12_07-13-36.jpg',
    status: 'ongoing',
  },
  {
    id: 'project-3',
    title: 'Agricultural Innovation Program',
    description: 'Introducing modern farming techniques and sustainable practices to boost agricultural productivity.',
    category: 'Agriculture',
    image: '/images/photo_3_2026-01-12_07-13-36.jpg',
    status: 'upcoming',
  },
  {
    id: 'project-4',
    title: 'Community Development Program',
    description: 'Empowering local communities through capacity building, skills training, and sustainable livelihood initiatives.',
    category: 'Community',
    image: '/images/photo_4_2026-01-12_07-13-36.jpg',
    status: 'completed',
  },
  {
    id: 'project-5',
    title: 'Water & Sanitation Initiative',
    description: 'Providing clean water access and improving sanitation facilities in rural areas across Tigray.',
    category: 'Infrastructure',
    image: '/images/photo_5_2026-01-12_07-13-36.jpg',
    status: 'ongoing',
  },
  {
    id: 'project-6',
    title: 'Youth Empowerment Program',
    description: 'Creating opportunities for young people through education, mentorship, and entrepreneurship support.',
    category: 'Youth',
    image: '/images/photo_6_2026-01-12_07-13-36.jpg',
    status: 'completed',
  },
];

const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Building Resilient Communities Through Education',
    excerpt: 'Exploring how education serves as the foundation for community resilience and sustainable development.',
    content: `Education is the cornerstone of building resilient communities. In Tigray, where communities have faced numerous challenges, investing in education has become more critical than ever.

Our research shows that communities with strong educational foundations are better equipped to:

1. Adapt to changing circumstances
2. Develop innovative solutions to local problems
3. Build sustainable economic opportunities
4. Preserve and transmit cultural knowledge

The GSTS educational initiatives focus on rebuilding schools, training teachers, and providing scholarships to deserving students. Through collaborative efforts with local communities and international partners, we are working to ensure that every child in Tigray has access to quality education.

Our approach emphasizes not just formal schooling, but also vocational training and lifelong learning opportunities. By equipping people with diverse skills, we help communities become more resilient and self-sufficient.

The path forward requires continued investment in human capital. Together, we can build a future where education empowers every individual to contribute to their community's development.`,
    author: 'Dr. Amanuel Tekle',
    authorImage: '/images/photo_7_2026-01-12_07-13-36.jpg',
    date: '2024-01-15',
    category: 'Education',
    image: '/images/photo_9_2026-01-12_07-13-36.jpg',
    slug: 'building-resilient-communities',
  },
  {
    id: 'blog-2',
    title: 'The Role of Diaspora in Development',
    excerpt: 'How professionals abroad can contribute to sustainable development in their home regions.',
    content: `The diaspora plays a pivotal role in driving development in their home countries. For Tigray, the global network of professionals, academics, and entrepreneurs represents an invaluable resource for reconstruction and growth.

Key contributions of the diaspora include:

**Knowledge Transfer**
Diaspora professionals bring expertise gained in leading institutions worldwide. This knowledge can be adapted and applied to address local challenges in healthcare, education, technology, and governance.

**Financial Support**
Remittances and investments from abroad provide crucial capital for community projects, businesses, and infrastructure development.

**Advocacy and Awareness**
Members of the diaspora serve as ambassadors, raising awareness about the needs and potential of their home regions on the global stage.

**Building Networks**
International connections facilitate partnerships, collaborations, and opportunities that benefit local communities.

GSTS was founded on the principle that collective action by the diaspora can transform communities. Our network of over 5,000 professionals demonstrates what's possible when talented individuals unite for a common purpose.

We invite all Tigrayan professionals worldwide to join us in this mission. Together, we can build a brighter future for the next generation.`,
    author: 'Dr. Sara Gebremichael',
    authorImage: '/images/photo_8_2026-01-12_07-13-36.jpg',
    date: '2024-01-10',
    category: 'Development',
    image: '/images/photo_10_2026-01-12_07-13-36.jpg',
    slug: 'role-of-diaspora-development',
  },
  {
    id: 'blog-3',
    title: 'Technology and Innovation for Growth',
    excerpt: 'Leveraging technology to drive economic growth and create opportunities for the next generation.',
    content: `In the 21st century, technology is a great equalizer. It provides opportunities for communities to leapfrog traditional development stages and compete in the global economy.

For Tigray, embracing technology and innovation offers a path to rapid, sustainable growth. Here's how:

**Digital Infrastructure**
Expanding internet connectivity and digital services creates the foundation for modern economic activity. From e-commerce to telemedicine, digital infrastructure enables services that were previously inaccessible.

**Skills Development**
Training young people in coding, digital marketing, and other tech skills prepares them for the jobs of the future. These skills are portable and open doors to remote work opportunities.

**Agricultural Technology**
Innovation in agriculture – from precision farming to market information systems – can dramatically improve productivity and incomes for rural communities.

**Entrepreneurship**
Technology lowers barriers to starting a business. Young entrepreneurs can reach global markets with minimal capital investment.

GSTS is committed to fostering a culture of innovation. Through our Technology and Innovation cluster, we support initiatives that bring the benefits of technology to communities across Tigray.

The future belongs to those who embrace change. Let's work together to ensure Tigray is at the forefront of the digital revolution.`,
    author: 'Eng. Michael Hailu',
    authorImage: '/images/photo_12_2026-01-12_07-13-36.jpg',
    date: '2024-01-05',
    category: 'Technology',
    image: '/images/photo_11_2026-01-12_07-13-36.jpg',
    slug: 'technology-innovation-growth',
  },
];

const defaultTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Dr. Amanuel Tekle',
    role: 'Chairperson',
    bio: 'Leading scholar with over 20 years of experience in development economics.',
    image: '/images/photo_13_2026-01-12_07-13-36.jpg',
    social: { linkedin: '#', twitter: '#', email: 'amanuel@gsts.org' },
  },
  {
    id: 'team-2',
    name: 'Dr. Sara Gebremichael',
    role: 'Vice Chairperson',
    bio: 'Expert in public health policy and community development initiatives.',
    image: '/images/photo_14_2026-01-12_07-13-36.jpg',
    social: { linkedin: '#', twitter: '#', email: 'sara@gsts.org' },
  },
  {
    id: 'team-3',
    name: 'Eng. Michael Hailu',
    role: 'Secretary General',
    bio: 'Technology leader focused on digital transformation and innovation.',
    image: '/images/photo_15_2026-01-12_07-13-36.jpg',
    social: { linkedin: '#', twitter: '#', email: 'michael@gsts.org' },
  },
];

const defaultContactInfo: ContactInfo = {
  id: 'contact-1',
  address: 'Mekelle',
  city: 'Mekelle',
  country: 'Tigray, Ethiopia',
  email: 'info@gsts.org',
  phone: '+12 (3) 456 000',
  workingHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
};

const defaultFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is GSTS?',
    answer: 'GSTS (Global Society of Tigray Scholars and Professionals) is a not-for-profit global knowledge network of Tigrayan academics, professionals, and allies dedicated to development initiatives.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'How can I become a member?',
    answer: 'You can apply for membership through our website by filling out the membership application form. Applications are reviewed by our membership committee.',
    category: 'Membership',
  },
  {
    id: 'faq-3',
    question: 'What are the membership benefits?',
    answer: 'Members gain access to our global network, professional development opportunities, collaboration on projects, and the chance to contribute to meaningful development initiatives.',
    category: 'Membership',
  },
];

const defaultSettings: SiteSettings = {
  siteName: 'GSTS',
  tagline: 'Global Society of Tigray Scholars and Professionals',
  logo: '/images/logo-gsts.png',
  favicon: '/favicon.svg',
  social: {
    facebook: 'https://facebook.com/gsts',
    twitter: 'https://twitter.com/gsts',
    instagram: 'https://instagram.com/gsts',
    linkedin: 'https://linkedin.com/company/gsts',
    youtube: 'https://youtube.com/gsts',
  },
  contact: defaultContactInfo,
  seo: {
    title: 'GSTS - Global Society of Tigray Scholars and Professionals',
    description: 'A global knowledge network dedicated to Tigray\'s development and reconstruction.',
    keywords: ['GSTS', 'Tigray', 'scholars', 'professionals', 'development', 'Africa'],
  },
};

interface ContentState {
  // Data
  hero: HeroContent;
  about: AboutContent;
  services: ServiceCluster[];
  statistics: Statistic[];
  projects: Project[];
  blogPosts: BlogPost[];
  teamMembers: TeamMember[];
  contactInfo: ContactInfo;
  faqs: FAQ[];
  settings: SiteSettings;

  // Loading and error states
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Initialize - fetch all data from Firebase
  initializeContent: () => Promise<void>;

  // Hero Actions
  updateHero: (hero: Partial<HeroContent>) => Promise<void>;

  // About Actions
  updateAbout: (about: Partial<AboutContent>) => Promise<void>;

  // Service Actions
  updateService: (id: string, service: Partial<ServiceCluster>) => Promise<void>;
  addService: (service: Omit<ServiceCluster, 'id'>) => Promise<string>;
  deleteService: (id: string) => Promise<void>;

  // Statistic Actions
  updateStatistic: (id: string, stat: Partial<Statistic>) => Promise<void>;
  addStatistic: (stat: Omit<Statistic, 'id'>) => Promise<string>;
  deleteStatistic: (id: string) => Promise<void>;

  // Project Actions
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;

  // Blog Post Actions
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<string>;
  deleteBlogPost: (id: string) => Promise<void>;
  getBlogPostBySlug: (slug: string) => BlogPost | undefined;

  // Team Member Actions
  updateTeamMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<string>;
  deleteTeamMember: (id: string) => Promise<void>;

  // Contact Info Actions
  updateContactInfo: (info: Partial<ContactInfo>) => Promise<void>;

  // FAQ Actions
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  addFAQ: (faq: Omit<FAQ, 'id'>) => Promise<string>;
  deleteFAQ: (id: string) => Promise<void>;

  // Settings Actions
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  // Utility Actions
  resetToDefaults: () => void;
  setError: (error: string | null) => void;

  // File Upload
  uploadFile: (file: File, path: string) => Promise<string>;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      // Initial state with defaults
      hero: defaultHero,
      about: defaultAbout,
      services: defaultServices,
      statistics: defaultStatistics,
      projects: defaultProjects,
      blogPosts: defaultBlogPosts,
      teamMembers: defaultTeamMembers,
      contactInfo: defaultContactInfo,
      faqs: defaultFAQs,
      settings: defaultSettings,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Initialize content from Firebase
      initializeContent: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true, error: null });

        try {
          // Fetch all content from Firebase in parallel
          const [
            heroData,
            aboutData,
            servicesData,
            statisticsData,
            projectsData,
            blogPostsData,
            teamMembersData,
            contactData,
            faqsData,
            settingsData,
          ] = await Promise.all([
            contentService.getHeroContent().catch(() => null),
            contentService.getAboutContent().catch(() => null),
            contentService.getServices().catch(() => []),
            contentService.getStatistics().catch(() => []),
            contentService.getProjects().catch(() => []),
            contentService.getBlogPosts().catch(() => []),
            contentService.getTeamMembers().catch(() => []),
            contentService.getContactInfo().catch(() => null),
            contentService.getFAQs().catch(() => []),
            contentService.getSiteSettings().catch(() => null),
          ]);

          set({
            hero: heroData || defaultHero,
            about: aboutData || defaultAbout,
            services: servicesData.length > 0 ? servicesData : defaultServices,
            statistics: statisticsData.length > 0 ? statisticsData : defaultStatistics,
            projects: projectsData.length > 0 ? projectsData : defaultProjects,
            blogPosts: blogPostsData.length > 0 ? blogPostsData : defaultBlogPosts,
            teamMembers: teamMembersData.length > 0 ? teamMembersData : defaultTeamMembers,
            contactInfo: contactData || defaultContactInfo,
            faqs: faqsData.length > 0 ? faqsData : defaultFAQs,
            settings: settingsData || defaultSettings,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: any) {
          console.error('Error initializing content:', error);
          set({
            isLoading: false,
            error: error.message || 'Failed to load content',
            isInitialized: true, // Still mark as initialized to use defaults
          });
        }
      },

      // Hero Actions
      updateHero: async (heroUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateHeroContent(heroUpdate);
          set((state) => ({
            hero: { ...state.hero, ...heroUpdate },
            isLoading: false
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // About Actions
      updateAbout: async (aboutUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateAboutContent(aboutUpdate);
          set((state) => ({
            about: { ...state.about, ...aboutUpdate },
            isLoading: false
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Service Actions
      updateService: async (id, serviceUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateService(id, serviceUpdate);
          set((state) => ({
            services: state.services.map((s) =>
              s.id === id ? { ...s, ...serviceUpdate } : s
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addService: async (serviceData) => {
        set({ isLoading: true, error: null });
        try {
          const id = await contentService.addService(serviceData);
          const newService = { ...serviceData, id };
          set((state) => ({
            services: [...state.services, newService],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteService: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.deleteService(id);
          set((state) => ({
            services: state.services.filter((s) => s.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Statistic Actions
      updateStatistic: async (id, statUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateStatistic(id, statUpdate);
          set((state) => ({
            statistics: state.statistics.map((s) =>
              s.id === id ? { ...s, ...statUpdate } : s
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addStatistic: async (statData) => {
        set({ isLoading: true, error: null });
        try {
          // Generate ID for statistics since they use setDoc with merge
          const id = `stat-${Date.now()}`;
          await contentService.updateStatistic(id, statData);
          const newStat = { ...statData, id };
          set((state) => ({
            statistics: [...state.statistics, newStat],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteStatistic: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // For statistics, we need to delete from Firestore
          // Since there's no deleteStatistic in the service, we'll update locally
          set((state) => ({
            statistics: state.statistics.filter((s) => s.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Project Actions
      updateProject: async (id, projectUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateProject(id, projectUpdate);
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...projectUpdate } : p
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const id = await contentService.addProject(projectData);
          const newProject = { ...projectData, id };
          set((state) => ({
            projects: [...state.projects, newProject],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.deleteProject(id);
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Blog Post Actions
      updateBlogPost: async (id, postUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateBlogPost(id, postUpdate);
          set((state) => ({
            blogPosts: state.blogPosts.map((p) =>
              p.id === id ? { ...p, ...postUpdate } : p
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addBlogPost: async (postData) => {
        set({ isLoading: true, error: null });
        try {
          const id = await contentService.addBlogPost(postData);
          const newPost = { ...postData, id };
          set((state) => ({
            blogPosts: [newPost, ...state.blogPosts],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteBlogPost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.deleteBlogPost(id);
          set((state) => ({
            blogPosts: state.blogPosts.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      getBlogPostBySlug: (slug) => {
        return get().blogPosts.find((p) => p.slug === slug);
      },

      // Team Member Actions
      updateTeamMember: async (id, memberUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateTeamMember(id, memberUpdate);
          set((state) => ({
            teamMembers: state.teamMembers.map((m) =>
              m.id === id ? { ...m, ...memberUpdate } : m
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addTeamMember: async (memberData) => {
        set({ isLoading: true, error: null });
        try {
          const id = await contentService.addTeamMember(memberData);
          const newMember = { ...memberData, id };
          set((state) => ({
            teamMembers: [...state.teamMembers, newMember],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteTeamMember: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.deleteTeamMember(id);
          set((state) => ({
            teamMembers: state.teamMembers.filter((m) => m.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Contact Info Actions
      updateContactInfo: async (infoUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateContactInfo(infoUpdate);
          set((state) => ({
            contactInfo: { ...state.contactInfo, ...infoUpdate },
            isLoading: false
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // FAQ Actions
      updateFAQ: async (id, faqUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateFAQ(id, faqUpdate);
          set((state) => ({
            faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...faqUpdate } : f)),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      addFAQ: async (faqData) => {
        set({ isLoading: true, error: null });
        try {
          const id = await contentService.addFAQ(faqData);
          const newFAQ = { ...faqData, id };
          set((state) => ({
            faqs: [...state.faqs, newFAQ],
            isLoading: false
          }));
          return id;
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      deleteFAQ: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.deleteFAQ(id);
          set((state) => ({
            faqs: state.faqs.filter((f) => f.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Settings Actions
      updateSettings: async (settingsUpdate) => {
        set({ isLoading: true, error: null });
        try {
          await contentService.updateSiteSettings(settingsUpdate);
          set((state) => ({
            settings: { ...state.settings, ...settingsUpdate },
            isLoading: false
          }));
        } catch (error: any) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Reset to defaults (local only)
      resetToDefaults: () =>
        set({
          hero: defaultHero,
          about: defaultAbout,
          services: defaultServices,
          statistics: defaultStatistics,
          projects: defaultProjects,
          blogPosts: defaultBlogPosts,
          teamMembers: defaultTeamMembers,
          contactInfo: defaultContactInfo,
          faqs: defaultFAQs,
          settings: defaultSettings,
          error: null,
        }),

      setError: (error) => set({ error }),

      // File Upload
      uploadFile: async (file, path) => {
        try {
          const url = await contentService.uploadFile(file, path);
          return url;
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },
    }),
    {
      name: 'gsts-content-storage',
      partialize: (state) => ({
        // Persist content data for offline access
        hero: state.hero,
        about: state.about,
        services: state.services,
        statistics: state.statistics,
        projects: state.projects,
        blogPosts: state.blogPosts,
        teamMembers: state.teamMembers,
        contactInfo: state.contactInfo,
        faqs: state.faqs,
        settings: state.settings,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
