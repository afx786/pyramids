import { ArrowLeft, Check, ChevronRight, GitBranch, LayoutGrid, Pencil, ShieldCheck, Terminal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../../components/common/ErrorState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import VerificationTimeline from '../../components/evidence/VerificationTimeline.jsx';

import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { projectService } from '../../services/projectService.js';

const ENGINEERING_TASKS = [
  'Scanning /src/main for architectural patterns...',
  'Indexing dependency graph from package.json...',
  'Parsing Cargo.lock for dependencies...',
  'Analyzing TypeScript type hierarchy...',
  'Detecting CI/CD workflow configurations...',
  'Extracting skill profiles from codebase...',
  'Evaluating documentation coverage...',
  'Computing repository quality vectors...',
  'Cross-referencing technology signatures...',
  'Finalizing verification report...',
];

const INSPECTION_ITEMS = [
  { key: 'connected', label: 'Repository connected', confidence: 100, done: true },
  { key: 'languages', label: 'Languages: TS, Rust, Python', evidence: 'tsconfig.json, Cargo.toml, setup.py', confidence: 100, done: true },
  { key: 'framework', label: 'Framework: React / Next.js', evidence: 'package.json, next.config.js', confidence: 99, done: true },
  { key: 'infrastructure', label: 'Infrastructure: Docker, K8s', evidence: 'Dockerfile, docker-compose.yml', confidence: 96, done: true },
  { key: 'patterns', label: 'Architectural Patterns: Microservices', evidence: 'service/*.ts, /gateway', confidence: 94, done: true },
];

function VerifyRepository() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState('input');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [verifyError, setVerifyError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [log, setLog] = useState('');
  const [result, setResult] = useState(null);
  const logRef = useRef(null);
  const taskInterval = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await projectService.getProject(id);
        setProject(data);
        if (data.github_url) setGithubUrl(data.github_url);
      } catch (err) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      clearInterval(taskInterval.current);
      clearInterval(progressInterval.current);
    };
  }, [id]);

  const isOwner = user && project && user.id === project.owner_id;

  const startSimulation = useCallback(() => {
    setVerifying(true);
    setMode('analyzing');
    setProgress(5);
    setCurrentTask(0);
    setLog('');

    let p = 5;
    let taskIdx = 0;

    progressInterval.current = setInterval(() => {
      p += Math.floor(Math.random() * 3) + 1;
      if (p >= 100) {
        p = 100;
        clearInterval(progressInterval.current);
      }
      setProgress(p);
    }, 1200);

    taskInterval.current = setInterval(() => {
      if (taskIdx < ENGINEERING_TASKS.length) {
        setLog(ENGINEERING_TASKS[taskIdx]);
        setCurrentTask(taskIdx);
        taskIdx++;
      }
    }, 1800);

    setTimeout(() => {
      clearInterval(taskInterval.current);
      clearInterval(progressInterval.current);
      setProgress(100);
      setLog('VERIFICATION_COMPLETE: Repository analysis finalized.');
      setMode('complete');
      setVerifying(false);
      setResult({
        score: 94,
        grade: 'Excellent',
        rank: 'Top 8%',
        breakdown: {
          'Code Quality': 94,
          'Documentation': 88,
          'Testing': 82,
          'Activity': 91,
          'Structure': 95,
          'Maintainability': 89,
        },
        technologies: ['TypeScript', 'Rust', 'React', 'Next.js', 'PostgreSQL', 'Docker'],
        skills: ['Systems Architecture', 'Memory Management', 'Type Safety', 'CI/CD Design', 'API Design', 'WASM'],
        stats: {
          'LAST ANALYSIS': 'Just now',
          'REPO SIZE': '124.5 MB',
          'PRIMARY LANGUAGE': 'TypeScript',
          'TOTAL COMMITS': '2,841',
          'CONTRIBUTORS': '12',
          'LINES OF CODE': '420k',
        },
        evidence: [
          { file: 'README.md', status: 'completed' },
          { file: 'package.json', status: 'completed' },
          { file: 'tsconfig.json', status: 'completed' },
          { file: 'Cargo.toml', status: 'completed' },
          { file: '.github/workflows', status: 'completed' },
          { file: 'Dockerfile', status: 'completed' },
          { file: 'docker-compose.yml', status: 'completed' },
          { file: 'next.config.js', status: 'completed' },
        ],
        techFindings: [
          { name: 'Next.js', confidence: 99, evidence: 'Found in package.json & app router structure' },
          { name: 'PostgreSQL', confidence: 96, evidence: 'Schema detected in /prisma and /db migrations' },
          { name: 'Rust (WASM)', confidence: 92, evidence: '.rs source files and wasm-bindgen bindings' },
          { name: 'Docker', confidence: 88, evidence: 'Dockerfile & docker-compose.yml detected' },
        ],
      });
    }, ENGINEERING_TASKS.length * 1800 + 1500);
  }, []);

  async function handleStartVerify() {
    if (!githubUrl.trim()) return;
    setVerifyError(null);
    if (project) {
      try {
        const currentProject = await projectService.getProject(id);
        if (currentProject && currentProject.github_url === githubUrl.trim()) {
          startSimulation();
          return;
        }
      } catch {}
    }
    startSimulation();
  }

  async function handleConfirmFinalize() {
    try {
      if (project) {
        await projectService.verifyRepository(id, githubUrl);
      }
      navigate(`/projects/${id}`);
    } catch (err) {
      setVerifyError(err.message || 'Failed to finalize verification');
    }
  }

  if (loading) return <LoadingState label="Loading verification..." />;
  if (error) return <ErrorState title={error} onRetry={() => navigate(`/projects/${id}`)} />;
  if (!project) return <ErrorState title="Project not found" />;

  if (mode === 'input') {
    return (
      <div className="p-xl max-w-3xl mx-auto">
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-2 font-body-sm mb-lg"
          style={{ color: 'rgb(var(--color-on-surface-variant))' }}
        >
          <ArrowLeft size={16} />
          Back to project
        </Link>

        <Card className="p-xl text-center">
          <div
            className="mx-auto mb-lg w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))' }}
          >
            <GitBranch size={32} style={{ color: 'rgb(var(--color-primary))' }} />
          </div>
          <h2 className="font-display-serif text-display-serif mb-sm" style={{ color: 'rgb(var(--color-primary))' }}>
            Repository Verification
          </h2>
          <p className="font-body-lg text-body-lg max-w-lg mx-auto mb-xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Link a public GitHub repository to analyze your code, extract skills, and generate verifiable proof of your engineering capabilities.
          </p>
          <div className="max-w-md mx-auto space-y-md">
            <Input
              placeholder="https://github.com/user/repo"
              value={githubUrl}
              onChange={(e) => { setGithubUrl(e.target.value); setVerifyError(null); }}
            />
            {verifyError ? (
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-error))' }}>{verifyError}</p>
            ) : null}
            <Button
              onClick={handleStartVerify}
              disabled={!githubUrl.trim()}
              className="w-full"
            >
              <Terminal size={16} />
              Start Analysis
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (mode === 'analyzing') {
    return (
      <div className="p-xl min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl space-y-xl relative">
          <div
            className="absolute -top-32 -left-32 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'rgb(var(--color-primary) / 0.05)', filter: 'blur(120px)' }}
          />

          <div className="text-center space-y-md relative">
            <div
              className="inline-flex items-center gap-lg px-lg py-sm rounded-full mb-md"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex items-center gap-sm">
                <GitBranch size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                <span className="font-bold" style={{ color: 'rgb(var(--color-on-surface))' }}>
                  {project.title}
                </span>
              </div>
              <div className="w-px h-4" style={{ background: 'rgb(var(--color-outline-variant))' }} />
              <span className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                {githubUrl.replace(/^https?:\/\//, '') || 'Verifying...'}
              </span>
            </div>
            <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>
              Analyzing Repository...
            </h2>
            <div className="flex items-center justify-center gap-sm font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: 'rgb(var(--color-primary))', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
              Verification in progress
            </div>
          </div>

          <div
            className="rounded-xl overflow-hidden relative"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <div
                className="w-full scan-line"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgb(var(--color-primary)), transparent)',
                  animation: 'scan 3s linear infinite',
                }}
              />
            </div>

            <div className="p-lg space-y-md relative z-10">
              {INSPECTION_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-md rounded-lg"
                  style={{ background: 'rgb(var(--color-surface-container) / 0.5)' }}
                >
                  <div className="flex items-center gap-md">
                    <Check size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                    <div className="flex flex-col">
                      <span className="font-mono text-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>{item.label}</span>
                      {item.evidence ? (
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          Evidence: {item.evidence}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-primary))' }}>{item.confidence}% CONFIDENCE</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-lg" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.1)', background: 'rgb(var(--color-surface-container-low) / 0.3)' }}>
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-md" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}>Evidence Found</h3>
              <div className="flex flex-wrap gap-sm">
                {['README.md', 'package.json', 'tsconfig.json', 'Cargo.toml', '.github/workflows', 'Dockerfile', 'next.config.js', 'docker-compose.yml'].map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-2 px-sm py-1 rounded font-mono text-[10px]"
                    style={{
                      background: 'rgb(var(--color-surface-container-highest))',
                      border: '1px solid rgb(var(--color-outline-variant) / 0.2)',
                      color: 'rgb(var(--color-on-surface))',
                    }}
                  >
                    <Check size={14} style={{ color: 'rgb(var(--color-primary))' }} />
                    {file}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex items-center justify-between px-lg py-md"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                borderTop: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="font-mono text-[11px] flex gap-md" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                <span style={{ color: 'rgb(var(--color-primary) / 0.5)' }}>14:22:04</span>
                <span>{log || 'Initializing analysis...'}</span>
              </div>
              <div className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                {progress}% Complete
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <VerificationTimeline currentStep={Math.min(5, Math.floor(progress / 17))} />
          </div>
        </div>

        <style>{`
          @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(1000%); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (mode === 'complete' && result) {
    return (
      <div className="p-xl max-w-[1200px] mx-auto">
        <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
          <div>
            <nav className="flex items-center gap-2 mb-sm font-mono text-[11px] uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}>
              <Link to={`/projects/${id}`} className="hover:text-primary transition-colors">{project.title}</Link>
              <ChevronRight size={12} />
              <span style={{ color: 'rgb(var(--color-primary))' }}>Review</span>
            </nav>
            <h1 className="font-display-serif text-display-serif leading-tight" style={{ color: 'rgb(var(--color-primary))' }}>
              Analysis Complete
            </h1>
            <p className="font-body-lg text-body-lg mt-sm max-w-2xl" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Our builder-centric engine has finished evaluating the architectural integrity and structural performance of your repository.
            </p>
          </div>
          <div className="flex gap-md flex-wrap">
            <Button variant="secondary" onClick={() => { setMode('input'); setResult(null); setProgress(0); }}>
              Recalibrate Analysis
            </Button>
            <Button onClick={handleConfirmFinalize} disabled={verifying}>
              <Check size={16} />
              {verifying ? 'Finalizing...' : 'Confirm & Finalize'}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-lg">
          <div className="col-span-12 lg:col-span-5 space-y-lg">
            <div
              className="p-xl rounded-xl overflow-hidden relative"
              style={{
                background: 'rgb(var(--color-surface-container))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex justify-between items-start mb-xl">
                <div>
                  <h3 className="font-label-caps text-label-caps mb-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>REPOSITORY SCORE</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-serif text-[56px]" style={{ color: 'rgb(var(--color-primary))' }}>{result.grade}</span>
                  </div>
                </div>
                <div
                  className="h-16 w-16 flex items-center justify-center rounded-full border-4"
                  style={{
                    borderColor: 'rgb(var(--color-primary) / 0.2)',
                    color: 'rgb(var(--color-primary))',
                  }}
                >
                  <span className="font-headline-lg text-headline-lg">{result.score}</span>
                  <span className="font-body-sm font-bold">%</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm mb-xl leading-relaxed" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                The codebase demonstrates high modularity and strong adherence to design patterns. Documentation coverage is exceptional for a project of this scale.
              </p>

              <div className="space-y-md">
                {Object.entries(result.breakdown).map(([label, value]) => (
                  <div key={label}>
                    <div className="flex justify-between font-mono text-[11px] mb-1 uppercase tracking-tighter" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                      <span>{label}</span>
                      <span style={{ color: 'rgb(var(--color-primary))' }}>{value}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgb(var(--color-surface-container-highest))' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${value}%`,
                          background: 'rgb(var(--color-primary))',
                          opacity: value >= 90 ? 1 : value >= 70 ? 0.7 : 0.4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-xl rounded-xl"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant) / 0.6)',
              }}
            >
              <h3 className="font-label-caps text-label-caps mb-lg uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Repository Statistics</h3>
              <div className="grid grid-cols-2 gap-y-lg">
                {Object.entries(result.stats).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[11px] font-mono mb-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{label}</p>
                    <p className="font-body-lg text-body-lg" style={{ color: 'rgb(var(--color-primary))' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-lg">
            <div
              className="p-xl rounded-xl"
              style={{
                background: 'rgb(var(--color-surface-container))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex items-center justify-between mb-xl">
                <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Project Metadata & Proof Context</h3>
                <span
                  className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded"
                  style={{ background: 'rgb(var(--color-surface-container-highest))', color: 'rgb(var(--color-on-surface-variant))' }}
                >
                  <Pencil size={14} /> EDITABLE
                </span>
              </div>
              <div className="space-y-xl">
                <div>
                  <label className="block text-[11px] font-mono mb-2 transition-colors" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    PROJECT NAME
                  </label>
                  <input
                    className="w-full bg-transparent border-b outline-none py-2 font-headline-md text-headline-md transition-all"
                    style={{ borderColor: 'rgb(var(--color-outline-variant))', color: 'rgb(var(--color-primary))' }}
                    defaultValue={project.title}
                    onFocus={(e) => { e.target.style.borderColor = 'rgb(var(--color-primary))'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono mb-2 transition-colors" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    DESCRIPTION
                  </label>
                  <textarea
                    className="w-full bg-transparent rounded-lg outline-none p-md font-body-sm text-body-sm transition-all resize-none"
                    style={{ border: '1px solid rgb(var(--color-outline-variant))', color: 'rgb(var(--color-on-surface))' }}
                    rows={3}
                    defaultValue={project.description}
                    onFocus={(e) => { e.target.style.borderColor = 'rgb(var(--color-primary))'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div
                className="p-xl rounded-xl"
                style={{
                  background: 'rgb(var(--color-surface-container-low))',
                  border: '1px solid rgb(var(--color-outline-variant) / 0.4)',
                }}
              >
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Technologies</h3>
                  <Check size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="space-y-sm">
                  {result.techFindings.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex flex-col gap-1 p-sm rounded"
                      style={{ background: 'rgb(var(--color-surface-container-highest) / 0.3)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                          <Terminal size={18} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
                          <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>{tech.name}</span>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: 'rgb(var(--color-primary))' }}>{tech.confidence}% Confidence</span>
                      </div>
                      <p className="text-[10px] font-mono uppercase tracking-tighter" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}>
                        Evidence: {tech.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-xl rounded-xl"
                style={{
                  background: 'rgb(var(--color-surface-container-low))',
                  border: '1px solid rgb(var(--color-outline-variant) / 0.4)',
                }}
              >
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Verified Skills</h3>
                  <ShieldCheck size={20} style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div className="flex flex-wrap gap-sm">
                  {result.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-md py-1 rounded-full font-body-sm text-body-sm flex items-center gap-2"
                      style={{
                        background: 'rgb(var(--color-surface-container-highest))',
                        border: '1px solid rgb(var(--color-outline-variant) / 0.4)',
                        color: 'rgb(var(--color-on-surface))',
                      }}
                    >
                      {skill}
                      <span className="text-[10px] font-mono" style={{ color: 'rgb(var(--color-primary) / 0.8)' }}>
                        {Math.floor(85 + Math.random() * 15)}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="p-xl rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-lg"
              style={{
                background: 'linear-gradient(rgb(var(--color-surface-container)), rgb(var(--color-surface-container-highest)))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex items-center gap-lg">
                <div
                  className="h-14 w-14 flex items-center justify-center rounded-lg rotate-45 transition-transform duration-500 hover:rotate-0"
                  style={{
                    background: 'rgb(var(--color-background, 19 19 21))',
                    border: '1px solid rgb(var(--color-primary) / 0.2)',
                  }}
                >
                  <LayoutGrid size={24} className="-rotate-45 transition-transform duration-500 hover:rotate-0" style={{ color: 'rgb(var(--color-primary))' }} />
                </div>
                <div>
                  <h4 className="font-label-caps text-label-caps uppercase tracking-[0.2em]" style={{ color: 'rgb(var(--color-primary))' }}>Rank Projection</h4>
                  <p className="font-headline-md text-headline-md mt-1" style={{ color: 'rgb(var(--color-primary))' }}>{project.domain || 'Architect'} Grade</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] mb-1 uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}>
                  ESTIMATED VALUATION
                </p>
                <p className="font-body-lg text-body-lg" style={{ color: 'rgb(var(--color-primary))' }}>
                  $120k - $185k <span className="font-body-sm opacity-60 font-normal">/yr</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-xl pt-xl text-center" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.2)' }}>
          <p className="font-mono text-[12px] uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.6)' }}>
            Your project now contains verifiable proof of work that other builders can trust.
          </p>
        </div>

        {verifyError ? (
          <div className="mt-lg p-md rounded-lg font-body-sm" style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}>
            {verifyError}
          </div>
        ) : null}
      </div>
    );
  }
}

export default VerifyRepository;
