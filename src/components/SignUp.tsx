import { useState } from 'react';
import { auth, db } from '../firebaseSetup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const dateObj = new Date(dob);
      const birthMonth = dateObj.getMonth() + 1;
      const birthDay = dateObj.getDate();

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        birthMonth: birthMonth,
        birthDay: birthDay,
        email: email
      });

      alert("Signed up successfully!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 p-6 border rounded-xl max-w-sm mx-auto bg-white shadow-md">
      <h2 className="text-xl font-bold">Join Bdayer</h2>
      <input type="text" placeholder="Full Name" className="p-2 border rounded" onChange={(e) => setName(e.target.value)} required />
      <input type="email" placeholder="Email" className="p-2 border rounded" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="p-2 border rounded" onChange={(e) => setPassword(e.target.value)} required />
      <input type="date" className="p-2 border rounded" onChange={(e) => setDob(e.target.value)} required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded font-bold">Create Account</button>
    </form>
  );
}