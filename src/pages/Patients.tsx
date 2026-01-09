import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Calendar } from 'lucide-react';
import { format, parseISO, differenceInYears } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockPatients } from '@/data/mockData';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastVisit' | 'upcoming'>('name');

  const filteredPatients = useMemo(() => {
    let patients = [...mockPatients];
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      patients = patients.filter(p => 
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.conditions.some(c => c.toLowerCase().includes(query))
      );
    }

    // Sort
    patients.sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      } else if (sortBy === 'lastVisit') {
        return (b.lastVisit || '').localeCompare(a.lastVisit || '');
      } else {
        return (a.nextAppointment || 'z').localeCompare(b.nextAppointment || 'z');
      }
    });

    return patients;
  }, [searchQuery, sortBy]);

  const getAge = (dob: string) => {
    return differenceInYears(new Date(), parseISO(dob));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground mt-1">
            {mockPatients.length} total patients
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients by name, email, or condition..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={sortBy === 'name' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('name')}
              className="text-xs"
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'lastVisit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('lastVisit')}
              className="text-xs"
            >
              Last Visit
            </Button>
            <Button
              variant={sortBy === 'upcoming' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('upcoming')}
              className="text-xs"
            >
              Upcoming
            </Button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="wellness-card overflow-hidden">
        <div className="divide-y divide-border">
          {filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
            >
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-primary">
                  {patient.firstName[0]}{patient.lastName[0]}
                </span>
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    • {getAge(patient.dateOfBirth)} yrs
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {patient.conditions.slice(0, 3).map((condition, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
                    >
                      {condition}
                    </span>
                  ))}
                  {patient.conditions.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{patient.conditions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Visit Info */}
              <div className="hidden md:flex items-center gap-8 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="text-sm font-medium text-foreground">
                    {patient.lastVisit 
                      ? format(parseISO(patient.lastVisit), 'MMM d, yyyy')
                      : '—'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Next Appointment</p>
                  <div className="flex items-center gap-1.5">
                    {patient.nextAppointment ? (
                      <>
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <p className="text-sm font-medium text-primary">
                          {format(parseISO(patient.nextAppointment), 'MMM d')}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
