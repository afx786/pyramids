import { Bell, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService.js';

function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Builder');
  const [bio, setBio] = useState(user?.bio || 'Builder in the Pyramids ecosystem.');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await userService.updateProfile({ name, bio });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setSaveError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-xl max-w-3xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Settings</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Manage your account preferences and developer profile.
        </p>
      </header>

      <div className="space-y-xl">
        <div
          className="p-lg rounded-xl"
          style={{
            background: 'rgb(var(--color-surface-container-low))',
            border: '1px solid rgb(var(--color-outline-variant))',
          }}
        >
          <div className="flex items-center gap-md mb-lg">
            <User size={20} style={{ color: 'rgb(var(--color-primary))' }} />
            <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Profile</h3>
          </div>
          <div className="space-y-lg">
            {saveError ? (
              <p className="rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{saveError}</p>
            ) : null}
            {saveSuccess ? (
              <p className="rounded-lg px-lg py-sm font-body-sm" style={{ background: 'rgb(var(--color-success) / 0.15)', color: 'rgb(var(--color-success))' }}>Profile saved successfully.</p>
            ) : null}
            <div>
              <label className="font-label-caps text-label-caps block mb-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Display Name</label>
              <input
                className="w-full rounded-lg py-sm px-md font-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = 'rgb(var(--color-primary))'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps block mb-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Bio</label>
              <textarea
                className="w-full rounded-lg py-sm px-md font-body-sm resize-none"
                rows={3}
                style={{
                  background: 'rgb(var(--color-surface-container))',
                  border: '1px solid rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = 'rgb(var(--color-primary))'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
            </div>
          </div>
        </div>

        <div
          className="p-lg rounded-xl"
          style={{
            background: 'rgb(var(--color-surface-container-low))',
            border: '1px solid rgb(var(--color-outline-variant))',
          }}
        >
          <div className="flex items-center gap-md mb-lg">
            <Bell size={20} style={{ color: 'rgb(var(--color-primary))' }} />
            <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Notifications</h3>
          </div>
          <div className="space-y-lg">
            {[
              { label: 'Project Invitations', desc: 'When someone invites you to a project' },
              { label: 'Connection Requests', desc: 'When someone sends you a connection request' },
              { label: 'Verification Updates', desc: 'When a repository verification completes' },
              { label: 'Team Activity', desc: 'Updates from your teams and collaborations' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{item.label}</p>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div
                    className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                    style={{
                      background: 'rgb(var(--color-primary))',
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-lg rounded-xl"
          style={{
            background: 'rgb(var(--color-surface-container-low))',
            border: '1px solid rgb(var(--color-outline-variant))',
          }}
        >
          <div className="flex items-center gap-md mb-lg">
            <ShieldCheck size={20} style={{ color: 'rgb(var(--color-primary))' }} />
            <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Privacy & Security</h3>
          </div>
          <div className="space-y-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Public Profile</p>
                <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Make your profile visible to everyone</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                  style={{ background: 'rgb(var(--color-primary))' }}
                />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>Show Verified Skills</p>
                <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Display verified skills on your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
                  style={{ background: 'rgb(var(--color-primary))' }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-lg">
          <p className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.5)' }}>
            PYRAMIDS v2.4.1 — Proof Engine Active
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
