import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Default Hero Content
const defaultHero = {
  title: 'Empowering Tigray Through Knowledge',
  subtitle: 'Global Society of Tigray Scholars and Professionals',
  description: 'A global knowledge network of over 5,000 Tigrayan academics, professionals, intellectuals, scientists, policy makers, industry leaders, educators, students, and allies worldwide dedicated to knowledge-driven solutions for Tigray\'s development.',
  primaryButtonText: 'Become a Member',
  primaryButtonLink: '/membership',
  secondaryButtonText: 'Learn More',
  secondaryButtonLink: '/about',
  backgroundImage: '/images/Hero_Image.jpg',
};

// Default About Content
const defaultAbout = {
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

// Default Services/Thematic Areas
const defaultServices = [
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

// Default Statistics
const defaultStatistics = [
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

// Default Projects
const defaultProjects = [
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

// Default Blog Posts
const defaultBlogPosts = [
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

// Default Team Members
const defaultTeamMembers = [
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

// Default Contact Info
const defaultContactInfo = {
  address: 'Mekelle',
  city: 'Mekelle',
  country: 'Tigray, Ethiopia',
  email: 'info@gsts.org',
  phone: '+12 (3) 456 000',
  workingHours: 'Mon - Fri: 9:00 AM - 5:00 PM',
};

// Default FAQs
const defaultFAQs = [
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

// Default Partners
const defaultPartners = [
  {
    id: 'partner-1',
    name: 'Mekelle University',
    logo: '/partner logos/mu_logo_mini.png',
    website: 'https://www.mu.edu.et',
    order: 1,
  },
  {
    id: 'partner-2',
    name: 'Adigrat University',
    logo: '/partner logos/Adigrat_Uni-removebg-preview-1.png',
    website: 'https://www.adu.edu.et',
    order: 2,
  },
  {
    id: 'partner-3',
    name: 'Axum University',
    logo: '/partner logos/Axum university.png',
    website: 'https://www.axumuniversity.edu.et',
    order: 3,
  },
  {
    id: 'partner-4',
    name: 'Tigray Development Association',
    logo: '/partner logos/cropped-Site_Logo-removebg-preview.png',
    website: 'https://www.tda.org.et',
    order: 4,
  },
];

// Default Site Settings
const defaultSettings = {
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
  seo: {
    title: 'GSTS - Global Society of Tigray Scholars and Professionals',
    description: 'A global knowledge network dedicated to Tigray\'s development and reconstruction.',
    keywords: ['GSTS', 'Tigray', 'scholars', 'professionals', 'development', 'Africa'],
  },
};

// Default Membership Plans
const defaultMembershipPlans = [
  {
    id: 'associate',
    name: 'Associate Member',
    price: 0,
    period: 'year',
    description: 'For students and early-career professionals',
    features: [
      'Access to member directory',
      'Newsletter subscription',
      'Event notifications',
      'Online community access',
    ],
    recommended: false,
    order: 1,
  },
  {
    id: 'professional',
    name: 'Professional Member',
    price: 50,
    period: 'year',
    description: 'For established professionals and academics',
    features: [
      'All Associate benefits',
      'Voting rights',
      'Committee participation',
      'Mentorship opportunities',
      'Professional development resources',
      'Conference discounts',
    ],
    recommended: true,
    order: 2,
  },
  {
    id: 'lifetime',
    name: 'Lifetime Member',
    price: 500,
    period: 'once',
    description: 'One-time payment for lifetime membership',
    features: [
      'All Professional benefits',
      'Lifetime access',
      'VIP event invitations',
      'Recognition on website',
      'Executive committee eligibility',
      'Priority support',
    ],
    recommended: false,
    order: 3,
  },
];

// Seed Hero Content
export const seedHeroContent = async () => {
  await setDoc(doc(db, 'content', 'hero'), {
    ...defaultHero,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('Hero content seeded!');
};

// Seed About Content
export const seedAboutContent = async () => {
  await setDoc(doc(db, 'content', 'about'), {
    ...defaultAbout,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('About content seeded!');
};

// Seed Services
export const seedServices = async () => {
  for (const service of defaultServices) {
    await setDoc(doc(db, 'services', service.id), {
      ...service,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Services seeded!');
};

// Seed Statistics
export const seedStatistics = async () => {
  for (const stat of defaultStatistics) {
    await setDoc(doc(db, 'statistics', stat.id), {
      ...stat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Statistics seeded!');
};

// Seed Projects
export const seedProjects = async () => {
  for (const project of defaultProjects) {
    await setDoc(doc(db, 'projects', project.id), {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Projects seeded!');
};

// Seed Blog Posts
export const seedBlogPosts = async () => {
  for (const post of defaultBlogPosts) {
    await setDoc(doc(db, 'blogPosts', post.id), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Blog posts seeded!');
};

// Seed Team Members
export const seedTeamMembers = async () => {
  for (const member of defaultTeamMembers) {
    await setDoc(doc(db, 'teamMembers', member.id), {
      ...member,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Team members seeded!');
};

// Seed Contact Info
export const seedContactInfo = async () => {
  await setDoc(doc(db, 'content', 'contact'), {
    ...defaultContactInfo,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('Contact info seeded!');
};

// Seed FAQs
export const seedFAQs = async () => {
  for (const faq of defaultFAQs) {
    await setDoc(doc(db, 'faqs', faq.id), {
      ...faq,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('FAQs seeded!');
};

// Seed Partners
export const seedPartners = async () => {
  for (const partner of defaultPartners) {
    await setDoc(doc(db, 'partners', partner.id), {
      ...partner,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Partners seeded!');
};

// Seed Site Settings
export const seedSiteSettings = async () => {
  await setDoc(doc(db, 'content', 'settings'), {
    ...defaultSettings,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('Site settings seeded!');
};

// Seed Membership Plans
export const seedMembershipPlans = async () => {
  for (const plan of defaultMembershipPlans) {
    await setDoc(doc(db, 'membershipPlans', plan.id), {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Membership plans seeded!');
};

// Seed All Data
export const seedAllData = async () => {
  try {
    console.log('Starting data seeding...');

    await seedHeroContent();
    await seedAboutContent();
    await seedServices();
    await seedStatistics();
    await seedProjects();
    await seedBlogPosts();
    await seedTeamMembers();
    await seedContactInfo();
    await seedFAQs();
    await seedPartners();
    await seedSiteSettings();
    await seedMembershipPlans();

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
