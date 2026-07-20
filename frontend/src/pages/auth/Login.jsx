import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const from = location.state?.from?.pathname || '/dashboard';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 6) nextErrors.password = 'Password should be at least 6 characters.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-app text-primary lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-sidebar px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link className="text-base font-extrabold text-white" to="/login">Pyramids</Link>
            <span className="font-mono-label text-xs text-white/45">Verified builder network</span>
          </div>
          <div>
            <p className="font-mono-label text-xs text-white/45">Login / continue building</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-5xl">
              Your proof of work belongs in motion.
            </h1>
            <p className="mt-7 max-w-xl text-base font-semibold leading-7 text-white/62">
              Sign in to verify projects, discover collaborators, manage requests, and keep climbing toward Pyramidion.
            </p>
          </div>
          <div className="grid grid-cols-3 border border-white/15 text-white/70">
            {['Projects', 'Skills', 'Teams'].map((item, index) => (
              <div className="border-r border-white/15 p-4 last:border-r-0" key={item}>
                <p className="font-mono-label text-[11px] text-white/38">0{index + 1}</p>
                <p className="mt-3 text-sm font-extrabold">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute right-[-18%] top-[16%] h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[10%] h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <p className="font-mono-label text-xs text-secondary">Secure access</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-primary">Welcome back.</h2>
          <p className="mt-4 text-sm font-semibold leading-6 text-secondary">Enter your credentials to continue to your Pyramids workspace.</p>

          {apiError && (
            <p className="mt-5 px-4 py-3 text-sm font-semibold rounded-lg" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{apiError}</p>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Email</span>
              <Input
                type="email"
                placeholder="student@campus.edu"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
              <FieldError>{errors.email}</FieldError>
            </label>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Password</span>
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
              <FieldError>{errors.password}</FieldError>
            </label>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Enter Dashboard'}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm font-semibold text-secondary">
            New here?{' '}
            <Link className="font-extrabold text-primary underline decoration-primary/30 underline-offset-4" to="/signup">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
