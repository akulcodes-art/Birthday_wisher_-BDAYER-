import { useState, useEffect } from 'react';
import { auth, db } from './firebaseSetup';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; 
import GlobalCounter from './components/GlobalCounter';
import BirthdayFeed from './components/BirthdayFeed';
import SignUp from './components/SignUp';
import './App.css'; // Make sure this is imported!

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishCount, setWishCount] = useState(0); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setWishCount(0);
      return;
    }
    const wishesRef = collection(db, "wishes");
    const q = query(wishesRef, where("toUserId", "==", user.uid));
    const unsubscribeWishes = onSnapshot(q, (snapshot) => {
      setWishCount(snapshot.size); 
    }, (error) => {
      console.error("Error listening for wishes:", error);
    });
    return () => unsubscribeWishes();
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading Bdayer...</div>;

  return (
    // UPDATED container: Added App.css styles and semi-transparent overlay
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      background: 'rgba(0,0,0,0.1)' // Slight dark overlay to ensure text contrast
    }}>
      
      {/* ========================================= */}
      {/* 1. NEW: The pure CSS background slideshow */}
      {/* ========================================= */}
      {/* 1. The pure CSS background slideshow */}
      {/* ========================================= */}
      {/* 1. The pure CSS background slideshow */}
      <div className="background-slideshow">
        <div className="slideshow-image img-1"></div>
        <div className="slideshow-image img-2"></div>
      </div>
      {/* ========================================= */}
      {/* ========================================= */}
      {/* ========================================= */}

      {/* Navbar - UPDATED: Transparent background and glass-panel class */}
      <nav 
        className="glass-panel" // Frosted glass effect
        style={{ 
          width: '100%', 
          padding: '1rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxSizing: 'border-box',
          position: 'sticky', // Keep nav on top
          top: 0,
          zIndex: 100
      }}>
        <h1 style={{ color: '#2563eb', fontWeight: 900, margin: 0, fontSize: '1.5rem' }}>BDAYER</h1>
        {user && (
          <button 
            onClick={() => auth.signOut()} 
            style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}
          >
            Logout
          </button>
        )}
      </nav>

      <main style={{ width: '100%', maxWidth: '600px', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {user ? (
          <div style={{ width: '100%', textAlign: 'center' }}>
            
            <GlobalCounter />

            {/* Wishes Received section - ADDED boxShadow for definition */}
            <div style={{ 
              backgroundColor: '#ec4899', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '20px', 
              marginBottom: '30px', 
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.6)' 
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Wishes Received</h2>
              <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{wishCount}</div>
              <p style={{ margin: 0, opacity: 0.9 }}>People have celebrated you today!</p>
            </div>

            {/* UPDATED email panel with glassmorphism */}
            <div className="glass-panel" style={{ padding: '10px', borderRadius: '12px', marginBottom: '20px', display: 'inline-block' }}>
                <p style={{ color: '#1e293b', margin: 0 }}>Logged in as: <strong>{user.email}</strong></p>
            </div>
            
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