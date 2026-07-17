import { useEffect, useState } from 'react';
import { Check, Inbox } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import { notificationService } from '../../services/notificationService.js';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.listNotifications().then(setNotifications).catch(() => {});
  }, []);

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {}
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Updates on projects, invitations, and activity."
      />

      <section className="mt-10 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Card key={n.id} className={`p-5 ${!n.is_read ? 'border-primary/20 bg-accent-soft' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary">{n.title}</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-secondary">{n.message}</p>
                  <p className="mt-2 text-xs font-medium text-secondary">
                    {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.is_read && (
                  <Button variant="ghost" onClick={() => handleMarkRead(n.id)} className="shrink-0">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No notifications yet"
            description="Notifications about project invitations, connection requests, and updates will appear here."
            icon={<Inbox className="h-6 w-6" />}
          />
        )}
      </section>
    </div>
  );
}

export default Notifications;
