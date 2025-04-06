'use client'
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { role } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // useEffect(() => {
  //   if (role) {
  //     console.log("Updated role:", role);
  //     if (role === 'applicant_user') router.push('/applicant/dashboard');
  //     else if (role === 'recruiter_user') router.push('/recruiter/dashboard');
  //     else if (role === 'admin_user') router.push('/admin/dashboard');
  //   }
  // }, [role]); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("calling login backend api")
      await login(formData.username, formData.password);
      router.push("/support-resistance")
      
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="">{'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        {error && <span style={{ color: 'red' }}>{error}</span>}
        <button
          type="submit"
          className='btn'
        >
          {'Login'}
        </button>
      </form>
      {/* <LanguageSwitcher /> */}
    </div>
  );
};

export default LoginPage;