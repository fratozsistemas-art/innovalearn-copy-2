import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import NotificationCenter from "../notifications/NotificationCenter";

// USANDO REACT QUERY
import { useCurrentUser } from "@/components/hooks/useUser";
import { useUnreadNotifications } from "@/components/hooks/useNotifications";

export default function NotificationBell() {
  const { data: user } = useCurrentUser();
  
  // Desabilitar notificações automáticas se não for crítico
  const { data: unreadNotifications = [], isLoading, error } = useUnreadNotifications(user?.email);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Se houver erro de rate limit OU se estiver carregando, mostrar sino sem badge
  if (error?.message?.includes('Rate limit') || isLoading) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={handleOpen}
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </Button>

        <NotificationCenter isOpen={isOpen} onClose={handleClose} />
      </>
    );
  }

  const unreadCount = unreadNotifications.length;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleOpen}
      >
        <Bell className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 border-0 text-xs"
            style={{ backgroundColor: 'var(--error)', color: 'var(--background)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationCenter isOpen={isOpen} onClose={handleClose} />
    </>
  );
}