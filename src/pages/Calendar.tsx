import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockAppointments } from '@/data/mockData';

type ViewMode = 'day' | 'week';

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // 8 AM to 7 PM
  return `${hour.toString().padStart(2, '0')}:00`;
});

const statusColors = {
  scheduled: 'bg-info/20 border-info text-info',
  'in-progress': 'bg-warning/20 border-warning text-warning',
  completed: 'bg-success/20 border-success text-success',
  canceled: 'bg-destructive/20 border-destructive text-destructive',
  'no-show': 'bg-muted border-muted-foreground text-muted-foreground',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPrevious = () => {
    setCurrentDate(prev => addDays(prev, viewMode === 'day' ? -1 : -7));
  };

  const goToNext = () => {
    setCurrentDate(prev => addDays(prev, viewMode === 'day' ? 1 : 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mockAppointments.filter(apt => apt.date === dateStr);
  };

  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startHour = 8;
    const hourHeight = 80; // px per hour
    return ((hours - startHour) * hourHeight) + (minutes / 60 * hourHeight);
  };

  const renderDayView = () => {
    const appointments = getAppointmentsForDay(currentDate);
    
    return (
      <div className="relative">
        {/* Time slots */}
        <div className="grid grid-cols-[80px_1fr]">
          {/* Time labels */}
          <div className="border-r border-border">
            {timeSlots.map((time, index) => (
              <div 
                key={time} 
                className="h-20 relative"
              >
                <span className="absolute -top-2.5 right-3 text-xs text-muted-foreground">
                  {format(new Date(`2024-01-01T${time}`), 'h a')}
                </span>
              </div>
            ))}
          </div>
          
          {/* Appointments column */}
          <div className="relative">
            {/* Grid lines */}
            {timeSlots.map((time, index) => (
              <div 
                key={time}
                className="h-20 border-b border-border"
              />
            ))}
            
            {/* Appointments */}
            {appointments.map(apt => (
              <Link
                key={apt.id}
                to={`/patients/${apt.patientId}`}
                className={cn(
                  'absolute left-2 right-2 rounded-lg border-l-4 p-3 transition-shadow hover:shadow-md',
                  statusColors[apt.status]
                )}
                style={{
                  top: `${getAppointmentPosition(apt.time)}px`,
                  height: `${(apt.duration / 60) * 80}px`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {apt.patient.firstName} {apt.patient.lastName}
                    </p>
                    <p className="text-xs mt-0.5 opacity-80">{apt.type}</p>
                  </div>
                  <span className="text-xs opacity-80">
                    {apt.time}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="grid grid-cols-[80px_repeat(7,1fr)]">
        {/* Header */}
        <div className="border-b border-border h-16" />
        {weekDays.map(day => {
          const isToday = isSameDay(day, new Date());
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                'border-b border-l border-border p-3 text-center',
                isToday && 'bg-primary/5'
              )}
            >
              <p className="text-xs text-muted-foreground uppercase">
                {format(day, 'EEE')}
              </p>
              <p className={cn(
                'text-lg font-semibold mt-0.5',
                isToday ? 'text-primary' : 'text-foreground'
              )}>
                {format(day, 'd')}
              </p>
            </div>
          );
        })}

        {/* Time slots and appointments */}
        {timeSlots.map((time, timeIndex) => (
          <>
            <div key={`label-${time}`} className="h-20 relative border-b border-border">
              <span className="absolute -top-2.5 right-3 text-xs text-muted-foreground">
                {format(new Date(`2024-01-01T${time}`), 'h a')}
              </span>
            </div>
            {weekDays.map(day => {
              const isToday = isSameDay(day, new Date());
              const dayAppointments = getAppointmentsForDay(day).filter(apt => {
                const aptHour = parseInt(apt.time.split(':')[0]);
                const slotHour = parseInt(time.split(':')[0]);
                return aptHour === slotHour;
              });
              
              return (
                <div 
                  key={`${day.toISOString()}-${time}`}
                  className={cn(
                    'h-20 border-b border-l border-border p-1 relative',
                    isToday && 'bg-primary/5'
                  )}
                >
                  {dayAppointments.map(apt => (
                    <Link
                      key={apt.id}
                      to={`/patients/${apt.patientId}`}
                      className={cn(
                        'block rounded p-1.5 text-xs border-l-2 mb-1 transition-shadow hover:shadow-sm truncate',
                        statusColors[apt.status]
                      )}
                    >
                      <span className="font-medium block truncate">
                        {apt.patient.firstName} {apt.patient.lastName[0]}.
                      </span>
                      <span className="opacity-80">{apt.time}</span>
                    </Link>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage appointments and consultations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'day' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="text-xs"
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="text-xs"
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {viewMode === 'day' 
              ? format(currentDate, 'EEEE, MMMM d, yyyy')
              : `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`
            }
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="wellness-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          {viewMode === 'day' ? renderDayView() : renderWeekView()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Status:</span>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-info" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-warning" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span>Canceled</span>
        </div>
      </div>
    </div>
  );
}
