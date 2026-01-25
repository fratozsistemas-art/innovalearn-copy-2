import React, { useState, useEffect } from "react";
import { Notification } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  BellOff, 
  CheckCircle2, 
  AlertTriangle,
  Trophy,
  BookOpen,
  Calendar,
  TrendingUp,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    const userData = await User.me();
    setUser(userData);

    const notifs = await Notification.filter(
      { user_email: userData.email },
      '-created_date',
      50
    );
    setNotifications(notifs);
    setLoading(false);
  };

  const markAsRead = async (notificationId) => {
    await Notification.update(notificationId, { read: true });
    await loadNotifications();
  };

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.read);
    await Promise.all(unreadNotifs.map(n => Notification.update(n.id, { read: true })));
    await loadNotifications();
  };

  const deleteNotification = async (notificationId) => {
    await Notification.delete(notificationId);
    await loadNotifications();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      assignment_due: Calendar,
      course_recommendation: BookOpen,
      achievement: Trophy,
      at_risk_alert: AlertTriangle,
      new_content: Bell,
      weekly_summary: TrendingUp,
      parent_update: Bell
    };
    return icons[type] || Bell;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'var(--info)',
      medium: 'var(--warning)',
      high: 'var(--accent-orange)',
      urgent: 'var(--error)'
    };
    return colors[priority] || colors.medium;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="h-full rounded-none border-none flex flex-col">
            <CardHeader 
              className="border-b flex-shrink-0"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" style={{ color: 'var(--background)' }} />
                  <div>
                    <CardTitle className="font-heading" style={{ color: 'var(--background)' }}>
                      Notificações
                    </CardTitle>
                    {unreadCount > 0 && (
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  style={{ color: 'var(--background)' }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="mt-2"
                  style={{ color: 'var(--background)' }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
            </CardHeader>

            <ScrollArea className="flex-1">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    Carregando notificações...
                  </div>
                ) : notifications.length > 0 ? (
                  <div>
                    {notifications.map((notif, idx) => {
                      const NotifIcon = getNotificationIcon(notif.type);
                      const priorityColor = getPriorityColor(notif.priority);

                      return (
                        <div
                          key={notif.id}
                          className={`p-4 border-b hover:bg-opacity-50 transition-all cursor-pointer ${
                            !notif.read ? 'bg-blue-50' : ''
                          }`}
                          style={{ borderColor: 'var(--neutral-medium)' }}
                          onClick={() => {
                            if (!notif.read) markAsRead(notif.id);
                            if (notif.action_url) window.location.href = notif.action_url;
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${priorityColor}20` }}
                            >
                              <NotifIcon className="w-5 h-5" style={{ color: priorityColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {notif.title}
                                </h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                  }}
                                >
                                  <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                                </Button>
                              </div>
                              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {formatDistanceToNow(new Date(notif.created_date), { 
                                    addSuffix: true, 
                                    locale: ptBR 
                                  })}
                                </span>
                                {!notif.read && (
                                  <Badge 
                                    className="border-0 text-xs"
                                    style={{ backgroundColor: 'var(--primary-teal)', color: 'var(--background)' }}
                                  >
                                    Nova
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <BellOff className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--neutral-medium)' }} />
                    <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Nenhuma notificação
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Você está em dia! Volte mais tarde para verificar novas atualizações.
                    </p>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}