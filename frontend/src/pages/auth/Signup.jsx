import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', program: '', email: '', password: '' });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setApiError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (form.program.trim().length < 3) nextErrors.program = 'Enter your program or department.';
    if (!form.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 6) nextErrors.password = 'Password should be at least 6 characters.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-app px-6 text-primary">
      <Card className="w-full max-w-lg p-8">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-secondary">Pyramids</p>
        <h1 className="mt-4 text-4xl font-black text-primary">Create builder profile</h1>
        <p className="mt-3 text-sm font-medium leading-6 text-secondary">
          Join the campus builder network to showcase projects and find teammates.
        </p>

        {apiError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{apiError}</p>
        )}

        <form className="mt-8 grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-black">Name</span>
            <Input placeholder="Aarav Mehta" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
            <FieldError>{errors.name}</FieldError>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-black">Program</span>
            <Input
              placeholder="BTech CSE"
              value={form.program}
              onChange={(event) => updateField('program', event.target.value)}
            />
            <FieldError>{errors.program}</FieldError>
          </label>
          <label className="col-span-2 space-y-2">
            <span className="text-sm font-black">Email</span>
            <Input
              type="email"
              placeholder="student@campus.edu"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            <FieldError>{errors.email}</FieldError>
          </label>
          <label className="col-span-2 space-y-2">
            <span className="text-sm font-black">Password</span>
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
            <FieldError>{errors.password}</FieldError>
          </label>
          <Button className="col-span-2 w-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-secondary">
          Already have an account?{' '}
          <Link className="font-black text-primary" to="/login">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}

export default Signup;
