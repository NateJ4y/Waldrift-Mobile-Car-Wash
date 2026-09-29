import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { WaldriftLogo } from '../components/WaldriftLogo';
import { User, Mail, Phone, Gift, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, setCurrentPage } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in your name and email address.');
      return;
    }

    registerUser({
      full_name: fullName,
      email,
      phone,
      referral_code_used: referralCode.trim() || undefined,
    });

    setCurrentPage('customer-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-3">
          <WaldriftLogo size="md" />
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white mt-4">
            Join Waldrift Car Wash
          </h2>
          <p className="text-xs text-neutral-400">
            Register to track wash history, earn 4th free washes, and refer friends
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Sipho Mthembu"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            icon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. sipho@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Phone / WhatsApp Number"
            placeholder="e.g. 082 555 1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            icon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="Referral Code (Optional — Get R20 Credit)"
            placeholder="e.g. WALDRIFT20"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            icon={<Gift className="w-4 h-4" />}
            helperText="Enter a friend's code to get R20 bonus credit on your account"
          />

          <Button type="submit" variant="primary" size="md" className="w-full">
            Create Account &amp; Open Garage &rarr;
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-red-400 hover:text-red-300 font-600 underline"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
