'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const RegisterDoctorForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    license_number: '',
    specialization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register({ ...formData, user_type: 'DOCTOR' });

    if (result.success) {
      router.push('/en/login?registered=true');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="alert-danger">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
      </div>
      
      <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
      <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
      <Input label="RMDC License Number" name="license_number" value={formData.license_number} onChange={handleChange} placeholder="e.g. RMDC/2024/XXXXX" required />
      <Input label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g., Nephrologist" required />
      <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
      <Input label="Confirm Password" type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required />

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? 'Registering...' : 'Register as Doctor'}
      </Button>
    </form>
  );
};

export default RegisterDoctorForm;