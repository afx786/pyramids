import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FieldError from '../../components/common/FieldError.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { COURSES_BY_CATEGORY } from '../../data/courses.js';

const YEAR_OPTIONS = Array.from({ length: 21 }, (_, i) => 2020 + i);

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [builderIdStatus, setBuilderIdStatus] = useState(null);
  const [builderIdChecking, setBuilderIdChecking] = useState(false);
  const [form, setForm] = useState({ name: '', program: '', email: '', phone: '', builder_id: '', password: '', confirmPassword: '', joining_year: '', graduating_year: '' });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setApiError('');
    if (field === 'builder_id') checkBuilderId(value);
  }

  async function checkBuilderId(value) {
    const v = value.trim().toLowerCase();
    if (!v || v.length < 3 || v.length > 20 || !/^[a-z0-9_]+$/.test(v)) {
      setBuilderIdStatus(null);
      setBuilderIdChecking(false);
      return;
    }
    setBuilderIdChecking(true);
    try {
      const res = await api.post('/auth/check-builder-id', { builder_id: v });
      setBuilderIdStatus(res.available ? 'available' : 'taken');
    } catch {
      setBuilderIdStatus(null);
    } finally {
      setBuilderIdChecking(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (form.name.trim().length < 2) nextErrors.name = 'Enter your name.';
    if (!form.program) nextErrors.program = 'Select your course.';
    if (!form.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (!form.phone.trim()) nextErrors.phone = 'Enter your phone number.';
    else if (form.phone.trim().length < 4 || form.phone.trim().length > 20) nextErrors.phone = 'Phone number must be between 4 and 20 characters.';
    const bid = form.builder_id.trim().toLowerCase();
    if (!bid) nextErrors.builder_id = 'Enter your Builder ID.';
    else if (!/^[a-z0-9_]{3,20}$/.test(bid)) nextErrors.builder_id = 'Builder ID must be 3-20 characters: letters, numbers, underscores only.';
    if (form.password.length < 6) nextErrors.password = 'Password should be at least 6 characters.';
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!form.joining_year) nextErrors.joining_year = 'Select your joining year.';
    if (!form.graduating_year) nextErrors.graduating_year = 'Select your graduating year.';
    if (form.joining_year && form.graduating_year && Number(form.graduating_year) < Number(form.joining_year)) {
      nextErrors.graduating_year = 'Graduating year cannot be earlier than joining year.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (builderIdStatus === 'taken') {
      setErrors({ builder_id: 'This Builder ID is already taken.' });
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone_number: form.phone.trim(),
        builder_id: bid,
        password: form.password,
        program: form.program,
        joining_year: form.joining_year ? Number(form.joining_year) : null,
        graduating_year: form.graduating_year ? Number(form.graduating_year) : null,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-app text-primary lg:grid-cols-[0.92fr_1.08fr]">
      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-xl">
          <p className="font-mono-label text-xs text-secondary">Join Pyramids</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.025em] text-primary sm:text-4xl">Create builder profile.</h1>
          <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-secondary">
            Build a verified profile for your projects, technical skills, teammates, and campus collaborations.
          </p>

          {apiError && (
            <p className="mt-5 px-4 py-3 text-sm font-semibold rounded-lg" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>{apiError}</p>
          )}

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono-label text-xs text-secondary">
                Builder ID <span style={{ color: 'rgb(var(--color-error))' }}>*</span>
              </span>
              <div className="relative">
                <Input
                  placeholder="aaqib_khan"
                  value={form.builder_id}
                  onChange={(event) => updateField('builder_id', event.target.value)}
                  aria-describedby="builder-id-helper"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                  {builderIdChecking ? (
                    <span style={{ color: 'rgb(var(--color-on-surface-variant))' }}>checking...</span>
                  ) : builderIdStatus === 'available' ? (
                    <span style={{ color: 'rgb(var(--color-success))' }}>Available &#10003;</span>
                  ) : builderIdStatus === 'taken' ? (
                    <span style={{ color: 'rgb(var(--color-error))' }}>Already taken &#10007;</span>
                  ) : form.builder_id && !/^[a-z0-9_]{3,20}$/.test(form.builder_id.trim().toLowerCase()) ? (
                    <span style={{ color: 'rgb(var(--color-error))' }}>Invalid &#10007;</span>
                  ) : null}
                </span>
              </div>
              <p id="builder-id-helper" className="font-body-sm text-xs" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                This is your unique identity on Pyramids. Other builders will use it to invite you to teams.
              </p>
              <FieldError>{errors.builder_id}</FieldError>
            </label>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Full Name</span>
              <Input placeholder="Aarav Mehta" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              <FieldError>{errors.name}</FieldError>
            </label>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Course</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-3.5 text-sm font-semibold text-primary outline-none transition focus:border-primary"
                value={form.program}
                onChange={(event) => updateField('program', event.target.value)}
              >
                <option value="">Select your course</option>
                {COURSES_BY_CATEGORY.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.courses.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <FieldError>{errors.program}</FieldError>
            </label>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Joining Year</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-3.5 text-sm font-semibold text-primary outline-none transition focus:border-primary"
                value={form.joining_year}
                onChange={(event) => updateField('joining_year', event.target.value)}
              >
                <option value="">Select year</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <FieldError>{errors.joining_year}</FieldError>
            </label>
            <label className="space-y-2">
              <span className="font-mono-label text-xs text-secondary">Graduating Year</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-3.5 text-sm font-semibold text-primary outline-none transition focus:border-primary"
                value={form.graduating_year}
                onChange={(event) => updateField('graduating_year', event.target.value)}
              >
                <option value="">Select year</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <FieldError>{errors.graduating_year}</FieldError>
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono-label text-xs text-secondary">Email</span>
              <Input
                type="email"
                placeholder="student@campus.edu"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
              <FieldError>{errors.email}</FieldError>
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono-label text-xs text-secondary">Phone Number</span>
              <Input
                type="tel"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
              <p className="font-body-sm text-xs" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
                Private by default. Shared only when you approve a contact request.
              </p>
              <FieldError>{errors.phone}</FieldError>
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono-label text-xs text-secondary">Password</span>
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
              <FieldError>{errors.password}</FieldError>
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="font-mono-label text-xs text-secondary">Confirm Password</span>
              <Input
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
              />
              <FieldError>{errors.confirmPassword}</FieldError>
            </label>
            <p className="sm:col-span-2 font-body-sm text-xs" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.7)' }}>
              Your phone number remains private and is only shared with builders after you approve a contact request.
            </p>
            <Button className="w-full sm:col-span-2" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm font-semibold text-secondary">
            Already have an account?{' '}
            <Link className="font-extrabold text-primary underline decoration-primary/30 underline-offset-4" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-auth-hero-bg px-12 py-10 text-auth-hero lg:block">
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <Link className="text-base font-extrabold text-auth-hero" to="/login">Pyramids</Link>
            <span className="font-mono-label text-xs text-auth-hero/45">Explorer to Pyramidion</span>
          </div>
          <div>
            <p className="font-mono-label text-xs text-auth-hero/45">Repository intelligence / verified skills</p>
            <h2 className="mt-6 text-5xl font-semibold leading-tight tracking-[-0.03em] text-auth-hero">
              Turn real work into visible rank.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-auth-hero-border/15">
            {['Analyze GitHub repositories', 'Showcase projects', 'Find builders', 'Form teams'].map((item, index) => (
              <div className="p-5" style={{ background: 'rgb(var(--color-surface-container-lowest))' }} key={item}>
                <p className="font-mono-label text-[11px] text-auth-hero/38">0{index + 1}</p>
                <p className="mt-4 text-sm font-extrabold text-auth-hero">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute left-[-20%] top-[20%] h-[560px] w-[560px] rounded-full border border-auth-hero-border/10" />
        <div className="pointer-events-none absolute bottom-[-25%] left-[22%] h-[440px] w-[440px] rounded-full bg-auth-hero/10 blur-3xl" />
      </section>
    </main>
  );
}

export default Signup;
