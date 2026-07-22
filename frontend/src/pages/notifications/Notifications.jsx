import { Check, Bell, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';
import { notificationService } from '../../services/notificationService.js';
import { contactService } from '../../services/contactService.js';
import ContactSharedModal from '../contacts/ContactSharedModal.jsx';

function formatDate(raw) {
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function normalizeNotifications(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showContactShared, setShowContactShared] = useState(false);
  const [sharedContactInfo, setSharedContactInfo] = useState(null);

  useEffect(() => {
    notificationService.listNotifications()
      .then((data) => setNotifications(normalizeNotifications(data)))
      .catch((err) => console.warn('[notifications] list failed:', err));
    contactService.getReceivedRequests()
      .then((data) => setReceivedRequests(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      console.warn('[notifications] mark read failed:', err);
    }
  }

  function findRequestIdForNotification(n) {
    const received = receivedRequests.find((r) => {
      const senderName = r.sender?.name || '';
      return n.message?.includes(senderName) || n.title?.includes('Contact Request');
    });
    return received?.id || null;
  }

  async function handleApprove(n) {
    const requestId = findRequestIdForNotification(n);
    if (!requestId) return;
    try {
      await contactService.approveRequest(requestId);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)));
    } catch (err) {
      console.warn('[notifications] approve failed:', err);
    }
  }

  async function handleDecline(n) {
    const requestId = findRequestIdForNotification(n);
    if (!requestId) return;
    try {
      await contactService.declineRequest(requestId);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)));
    } catch (err) {
      console.warn('[notifications] decline failed:', err);
    }
  }

  async function handleViewContact(n) {
    const targetId = n.reference_data?.target_id;
    if (!targetId) return;
    try {
      const status = await contactService.getRequestStatus(targetId);
      if (status?.contact_email || status?.whatsapp_number) {
        setSharedContactInfo({
          contact_email: status.contact_email,
          whatsapp_number: status.whatsapp_number,
          approved_at: status.approved_at,
        });
        setShowContactShared(true);
      }
    } catch (err) {
      console.warn('[notifications] fetch shared contact failed:', err);
    }
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
                  {formatDate(n.created_at)}
                </p>
                {n.type === 'CONTACT_REQUEST' ? (
                  <div className="flex gap-md mt-md">
                    <Button variant="primary" onClick={() => handleApprove(n)} disabled={n.is_read}>
                      <ThumbsUp size={14} /> Approve
                    </Button>
                    <Button variant="secondary" onClick={() => handleDecline(n)} disabled={n.is_read}>
                      <ThumbsDown size={14} /> Decline
                    </Button>
                  </div>
                ) : null}
                {n.type === 'CONTACT_APPROVED' ? (
                  <div className="mt-md">
                    <Button variant="primary" onClick={() => handleViewContact(n)} disabled={!n.reference_data?.target_id}>
                      <Eye size={14} /> View Contact
                    </Button>
                  </div>
                ) : null}
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
            icon={Bell}
            title="No Notifications Yet"
            description="You're all caught up."
          />
        )}
      </section>

      <ContactSharedModal
        isOpen={showContactShared}
        onClose={() => setShowContactShared(false)}
        contactInfo={sharedContactInfo}
      />
    </div>
  );
}

export default Notifications;
