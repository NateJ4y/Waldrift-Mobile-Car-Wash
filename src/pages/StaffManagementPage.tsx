import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserCog, RefreshCw, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

type ManageableProfile = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
  created_at: string;
};

export const StaffManagementPage: React.FC = () => {
  const { currentUser, listManageableProfiles, assignUserRole, setCurrentPage } = useApp();
  const [profiles, setProfiles] = useState<ManageableProfile[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'staff' | 'admin'>('staff');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError('');
    const result = await listManageableProfiles();
    if (result.error) setError(result.error);
    else setProfiles((result.data || []) as ManageableProfile[]);
  };

  useEffect(() => { void load(); }, []);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShieldCheck className="w-12 h-12 mx-auto text-red-400" />
        <h1 className="font-oswald text-3xl uppercase text-white mt-4">Admin Access Required</h1>
        <p className="text-sm text-neutral-400 mt-2">Only an assigned administrator can manage staff roles.</p>
        <Button className="mt-6" onClick={() => setCurrentPage('landing')}>Return Home</Button>
      </div>
    );
  }

  const filtered = profiles.filter(p =>
    [p.full_name, p.email, p.phone, p.role].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const assign = async (targetEmail: string, targetRole: 'customer' | 'staff' | 'admin') => {
    setStatus('');
    setError('');
    setLoading(true);
    const result = await assignUserRole(targetEmail, targetRole);
    setLoading(false);
    if (result.error) setError(result.error);
    else { setStatus(`Role updated to ${targetRole}.`); await load(); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-red-400">Waldrift Administration</p>
          <h1 className="font-oswald text-4xl uppercase text-white mt-1">Staff &amp; Access Control</h1>
          <p className="text-sm text-neutral-400 mt-2">Assign registered accounts to Customer, Staff, or Admin roles.</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <UserCog className="w-5 h-5 text-red-400" />
            <h2 className="font-oswald text-xl uppercase text-white">Assign Existing Account</h2>
          </div>
          <p className="text-xs text-neutral-500">
            The person must first have a Waldrift account. Their password remains theirs; this only changes their access role.
          </p>
          <Input label="Account Email" type="email" placeholder="staff@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="block text-xs font-semibold text-neutral-300">
            New Role
            <select value={role} onChange={e => setRole(e.target.value as 'staff' | 'admin')} className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-white">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <Button className="w-full" disabled={!email.trim() || loading} onClick={() => void assign(email.trim(), role)}>
            {loading ? 'Updating...' : 'Assign Role'}
          </Button>
          {status && <p className="text-xs text-emerald-400">{status}</p>}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
            <h2 className="font-oswald text-xl uppercase text-white">Registered Accounts</h2>
            <div className="sm:w-64"><Input placeholder="Search name, email or role..." value={search} onChange={e => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} /></div>
          </div>
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="border border-dashed border-neutral-700 rounded-xl p-8 text-center text-sm text-neutral-500">No accounts found.</div>
            ) : filtered.map(profile => (
              <div key={profile.id} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
                <div>
                  <div className="text-white font-semibold">{profile.full_name || 'Unnamed account'}</div>
                  <div className="text-xs text-neutral-500">{profile.email}{profile.phone ? ` · ${profile.phone}` : ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={profile.role} onChange={e => void assign(profile.email, e.target.value as 'customer' | 'staff' | 'admin')} disabled={loading || (profile.id === currentUser.id)} className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white">
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StaffManagementPage;
