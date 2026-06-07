import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { domains } from '../../data/mockData.js';

function Domains() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Discover"
        title="Domains"
        description="Browse builder areas across campus and find people through what they are making."
      />

      <section className="mt-10 grid grid-cols-3 gap-5">
        {domains.map((domain) => (
          <Card key={domain.id} className="p-6">
            <h2 className="text-xl font-black text-primary">{domain.name}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-accent-soft p-4">
                <p className="font-black text-primary">{domain.builders}</p>
                <p className="mt-1 font-bold text-secondary">Builders</p>
              </div>
              <div className="rounded-lg bg-accent-soft p-4">
                <p className="font-black text-primary">{domain.projects}</p>
                <p className="mt-1 font-bold text-secondary">Projects</p>
              </div>
            </div>
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
