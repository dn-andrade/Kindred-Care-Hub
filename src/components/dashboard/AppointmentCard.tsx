import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/clinic';

interface AppointmentCardProps {
  appointment: Appointment;
}

const statusStyles = {
  scheduled: 'bg-info/10 text-info',
  'in-progress': 'bg-warning/10 text-warning',
  completed: 'bg-success/10 text-success',
  canceled: 'bg-destructive/10 text-destructive',
  'no-show': 'bg-muted text-muted-foreground',
};

const typeLabels = {
  consultation: 'Consultation',
  'follow-up': 'Follow-up',
  procedure: 'Procedure',
  'check-up': 'Check-up',
};

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Link 
      to={`/patients/${appointment.patientId}`}
      className="wellness-card p-4 block hover:shadow-wellness-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-primary">
            {appointment.patient.firstName[0]}{appointment.patient.lastName[0]}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-foreground truncate">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </h4>
              <p className="text-sm text-muted-foreground">
                {typeLabels[appointment.type]}
              </p>
            </div>
            <span className={cn(
              'status-badge flex-shrink-0',
              statusStyles[appointment.status]
            )}>
              {appointment.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
              <span className="text-border">•</span>
              <span>{appointment.duration} min</span>
            </div>
          </div>

          {appointment.notes && (
            <p className="text-sm text-muted-foreground mt-2 truncate">
              {appointment.notes}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
