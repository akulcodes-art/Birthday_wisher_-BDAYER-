import { useState, useEffect } from 'react';
import { auth } from './firebaseSetup';
import { onAuthStateChanged, type User } from 'firebase/auth';
import BirthdayFeed from './components/BirthdayFeed';
import SignUp from './components/SignUp';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This "listener" checks if someone is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Bdayer...</div>;

  return (
  <div style={{ 
    minHeight: '100vh', 
    width: '100vw', 
    backgroundColor: '#f8fafc', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center' // This centers horizontally
  }}>
    {/* Navbar */}
    <nav style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid #e2e8f0',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ color: '#2563eb', fontWeight: 900, margin: 0, fontSize: '1.5rem' }}>BDAYER</h1>
      {user && (
        <button 
          onClick={() => auth.signOut()} 
          style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #cbd5e1', background: 'white' }}
        >
          Logout
        </button>
      )}
    </nav>

    {/* Main Content Area */}
    <main style={{ 
      width: '100%', 
      maxWidth: '600px', // Prevents it from stretching too wide
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Centers the children (SignUp or Feed)
    }}>
      {user ? (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Logged in as: <strong>{user.email}</strong></p>
          <BirthdayFeed />
        </div>
      ) : (
        <SignUp />
      )}
    </main>
  </div>
);

}

export default App;