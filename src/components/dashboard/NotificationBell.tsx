import React, { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications as mockNotifications } from "@/data/mockData";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date('2025-02-05T15:00:00');
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'milestone': return '🎉';
      case 'activity': return '📚';
      case 'summary': return '📊';
      case 'update': return '✨';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-primary-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-80 bg-card rounded-2xl shadow-float z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-foreground">Notifications</h3>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <motion.button
                    key={notification.id}
                    whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                    onClick={() => markAsRead(notification.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      !notification.read ? 'bg-sprout-green-light' : ''
                    }`}
                  >
                    <span className="text-xl">{getIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : ''} text-foreground`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="p-3 border-t border-border">
                <button className="w-full text-center text-sm text-primary font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;