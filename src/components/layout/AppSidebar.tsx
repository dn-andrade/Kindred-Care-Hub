import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FolderOpen,
  Settings,
  ChevronLeft,
  Heart,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockNotifications } from '@/data/mockData';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Files', href: '/files', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border',
          collapsed ? 'justify-center' : 'justify-between'
        )}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display text-sm font-semibold text-sidebar-foreground">
                  MediCare
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Wellness Clinic
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse button when collapsed */}
        {collapsed && (
          <div className="p-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10 text-muted-foreground hover:text-sidebar-foreground"
              onClick={() => setCollapsed(false)}
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}

        {/* Notifications indicator */}
        <div className={cn(
          'border-t border-sidebar-border p-3',
          collapsed ? 'flex justify-center' : ''
        )}>
          <NavLink
            to="/settings?tab=notifications"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'text-sidebar-foreground hover:bg-sidebar-accent/50',
              collapsed && 'px-0 justify-center'
            )}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-wellness-coral text-[10px] font-semibold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            {!collapsed && <span>Notifications</span>}
          </NavLink>
        </div>

        {/* User profile */}
        <div className={cn(
          'border-t border-sidebar-border p-3',
          collapsed ? 'flex justify-center' : ''
        )}>
          <div className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5',
            collapsed && 'px-0 justify-center'
          )}>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">AF</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-sidebar-foreground truncate">
                  Dr. Amanda Foster
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  Primary Care
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
