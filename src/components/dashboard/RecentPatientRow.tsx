import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Patient } from '@/types/clinic';

interface RecentPatientRowProps {
  patient: Patient;
}

export function RecentPatientRow({ patient }: RecentPatientRowProps) {
  return (
    <Link 
      to={`/patients/${patient.id}`}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
    >
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-primary">
          {patient.firstName[0]}{patient.lastName[0]}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">
          {patient.firstName} {patient.lastName}
        </h4>
        <p className="text-sm text-muted-foreground truncate">
          {patient.conditions.slice(0, 2).join(', ') || 'No conditions listed'}
        </p>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-foreground">
          {patient.lastVisit ? format(parseISO(patient.lastVisit), 'MMM d') : '—'}
        </p>
        <p className="text-xs text-muted-foreground">Last visit</p>
      </div>
    </Link>
  );
}
