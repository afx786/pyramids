import { useEffect, useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { bookmarkService } from '../../services/bookmarkService.js';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    bookmarkService.listBookmarks().then(setBookmarks).catch(() => {});
  }, []);

  async function handleRemove(id) {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Saved"
        title="Bookmarks"
        description="Projects, hackathons, and opportunities you've saved."
      />

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {bookmarks.length > 0 ? (
          bookmarks.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <SkillTag>{b.item_type}</SkillTag>
                  <p className="mt-3 text-sm font-semibold text-primary">Item #{b.item_id}</p>
                  <p className="mt-1 text-xs text-secondary">
                    Saved {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => handleRemove(b.id)}>
                  <Trash2 className="h-4 w-4" style={{ color: 'rgb(var(--color-error))' }} />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No bookmarks yet"
              description="Save projects and opportunities to revisit them later."
              icon={<Bookmark className="h-6 w-6" />}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Bookmarks;
