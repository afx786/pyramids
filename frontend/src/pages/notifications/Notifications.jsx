import { Check, Inbox, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="p-xl max-w-4xl mx-auto">
      <header className="mb-xl">
        <div className="flex items-center gap-md">
          <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Notifications</h2>
          {unreadCount > 0 ? (
            <span
              className="px-md py-xs rounded-full font-label-caps text-label-caps"
              style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
            >
              {unreadCount} new
            </span>
          ) : null}
        </div>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Updates on projects, invitations, and activity.
        </p>
      </header>

      <section className="space-y-md">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-lg rounded-xl flex items-start justify-between gap-lg transition-all"
              style={{
                background: n.is_read ? 'rgb(var(--color-surface-container-low))' : 'rgb(var(--color-surface-container))',
                border: n.is_read
                  ? '1px solid rgb(var(--color-outline-variant))'
                  : '1px solid rgb(var(--color-primary) / 0.2)',
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-sm mb-xs">
                  {!n.is_read ? (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: 'rgb(var(--color-primary))' }}
                    />
                  ) : null}
                  <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{n.title}</p>
                </div>
                <p className="font-body-sm leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{n.message}</p>
                <p className="mt-sm font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {!n.is_read ? (
                <Button variant="ghost" onClick={() => handleMarkRead(n.id)} className="shrink-0">
                  <Check size={16} />
                </Button>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyState
            title="No notifications yet"
            description="Notifications about project invitations, connection requests, and updates will appear here."
            icon={Bell}
          />
        )}
      </section>
    </div>
  );
}

export default Notifications;
