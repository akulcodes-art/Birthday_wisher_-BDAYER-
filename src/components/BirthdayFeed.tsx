import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseSetup'; 
import { Cake } from 'lucide-react';
import styles from './BirthdayFeed.module.css';
import emailjs from '@emailjs/browser'; // Imports must always be at the very top

interface BdayUser {
  id: string;
  name: string;
  email: string; // FIX 1: Added email to the interface to stop the red line
}

export default function BirthdayFeed() {
  const [birthdayPeople, setBirthdayPeople] = useState<BdayUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodaysBirthdays = async () => {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      try {
        const q = query(
          collection(db, "users"), 
          where("birthMonth", "==", currentMonth),
          where("birthDay", "==", currentDay)
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as BdayUser[];
        setBirthdayPeople(users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodaysBirthdays();
  }, []);

  // FIX 2: Moved handleWish correctly inside the component but outside the useEffect
  const handleWish = async (recipientId: string, recipientName: string, recipientEmail: string) => {
    if (!auth.currentUser) {
      alert("Please log in to send a wish!");
      return;
    }

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "wishes"), {
        toUserId: recipientId,
        fromUserId: auth.currentUser.uid,
        fromUserName: auth.currentUser.email,
        timestamp: new Date()
      });

      // 2. Send the Email via EmailJS
      const templateParams = {
        to_name: recipientName,
        to_email: recipientEmail, 
        from_name: auth.currentUser.email,
      };

      await emailjs.send(
        'service_lnf23xd', 
        'template_977ec0g', 
        templateParams, 
        'tLIi0nyErDSxSpsVe'
      );

      alert(`🎉 Wish sent! ${recipientName} will receive an email shortly.`);
    } catch (error) {
      console.error("Failed to send wish/email:", error);
      alert("Could not send the wish. Check your connection.");
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <h2 className={styles.title}>
          <Cake style={{ marginRight: '10px' }} /> 
          Today's Birthdays
        </h2>
        <p>You share the day with these legends!</p>
      </div>

      <div className={styles.grid}>
        {birthdayPeople.length === 0 ? (
          <p>No birthdays found today. Why not invite a friend?</p>
        ) : (
          birthdayPeople.map((person) => (
            <div key={person.id} className={styles.card}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>{person.name[0]}</div>
                <h3 className={styles.userName}>{person.name}</h3>
              </div>
              
              <button 
                className={styles.wishButton}
                onClick={() => handleWish(person.id, person.name, person.email)}
              >
                Wish 🎂
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}