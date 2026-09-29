import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { WaldriftLogo } from '../components/WaldriftLogo';
import { Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      setCurrentPage('customer-dashboard');
    } else {
      setError(result.error || 'Unable to sign in. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <WaldriftLogo size="md" />
          <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white mt-4">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-neutral-400">
            Access your garage, loyalty stamp card, and wash appointments
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In &rarr;'}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
          Don&apos;t have an account yet?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-red-400 hover:text-red-300 font-600 underline"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
