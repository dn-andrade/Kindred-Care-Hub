import { useState, Fragment } from 'react';
import { 
  format, 
  addDays, 
  addWeeks,
  addMonths, 
  addYears,
  startOfWeek, 
  startOfMonth,
  endOfMonth,
  startOfYear,
  isSameDay, 
  isSameMonth,
  isWeekend,
  eachDayOfInterval,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { mockAppointments } from '@/data/mockData';
import { Appointment } from '@/types/clinic';

type ViewMode = 'day' | 'week' | 'month' | 'year';

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

const statusDotColors: Record<Appointment['status'], string> = {
  scheduled: 'bg-info',
  'in-progress': 'bg-warning',
  completed: 'bg-success',
  canceled: 'bg-destructive',
  'no-show': 'bg-muted-foreground',
};

const reservedBlockStyle = 'bg-secondary/60 border-l-muted-foreground text-muted-foreground';

const months = [
  { value: 0, label: 'Janeiro' },
  { value: 1, label: 'Fevereiro' },
  { value: 2, label: 'Março' },
  { value: 3, label: 'Abril' },
  { value: 4, label: 'Maio' },
  { value: 5, label: 'Junho' },
  { value: 6, label: 'Julho' },
  { value: 7, label: 'Agosto' },
  { value: 8, label: 'Setembro' },
  { value: 9, label: 'Outubro' },
  { value: 10, label: 'Novembro' },
  { value: 11, label: 'Dezembro' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPrevious = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, -1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, -1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, -1));
        break;
      case 'year':
        setCurrentDate(prev => addYears(prev, -1));
        break;
    }
  };

  const goToNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(prev => addDays(prev, 1));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'year':
        setCurrentDate(prev => addYears(prev, 1));
        break;
    }
  };

  const getDateLabel = () => {
    switch (viewMode) {
      case 'day':
        return format(currentDate, "EEEE - d 'de' MMMM, yyyy", { locale: ptBR });
      case 'week':
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, "d 'de' MMMM", { locale: ptBR })} - ${format(weekEnd, "d 'de' MMMM, yyyy", { locale: ptBR })}`;
      case 'month':
        return format(currentDate, 'MMMM, yyyy', { locale: ptBR });
      case 'year':
        return format(currentDate, 'yyyy');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setIsDatePickerOpen(false);
    }
  };

  const handleMonthChange = (monthValue: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(monthValue));
    setCurrentDate(newDate);
  };

  const handleYearChange = (yearValue: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(yearValue));
    setCurrentDate(newDate);
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

  // Generate years for selector
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i);

  const renderDayView = () => {
    const appointments = getAppointmentsForDay(currentDate);
    const isWeekendDay = isWeekend(currentDate);
    
    return (
      <div className="relative">
        <div className="grid grid-cols-[80px_1fr]">
          {/* Time labels */}
          <div className="border-r border-border">
            {timeSlots.map((time) => (
              <div key={time} className="h-16 relative">
                <span className="absolute -top-2 right-3 text-xs text-muted-foreground font-medium">
                  {format(new Date(`2024-01-01T${time}`), 'h:mm a')}
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
                    'absolute left-2 right-2 rounded-lg border-l-4 p-3 overflow-hidden transition-shadow',
                    reserved ? reservedBlockStyle : statusColors[apt.status],
                    !reserved && 'hover:shadow-md cursor-pointer'
                  )}
                  style={{
                    top: `${getAppointmentPosition(apt.time)}px`,
                    height: `${Math.max((apt.duration / 60) * 64, 32)}px`,
                  }}
                >
                  {reserved ? (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{apt.notes}</span>
                    </div>
                  ) : (
                    <Link to={`/patients/${apt.patientId}`} className="block h-full">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                              {apt.patient.firstName[0]}
                            </div>
                            <p className="font-medium text-sm truncate">
                              {apt.patient.firstName} {apt.patient.lastName}
                            </p>
                          </div>
                          {apt.duration >= 30 && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {apt.type === 'consultation' ? 'Consulta' : 
                                 apt.type === 'follow-up' ? 'Retorno' : 
                                 apt.type === 'procedure' ? 'Procedimento' : 'Check-up'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {apt.time} - {format(
                              new Date(`2024-01-01T${apt.time}`).getTime() + apt.duration * 60000, 
                              'HH:mm'
                            )}
                          </span>
                        </div>
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
      <div className="min-w-[900px]">
        {/* Header row with day names */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border sticky top-0 bg-card z-10">
          <div className="p-2 text-xs text-muted-foreground font-medium flex flex-col items-center justify-center">
            <span>Horário</span>
          </div>
          {weekDays.map(day => {
            const isToday = isSameDay(day, new Date());
            const isWeekendDay = isWeekend(day);
            return (
              <div 
                key={day.toISOString()}
                className={cn(
                  'p-2 text-center border-l border-border',
                  isToday && 'bg-primary/5',
                  isWeekendDay && 'bg-muted/30'
                )}
              >
                <p className="text-xs text-muted-foreground uppercase font-medium">
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p className={cn(
                  'text-lg font-semibold mt-0.5',
                  isToday ? 'w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto' : 'text-foreground'
                )}>
                  {format(day, 'd')}
                </p>
              </div>
            );
          })}
        </div>

        {/* All day section */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border">
          <div className="p-2 text-xs text-muted-foreground font-medium text-center">
            Dia todo
          </div>
          {weekDays.map(day => (
            <div 
              key={`allday-${day.toISOString()}`}
              className={cn(
                'min-h-[40px] p-1 border-l border-border',
                isWeekend(day) && 'bg-muted/30'
              )}
            />
          ))}
        </div>

        {/* Time slots and appointments */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r border-border">
            {timeSlots.map((time) => (
              <div key={time} className="h-16 relative border-b border-border">
                <span className="absolute -top-2 left-2 text-xs text-muted-foreground font-medium">
                  {format(new Date(`2024-01-01T${time}`), 'h:mm a')}
                </span>
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {weekDays.map(day => {
            const isToday = isSameDay(day, new Date());
            const isWeekendDay = isWeekend(day);
            const dayAppointments = getAppointmentsForDay(day);
            
            return (
              <div 
                key={day.toISOString()}
                className={cn(
                  'relative border-l border-border',
                  isToday && 'bg-primary/5',
                  isWeekendDay && 'bg-muted/30'
                )}
              >
                {/* Grid lines */}
                {timeSlots.map((time) => (
                  <div key={time} className="h-16 border-b border-border" />
                ))}
                
                {/* Appointments positioned absolutely */}
                {!isWeekendDay && dayAppointments.map(apt => {
                  const reserved = isReservedBlock(apt);
                  return (
                    <div
                      key={apt.id}
                      className={cn(
                        'absolute left-0.5 right-0.5 rounded border-l-2 p-1 text-xs overflow-hidden',
                        reserved ? reservedBlockStyle : statusColors[apt.status],
                        !reserved && 'hover:shadow-sm cursor-pointer'
                      )}
                      style={{
                        top: `${getAppointmentPosition(apt.time)}px`,
                        height: `${Math.max((apt.duration / 60) * 64 - 2, 20)}px`,
                      }}
                    >
                      {reserved ? (
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate text-[10px]">{apt.notes}</span>
                        </div>
                      ) : (
                        <Link to={`/patients/${apt.patientId}`} className="block h-full">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-medium text-primary flex-shrink-0">
                              {apt.patient.firstName[0]}
                            </div>
                            <span className="font-medium truncate">
                              {apt.patient.firstName} {apt.patient.lastName[0]}.
                            </span>
                          </div>
                          <div className="text-[10px] opacity-70 mt-0.5">{apt.time}</div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = addDays(startOfWeek(addDays(monthEnd, 7), { weekStartsOn: 0 }), -1);
    
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="min-w-[800px]">
        {/* Day names header */}
        <div className="grid grid-cols-7 border-b border-border">
          {dayNames.map((name, idx) => (
            <div 
              key={name} 
              className={cn(
                'p-3 text-center text-sm font-medium text-muted-foreground',
                (idx === 0 || idx === 6) && 'text-muted-foreground/60'
              )}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 border-b border-border last:border-b-0">
            {week.map(day => {
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isWeekendDay = isWeekend(day);
              const dayAppointments = getAppointmentsForDay(day).filter(apt => !isReservedBlock(apt));
              const displayAppointments = dayAppointments.slice(0, 3);
              const remainingCount = dayAppointments.length - 3;

              return (
                <div 
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[120px] p-2 border-r border-border last:border-r-0',
                    !isCurrentMonth && 'bg-muted/20',
                    isWeekendDay && 'bg-muted/10'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className={cn(
                      'text-sm font-medium',
                      isToday && 'w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center',
                      !isCurrentMonth && 'text-muted-foreground',
                      !isToday && isCurrentMonth && 'text-foreground'
                    )}>
                      {format(day, 'd')}
                    </span>
                    {remainingCount > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        +{remainingCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-0.5">
                    {displayAppointments.map(apt => (
                      <Link 
                        key={apt.id}
                        to={`/patients/${apt.patientId}`}
                        className={cn(
                          'block text-xs p-1 rounded truncate',
                          statusColors[apt.status],
                          'border-l-2 hover:shadow-sm'
                        )}
                      >
                        <span className="font-medium">{apt.time}</span>
                        <span className="ml-1 opacity-80">{apt.patient.firstName}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {Array.from({ length: 12 }, (_, monthIdx) => {
          const monthDate = addMonths(yearStart, monthIdx);
          const monthStart = startOfMonth(monthDate);
          const monthEnd = endOfMonth(monthDate);
          const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
          const days = eachDayOfInterval({ 
            start: calendarStart, 
            end: addDays(calendarStart, 41) // 6 weeks
          });

          const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

          return (
            <div 
              key={monthIdx} 
              className="bg-card rounded-lg border border-border p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setCurrentDate(monthDate);
                setViewMode('month');
              }}
            >
              <h3 className="font-semibold text-sm mb-2 text-foreground">
                {format(monthDate, 'MMMM', { locale: ptBR })}
              </h3>
              
              {/* Day names */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {dayNames.map((name, idx) => (
                  <div key={idx} className="text-[10px] text-center text-muted-foreground">
                    {name}
                  </div>
                ))}
              </div>
              
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.slice(0, 42).map((day, dayIdx) => {
                  const isCurrentMonth = isSameMonth(day, monthDate);
                  const isToday = isSameDay(day, new Date());
                  const hasAppointments = getAppointmentsForDay(day).some(apt => !isReservedBlock(apt));
                  
                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        'h-5 w-5 text-[10px] flex items-center justify-center rounded-sm',
                        !isCurrentMonth && 'text-muted-foreground/40',
                        isToday && 'bg-primary text-primary-foreground font-bold',
                        hasAppointments && !isToday && 'bg-info/20 text-info font-medium',
                        isCurrentMonth && !isToday && !hasAppointments && 'text-foreground'
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Navigation arrows */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Clickable date label with popover */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-lg font-semibold text-foreground hover:bg-muted capitalize"
              >
                {getDateLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-card border border-border" align="start">
              <div className="space-y-4">
                {/* Month and Year selectors */}
                <div className="flex items-center gap-2">
                  <Select 
                    value={currentDate.getMonth().toString()} 
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={currentDate.getFullYear().toString()} 
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border max-h-[200px]">
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Mini calendar */}
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  className="rounded-md pointer-events-auto"
                  initialFocus
                />
                
                {/* Set button */}
                <Button 
                  className="w-full" 
                  onClick={() => setIsDatePickerOpen(false)}
                >
                  Definir
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setCurrentDate(new Date())}
          >
            <CalendarDays className="h-4 w-4" />
            Hoje
          </Button>
          
          <div className="flex items-center bg-muted rounded-lg p-1">
            {(['day', 'week', 'month', 'year'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="text-xs capitalize"
              >
                {mode === 'day' ? 'Dia' : 
                 mode === 'week' ? 'Semana' : 
                 mode === 'month' ? 'Mês' : 'Ano'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="wellness-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'year' && renderYearView()}
        </div>
      </div>

      {/* Legend */}
      {viewMode !== 'year' && (
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
      )}
    </div>
  );
}
