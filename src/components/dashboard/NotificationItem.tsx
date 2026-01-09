import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  FlaskConical, 
  MessageSquare, 
  Bell,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/clinic';
import { format, parseISO } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
}

const iconMap: Record<Notification['type'], LucideIcon> = {
  appointment: Calendar,
  file: FileText,
  lab: FlaskConical,
  message: MessageSquare,
  reminder: Bell,
};

const colorMap: Record<Notification['type'], string> = {
  appointment: 'text-info bg-info/10',
  file: 'text-primary bg-primary/10',
  lab: 'text-wellness-teal bg-wellness-teal/10',
  message: 'text-accent bg-accent/10',
  reminder: 'text-warning bg-warning/10',
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const colorClass = colorMap[notification.type];
  
  const content = (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg transition-colors',
      !notification.read && 'bg-primary/5',
      notification.actionUrl && 'hover:bg-muted cursor-pointer'
    )}>
      <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'text-sm truncate',
            notification.read ? 'font-medium text-foreground' : 'font-semibold text-foreground'
          )}>
            {notification.title}
          </h4>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {format(parseISO(notification.date), 'MMM d, h:mm a')}
        </p>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return <Link to={notification.actionUrl}>{content}</Link>;
  }

  return content;
}
