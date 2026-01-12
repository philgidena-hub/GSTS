import { useState } from 'react';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuthStore } from '../../stores/authStore';
import { seedAllData } from '../../utils/seedData';

export const SetupAdmin = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const makeCurrentUserAdmin = async () => {
    if (!user || !auth.currentUser) {
      setError('You must be logged in to become an admin');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Check if any admin exists
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const existingAdmin = usersSnapshot.docs.find(
        (doc) => doc.data().role === 'admin'
      );

      if (existingAdmin) {
        setError('An admin already exists. This setup can only be used once.');
        setLoading(false);
        return;
      }

      // Update current user to admin
      await setDoc(
        doc(db, 'users', user.id),
        {
          ...user,
          role: 'admin',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage('You are now an admin! Please refresh the page.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set up admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await seedAllData();
      setMessage('Initial data seeded successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h1>Admin Setup</h1>
        <p>Please log in first to set up the admin account.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>GSTS Admin Setup</h1>
      <p>Logged in as: {user.email}</p>

      <div style={styles.section}>
        <h2>Step 1: Make yourself Admin</h2>
        <p>This can only be done once. The first user to click this becomes the admin.</p>
        <button
          onClick={makeCurrentUserAdmin}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Setting up...' : 'Make Me Admin'}
        </button>
      </div>

      <div style={styles.section}>
        <h2>Step 2: Seed Initial Data</h2>
        <p>This will create membership plans, site content, and service clusters.</p>
        <button
          onClick={handleSeedData}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Seeding...' : 'Seed Initial Data'}
        </button>
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
  },
  section: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  success: {
    color: '#16a34a',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0fdf4',
    borderRadius: '6px',
  },
  error: {
    color: '#dc2626',
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#fef2f2',
    borderRadius: '6px',
  },
};

export default SetupAdmin;
