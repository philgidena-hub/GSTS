import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

// Default content data
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
    content: '',
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
    content: '',
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
    content: '',
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
  logo: '/images/logo.png',
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

  // Actions
  updateHero: (hero: Partial<HeroContent>) => void;
  updateAbout: (about: Partial<AboutContent>) => void;
  updateService: (id: string, service: Partial<ServiceCluster>) => void;
  addService: (service: ServiceCluster) => void;
  deleteService: (id: string) => void;
  updateStatistic: (id: string, stat: Partial<Statistic>) => void;
  addStatistic: (stat: Statistic) => void;
  deleteStatistic: (id: string) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  addBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  addTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  addFAQ: (faq: FAQ) => void;
  deleteFAQ: (id: string) => void;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
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

      updateHero: (hero) =>
        set((state) => ({ hero: { ...state.hero, ...hero } })),

      updateAbout: (about) =>
        set((state) => ({ about: { ...state.about, ...about } })),

      updateService: (id, service) =>
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...service } : s
          ),
        })),

      addService: (service) =>
        set((state) => ({ services: [...state.services, service] })),

      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      updateStatistic: (id, stat) =>
        set((state) => ({
          statistics: state.statistics.map((s) =>
            s.id === id ? { ...s, ...stat } : s
          ),
        })),

      addStatistic: (stat) =>
        set((state) => ({ statistics: [...state.statistics, stat] })),

      deleteStatistic: (id) =>
        set((state) => ({
          statistics: state.statistics.filter((s) => s.id !== id),
        })),

      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        })),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      updateBlogPost: (id, post) =>
        set((state) => ({
          blogPosts: state.blogPosts.map((p) =>
            p.id === id ? { ...p, ...post } : p
          ),
        })),

      addBlogPost: (post) =>
        set((state) => ({ blogPosts: [...state.blogPosts, post] })),

      deleteBlogPost: (id) =>
        set((state) => ({
          blogPosts: state.blogPosts.filter((p) => p.id !== id),
        })),

      updateTeamMember: (id, member) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, ...member } : m
          ),
        })),

      addTeamMember: (member) =>
        set((state) => ({ teamMembers: [...state.teamMembers, member] })),

      deleteTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),

      updateContactInfo: (info) =>
        set((state) => ({ contactInfo: { ...state.contactInfo, ...info } })),

      updateFAQ: (id, faq) =>
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...faq } : f)),
        })),

      addFAQ: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),

      deleteFAQ: (id) =>
        set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) })),

      updateSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),

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
        }),
    }),
    {
      name: 'gsts-content-storage',
    }
  )
);
