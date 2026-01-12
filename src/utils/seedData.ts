import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Seed membership plans
export const seedMembershipPlans = async () => {
  const plans = [
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

  for (const plan of plans) {
    await setDoc(doc(db, 'membershipPlans', plan.id), {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  console.log('Membership plans seeded successfully!');
};

// Seed initial site content
export const seedSiteContent = async () => {
  const content = {
    hero: {
      title: 'Global Society of Tigray Scholars and Professionals',
      subtitle: 'Uniting scholars and professionals worldwide to contribute to the development and prosperity of Tigray',
      ctaText: 'Join Us',
      ctaLink: '/membership',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/about',
    },
    about: {
      title: 'About GSTS',
      description: 'The Global Society of Tigray Scholars and Professionals (GSTS) is a non-profit organization dedicated to mobilizing the expertise and resources of Tigrayan scholars and professionals worldwide.',
      mission: 'To harness the collective knowledge and skills of Tigrayan professionals globally to contribute to sustainable development, education, and humanitarian efforts in Tigray.',
      vision: 'A thriving Tigray empowered by its global diaspora of scholars and professionals.',
    },
    contact: {
      email: 'info@gsts.org',
      phone: '+1 (555) 123-4567',
      address: 'Global Society of Tigray Scholars and Professionals',
    },
  };

  await setDoc(doc(db, 'content', 'main'), {
    ...content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log('Site content seeded successfully!');
};

// Seed service clusters
export const seedServiceClusters = async () => {
  const clusters = [
    {
      id: 'social',
      name: 'Social Cluster',
      description: 'Health, Education, and Social Services',
      icon: 'Heart',
      order: 1,
    },
    {
      id: 'economic',
      name: 'Economic Cluster',
      description: 'Trade, Agriculture, and Industry',
      icon: 'TrendingUp',
      order: 2,
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Cluster',
      description: 'Energy, Water, and Construction',
      icon: 'Building',
      order: 3,
    },
    {
      id: 'governance',
      name: 'Governance Cluster',
      description: 'Policy, Law, and Administration',
      icon: 'Scale',
      order: 4,
    },
    {
      id: 'crosscutting',
      name: 'Cross-Cutting Cluster',
      description: 'Environment, Gender, and Technology',
      icon: 'Layers',
      order: 5,
    },
  ];

  for (const cluster of clusters) {
    await setDoc(doc(db, 'content', `cluster_${cluster.id}`), {
      ...cluster,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  console.log('Service clusters seeded successfully!');
};

// Run all seed functions
export const seedAllData = async () => {
  try {
    await seedMembershipPlans();
    await seedSiteContent();
    await seedServiceClusters();
    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
