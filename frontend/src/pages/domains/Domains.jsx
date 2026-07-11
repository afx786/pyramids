import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';

const DOMAINS = [
  { id: 1, name: 'AI / Machine Learning', skills: ['Python', 'ML', 'Data'] },
  { id: 2, name: 'Frontend Engineering', skills: ['React', 'CSS', 'UX'] },
  { id: 3, name: 'Backend Systems', skills: ['Node', 'APIs', 'Databases'] },
  { id: 4, name: 'Product Design', skills: ['Figma', 'Research', 'UI'] },
  { id: 5, name: 'Cybersecurity', skills: ['Linux', 'Network', 'Audit'] },
  { id: 6, name: 'Open Source', skills: ['Git', 'Docs', 'Review'] },
];

function Domains() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Discover"
        title="Domains"
        description="Browse builder areas across campus and find people through what they are making."
      />

      <section className="mt-10 grid grid-cols-3 gap-5">
        {DOMAINS.map((domain) => (
          <Card key={domain.id} className="p-6">
            <h2 className="text-xl font-black text-primary">{domain.name}</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {domain.skills.map((skill) => (
                <SkillTag key={skill}>{skill}</SkillTag>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default Domains;
