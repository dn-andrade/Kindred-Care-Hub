import { 
  Calendar, 
  Users, 
  FileText, 
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { StatCard } from '@/components/dashboard/StatCard';
import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { NotificationItem } from '@/components/dashboard/NotificationItem';
import { RecentPatientRow } from '@/components/dashboard/RecentPatientRow';
import { Button } from '@/components/ui/button';
import { mockAppointments, mockPatients, mockNotifications } from '@/data/mockData';

export default function Dashboard() {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  const todaysAppointments = mockAppointments
    .filter(apt => apt.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingAppointments = mockAppointments
    .filter(apt => apt.date > todayStr)
    .slice(0, 3);

  const recentPatients = [...mockPatients]
    .sort((a, b) => (b.lastVisit || '').localeCompare(a.lastVisit || ''))
    .slice(0, 4);

  const recentNotifications = mockNotifications.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Good morning, Dr. Foster
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/calendar">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/patients">
              <Users className="h-4 w-4 mr-2" />
              All Patients
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments.length}
          icon={Calendar}
          change={`${todaysAppointments.filter(a => a.status === 'completed').length} completed`}
          changeType="neutral"
        />
        <StatCard
          title="Total Patients"
          value={mockPatients.length}
          icon={Users}
          change="+2 this week"
          changeType="positive"
        />
        <StatCard
          title="Pending Labs"
          value={3}
          icon={Activity}
          change="2 need review"
          changeType="neutral"
        />
        <StatCard
          title="New Files"
          value={5}
          icon={FileText}
          change="Last 7 days"
          changeType="neutral"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 wellness-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Today's Schedule</h2>
            </div>
            <Link 
              to="/calendar" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="p-4 space-y-3">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="wellness-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Notifications</h2>
            <span className="text-xs text-muted-foreground">
              {mockNotifications.filter(n => !n.read).length} unread
            </span>
          </div>
          
          <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
            {recentNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="wellness-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Recent Patients</h2>
            <Link 
              to="/patients" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="p-2">
            {recentPatients.map(patient => (
              <RecentPatientRow key={patient.id} patient={patient} />
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="wellness-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Upcoming Appointments</h2>
            <Link 
              to="/calendar" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="p-4 space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
