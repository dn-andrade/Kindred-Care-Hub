import { useState, Fragment } from 'react';
import { format, addDays, startOfWeek, isSameDay, parseISO, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockAppointments } from '@/data/mockData';
import { Appointment } from '@/types/clinic';

type ViewMode = 'day' | 'week';

// 8 hours workday: 8:00 - 16:00
const timeSlots = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const statusColors: Record<Appointment['status'], string> = {
  scheduled: 'bg-info/20 border-l-info text-foreground',
  'in-progress': 'bg-warning/20 border-l-warning text-foreground',
  completed: 'bg-success/20 border-l-success text-foreground',
  canceled: 'bg-destructive/20 border-l-destructive text-foreground',
  'no-show': 'bg-muted border-l-muted-foreground text-muted-foreground',
};

const reservedBlockStyle = 'bg-secondary/60 border-l-muted-foreground text-muted-foreground';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
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
    const hourHeight = 64;
    return ((hours - startHour) * hourHeight) + (minutes / 60 * hourHeight);
  };

  const isReservedBlock = (apt: Appointment) => apt.patientId === 'reserved';

  const renderDayView = () => {
    const appointments = getAppointmentsForDay(currentDate);
    const isWeekendDay = isWeekend(currentDate);
    
    return (
      <div className="relative">
        <div className="grid grid-cols-[72px_1fr]">
          {/* Time labels */}
          <div className="border-r border-border">
            {timeSlots.map((time) => (
              <div key={time} className="h-16 relative">
                <span className="absolute -top-2 right-3 text-xs text-muted-foreground font-medium">
                  {format(new Date(`2024-01-01T${time}`), 'HH:mm')}
                </span>
              </div>
            ))}
          </div>
          
          {/* Appointments column */}
          <div className={cn('relative', isWeekendDay && 'bg-muted/30')}>
            {/* Grid lines */}
            {timeSlots.map((time) => (
              <div key={time} className="h-16 border-b border-border" />
            ))}
            
            {/* Weekend overlay */}
            {isWeekendDay && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Sem expediente</p>
              </div>
            )}
            
            {/* Appointments */}
            {!isWeekendDay && appointments.map(apt => {
              const reserved = isReservedBlock(apt);
              return (
                <div
                  key={apt.id}
                  className={cn(
                    'absolute left-1 right-1 rounded-lg border-l-4 p-2 overflow-hidden transition-shadow',
                    reserved ? reservedBlockStyle : statusColors[apt.status],
                    !reserved && 'hover:shadow-md cursor-pointer'
                  )}
                  style={{
                    top: `${getAppointmentPosition(apt.time)}px`,
                    height: `${Math.max((apt.duration / 60) * 64, 28)}px`,
                  }}
                >
                  {reserved ? (
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{apt.notes}</span>
                    </div>
                  ) : (
                    <Link to={`/patients/${apt.patientId}`} className="block h-full">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {apt.patient.firstName} {apt.patient.lastName}
                          </p>
                          {apt.duration >= 30 && (
                            <p className="text-xs opacity-70 truncate">{apt.type}</p>
                          )}
                        </div>
                        <span className="text-xs opacity-70 flex-shrink-0">{apt.time}</span>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="grid grid-cols-[72px_repeat(7,1fr)] min-w-[800px]">
        {/* Header row */}
        <div className="border-b border-border h-14 sticky top-0 bg-card z-10" />
        {weekDays.map(day => {
          const isToday = isSameDay(day, new Date());
          const isWeekendDay = isWeekend(day);
          return (
            <div 
              key={day.toISOString()}
              className={cn(
                'border-b border-l border-border p-2 text-center sticky top-0 bg-card z-10',
                isToday && 'bg-primary/5',
                isWeekendDay && 'bg-muted/50'
              )}
            >
              <p className="text-xs text-muted-foreground uppercase font-medium">
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <p className={cn(
                'text-lg font-semibold',
                isToday ? 'text-primary' : 'text-foreground'
              )}>
                {format(day, 'd')}
              </p>
            </div>
          );
        })}

        {/* Time slots and appointments */}
        {timeSlots.map((time) => (
          <Fragment key={time}>
            <div className="h-16 relative border-b border-border">
              <span className="absolute -top-2 right-2 text-xs text-muted-foreground font-medium">
                {format(new Date(`2024-01-01T${time}`), 'HH:mm')}
              </span>
            </div>
            {weekDays.map(day => {
              const isToday = isSameDay(day, new Date());
              const isWeekendDay = isWeekend(day);
              const dayAppointments = getAppointmentsForDay(day).filter(apt => {
                const aptHour = parseInt(apt.time.split(':')[0]);
                const slotHour = parseInt(time.split(':')[0]);
                return aptHour === slotHour;
              });
              
              return (
                <div 
                  key={`${day.toISOString()}-${time}`}
                  className={cn(
                    'h-16 border-b border-l border-border p-0.5 relative',
                    isToday && 'bg-primary/5',
                    isWeekendDay && 'bg-muted/30'
                  )}
                >
                  {dayAppointments.map(apt => {
                    const reserved = isReservedBlock(apt);
                    return (
                      <div
                        key={apt.id}
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs border-l-2 mb-0.5 truncate',
                          reserved ? reservedBlockStyle : statusColors[apt.status],
                          !reserved && 'hover:shadow-sm cursor-pointer'
                        )}
                      >
                        {reserved ? (
                          <div className="flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5 flex-shrink-0" />
                            <span className="truncate text-[10px]">{apt.notes}</span>
                          </div>
                        ) : (
                          <Link to={`/patients/${apt.patientId}`} className="block">
                            <span className="font-medium block truncate text-[11px]">
                              {apt.patient.firstName} {apt.patient.lastName[0]}.
                            </span>
                            <span className="opacity-70 text-[10px]">{apt.time}</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar consultas e atendimentos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'day' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="text-xs"
            >
              Dia
            </Button>
            <Button
              variant={viewMode === 'week' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="text-xs"
            >
              Semana
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
              ? format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
              : `${format(weekStart, 'd MMM', { locale: ptBR })} - ${format(addDays(weekStart, 6), "d MMM 'de' yyyy", { locale: ptBR })}`
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
        <span className="text-muted-foreground font-medium">Legenda:</span>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-info" />
          <span>Agendado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-warning" />
          <span>Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span>Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span>Cancelado</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-3 w-3 text-muted-foreground" />
          <span>Reservado</span>
        </div>
      </div>
    </div>
  );
}
