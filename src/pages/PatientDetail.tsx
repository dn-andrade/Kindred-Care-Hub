import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  AlertCircle,
  FileText,
  Pill,
  FlaskConical,
  ClipboardList,
  Clock,
  Heart,
  Edit
} from 'lucide-react';
import { format, parseISO, differenceInYears } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  mockPatients, 
  mockNotes, 
  mockPrescriptions, 
  mockLabResults, 
  mockFiles,
  mockCarePlan,
  mockTimeline,
  mockAppointments
} from '@/data/mockData';

export default function PatientDetailPage() {
  const { id } = useParams();
  const patient = mockPatients.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-semibold text-foreground">Patient not found</h2>
        <Link to="/patients" className="text-primary hover:underline mt-2">
          Return to patients
        </Link>
      </div>
    );
  }

  const patientNotes = mockNotes.filter(n => n.patientId === id);
  const patientPrescriptions = mockPrescriptions.filter(p => p.patientId === id);
  const patientLabs = mockLabResults.filter(l => l.patientId === id);
  const patientFiles = mockFiles.filter(f => f.patientId === id);
  const patientTimeline = mockTimeline.filter(t => t.patientId === id);
  const patientAppointments = mockAppointments.filter(a => a.patientId === id);
  const age = differenceInYears(new Date(), parseISO(patient.dateOfBirth));

  // Current encounter (most recent scheduled/in-progress appointment)
  const currentEncounter = patientAppointments.find(a => 
    a.status === 'scheduled' || a.status === 'in-progress'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Navigation */}
      <Link 
        to="/patients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="wellness-card p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary">
              {patient.firstName[0]}{patient.lastName[0]}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {age} years old • {patient.gender === 'female' ? 'Female' : patient.gender === 'male' ? 'Male' : 'Other'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{patient.address}</span>
              </div>
            </div>

            {/* Allergies */}
            {patient.allergies.length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <span className="text-sm font-medium text-destructive">Allergies:</span>
                <span className="text-sm text-destructive">
                  {patient.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">
            Overview
          </TabsTrigger>
          <TabsTrigger value="encounter" className="data-[state=active]:bg-background">
            Current Encounter
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-background">
            Notes
          </TabsTrigger>
          <TabsTrigger value="careplan" className="data-[state=active]:bg-background">
            Care Plan
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-background">
            Files
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="data-[state=active]:bg-background">
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="labs" className="data-[state=active]:bg-background">
            Labs
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-background">
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conditions */}
            <div className="wellness-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                Conditions
              </h3>
              <div className="space-y-2">
                {patient.conditions.length > 0 ? (
                  patient.conditions.map((condition, idx) => (
                    <div 
                      key={idx}
                      className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm"
                    >
                      {condition}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No conditions listed</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="wellness-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {patientTimeline.slice(0, 4).map(event => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {event.type === 'visit' && <Calendar className="h-4 w-4 text-primary" />}
                      {event.type === 'note' && <FileText className="h-4 w-4 text-primary" />}
                      {event.type === 'file' && <FileText className="h-4 w-4 text-primary" />}
                      {event.type === 'prescription' && <Pill className="h-4 w-4 text-primary" />}
                      {event.type === 'lab' && <FlaskConical className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Prescriptions */}
            <div className="wellness-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Pill className="h-5 w-5 text-primary" />
                Active Prescriptions
              </h3>
              <div className="space-y-3">
                {patientPrescriptions.filter(p => p.status === 'active').map(rx => (
                  <div key={rx.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{rx.medication}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {rx.dosage} • {rx.frequency}
                        </p>
                      </div>
                      <span className="status-badge status-badge-success">Active</span>
                    </div>
                  </div>
                ))}
                {patientPrescriptions.filter(p => p.status === 'active').length === 0 && (
                  <p className="text-muted-foreground text-sm">No active prescriptions</p>
                )}
              </div>
            </div>

            {/* Recent Labs */}
            <div className="wellness-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <FlaskConical className="h-5 w-5 text-primary" />
                Recent Labs
              </h3>
              <div className="space-y-3">
                {patientLabs.slice(0, 3).map(lab => (
                  <div key={lab.id} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{lab.testName}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {format(parseISO(lab.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className={cn(
                        'status-badge',
                        lab.status === 'completed' && 'status-badge-success',
                        lab.status === 'pending' && 'status-badge-warning',
                        lab.status === 'reviewed' && 'status-badge-info'
                      )}>
                        {lab.status}
                      </span>
                    </div>
                    {lab.results && (
                      <p className="text-sm text-foreground mt-2">{lab.results}</p>
                    )}
                  </div>
                ))}
                {patientLabs.length === 0 && (
                  <p className="text-muted-foreground text-sm">No lab results</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Current Encounter Tab */}
        <TabsContent value="encounter" className="space-y-6">
          <div className="wellness-card p-6">
            {currentEncounter ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {currentEncounter.type.charAt(0).toUpperCase() + currentEncounter.type.slice(1)}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {format(parseISO(currentEncounter.date), 'MMMM d, yyyy')} at {currentEncounter.time}
                    </p>
                  </div>
                  <span className={cn(
                    'status-badge',
                    currentEncounter.status === 'scheduled' && 'status-badge-info',
                    currentEncounter.status === 'in-progress' && 'status-badge-warning'
                  )}>
                    {currentEncounter.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Provider</h4>
                    <p className="text-foreground">{currentEncounter.provider}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Duration</h4>
                    <p className="text-foreground">{currentEncounter.duration} minutes</p>
                  </div>
                </div>

                {currentEncounter.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                    <p className="text-foreground">{currentEncounter.notes}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button>Start Encounter</Button>
                  <Button variant="outline">Add Notes</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground">No Active Encounter</h3>
                <p className="text-muted-foreground mt-1">Schedule an appointment to start an encounter</p>
                <Button className="mt-4">Schedule Appointment</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Clinical Notes</h3>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
          {patientNotes.length > 0 ? (
            patientNotes.map(note => (
              <div key={note.id} className="wellness-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">{note.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {format(parseISO(note.date), 'MMMM d, yyyy')} • {note.author}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                    {note.type}
                  </span>
                </div>
                <p className="text-foreground">{note.content}</p>
              </div>
            ))
          ) : (
            <div className="wellness-card p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No clinical notes yet</p>
            </div>
          )}
        </TabsContent>

        {/* Care Plan Tab */}
        <TabsContent value="careplan" className="space-y-6">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-6">
              <ClipboardList className="h-5 w-5 text-primary" />
              Care Plan
            </h3>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Goals</h4>
                <ul className="space-y-2">
                  {mockCarePlan.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-success">{idx + 1}</span>
                      </div>
                      <span className="text-foreground">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Treatments</h4>
                <ul className="space-y-2">
                  {mockCarePlan.treatments.map((treatment, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Pill className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {mockCarePlan.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                      <Heart className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Follow-ups</h4>
                <div className="space-y-2">
                  {mockCarePlan.followUps.map((followUp, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-info/5 border border-info/20">
                      <Calendar className="h-4 w-4 text-info flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">
                          {format(parseISO(followUp.date), 'MMM d, yyyy')}
                        </span>
                        <span className="text-muted-foreground ml-2">• {followUp.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Documents</h3>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          {patientFiles.length > 0 ? (
            <div className="wellness-card overflow-hidden divide-y divide-border">
              {patientFiles.map(file => (
                <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(file.uploadedAt), 'MMM d, yyyy')} • {file.size}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                    {file.type}
                  </span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="wellness-card p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No files uploaded yet</p>
            </div>
          )}
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Prescriptions</h3>
            <Button size="sm">
              <Pill className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </div>
          {patientPrescriptions.length > 0 ? (
            <div className="wellness-card overflow-hidden divide-y divide-border">
              {patientPrescriptions.map(rx => (
                <div key={rx.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{rx.medication}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {rx.dosage} • {rx.frequency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Started {format(parseISO(rx.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className={cn(
                      'status-badge',
                      rx.status === 'active' && 'status-badge-success',
                      rx.status === 'completed' && 'status-badge-info',
                      rx.status === 'discontinued' && 'status-badge-destructive'
                    )}>
                      {rx.status}
                    </span>
                  </div>
                  {rx.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">{rx.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="wellness-card p-12 text-center">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prescriptions</p>
            </div>
          )}
        </TabsContent>

        {/* Labs Tab */}
        <TabsContent value="labs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Lab Results</h3>
            <Button size="sm">
              <FlaskConical className="h-4 w-4 mr-2" />
              Order Lab
            </Button>
          </div>
          {patientLabs.length > 0 ? (
            <div className="wellness-card overflow-hidden divide-y divide-border">
              {patientLabs.map(lab => (
                <div key={lab.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{lab.testName}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {format(parseISO(lab.date), 'MMM d, yyyy')} • Ordered by {lab.orderedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {lab.interpretation && (
                        <span className={cn(
                          'status-badge',
                          lab.interpretation === 'normal' && 'status-badge-success',
                          lab.interpretation === 'abnormal' && 'status-badge-warning',
                          lab.interpretation === 'critical' && 'status-badge-destructive'
                        )}>
                          {lab.interpretation}
                        </span>
                      )}
                      <span className={cn(
                        'status-badge',
                        lab.status === 'completed' && 'status-badge-success',
                        lab.status === 'pending' && 'status-badge-warning',
                        lab.status === 'reviewed' && 'status-badge-info'
                      )}>
                        {lab.status}
                      </span>
                    </div>
                  </div>
                  {lab.results && (
                    <div className="mt-3 p-3 rounded-lg bg-muted">
                      <p className="text-sm text-foreground">{lab.results}</p>
                      {lab.normalRange && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Normal range: {lab.normalRange}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="wellness-card p-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No lab results</p>
            </div>
          )}
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Patient Timeline</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {patientTimeline.map((event, idx) => (
                  <div key={event.id} className="relative pl-10">
                    <div className={cn(
                      'absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center',
                      event.type === 'visit' && 'bg-info/10',
                      event.type === 'note' && 'bg-primary/10',
                      event.type === 'file' && 'bg-accent/10',
                      event.type === 'prescription' && 'bg-success/10',
                      event.type === 'lab' && 'bg-warning/10'
                    )}>
                      {event.type === 'visit' && <Calendar className="h-4 w-4 text-info" />}
                      {event.type === 'note' && <FileText className="h-4 w-4 text-primary" />}
                      {event.type === 'file' && <FileText className="h-4 w-4 text-accent" />}
                      {event.type === 'prescription' && <Pill className="h-4 w-4 text-success" />}
                      {event.type === 'lab' && <FlaskConical className="h-4 w-4 text-warning" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), 'MMMM d, yyyy')}
                      </p>
                      <h4 className="font-medium text-foreground mt-1">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
