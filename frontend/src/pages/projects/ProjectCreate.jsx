import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import FieldError from '../../components/common/FieldError.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { domains } from '../../data/mockData.js';
import { projectService } from '../../services/projectService.js';

const starterSkills = ['React', 'Python', 'Design', 'APIs', 'ML', 'Research'];

function ProjectCreate() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: '',
    domain: domains[0].name,
    description: '',
    stack: '',
    teamSize: '',
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const teamSize = Number(form.teamSize);

    if (form.title.trim().length < 4) {
      nextErrors.title = 'Project title should be at least 4 characters.';
    }

    if (form.description.trim().length < 20) {
      nextErrors.description = 'Description should explain the project in at least 20 characters.';
    }

    if (!form.stack.trim()) {
      nextErrors.stack = 'Add at least one technology or tool.';
    }

    if (!teamSize || teamSize < 1 || teamSize > 8) {
      nextErrors.teamSize = 'Team size must be between 1 and 8.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await projectService.createProject({
      ...form,
      teamSize,
      stack: form.stack.split(',').map((item) => item.trim()).filter(Boolean),
      requiredSkills: starterSkills.slice(0, 3),
    });
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        eyebrow="New build"
        title="Create Project"
        description="Describe what you are building, what skills it proves, and what kind of teammates you need."
      />

      <Card className="mt-10 p-8">
        {submitted ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-app">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-3xl font-black text-primary">Project saved as a mock draft</h2>
            <p className="mt-3 max-w-md text-sm font-medium leading-6 text-secondary">
              No backend was used. This confirms the creation flow structure for the future API.
            </p>
            <Button className="mt-6" onClick={() => setSubmitted(false)}>
              Add another project
            </Button>
          </div>
        ) : (
          <form
            className="grid grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Project Title</span>
              <Input
                placeholder="Campus Skill Graph"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
              />
              <FieldError>{errors.title}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Domain</span>
              <select
                className="h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm font-semibold text-primary outline-none"
                value={form.domain}
                onChange={(event) => updateField('domain', event.target.value)}
              >
                {domains.map((domain) => (
                  <option key={domain.id}>{domain.name}</option>
                ))}
              </select>
            </label>

            <label className="col-span-2 space-y-2">
              <span className="text-sm font-black text-primary">Short Description</span>
              <textarea
                className="min-h-32 w-full rounded-lg border border-subtle bg-surface px-4 py-3 text-sm font-semibold leading-6 text-primary outline-none placeholder:text-secondary"
                placeholder="What problem does this project solve?"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
              />
              <FieldError>{errors.description}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Tech Stack</span>
              <Input
                placeholder="React, Tailwind, Node"
                value={form.stack}
                onChange={(event) => updateField('stack', event.target.value)}
              />
              <FieldError>{errors.stack}</FieldError>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-primary">Team Size</span>
              <Input
                type="number"
                min="1"
                max="8"
                placeholder="3"
                value={form.teamSize}
                onChange={(event) => updateField('teamSize', event.target.value)}
              />
              <FieldError>{errors.teamSize}</FieldError>
            </label>

            <div className="col-span-2">
              <span className="text-sm font-black text-primary">Required Skills</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {starterSkills.map((skill) => (
                  <SkillTag key={skill}>{skill}</SkillTag>
                ))}
              </div>
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                type="reset"
                onClick={() => {
                  setForm({ title: '', domain: domains[0].name, description: '', stack: '', teamSize: '' });
                  setErrors({});
                }}
              >
                Clear
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4" />
                Create Mock Project
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default ProjectCreate;
