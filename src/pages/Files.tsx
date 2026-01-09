import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Share2, 
  FileText, 
  Image, 
  File, 
  Calendar,
  User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockFiles, mockPatients } from '@/data/mockData';

type FileType = 'all' | 'lab' | 'prescription' | 'report' | 'imaging' | 'other';

const fileTypeIcons = {
  lab: FileText,
  prescription: FileText,
  report: FileText,
  imaging: Image,
  other: File,
};

const fileTypeColors = {
  lab: 'text-wellness-teal bg-wellness-teal/10',
  prescription: 'text-success bg-success/10',
  report: 'text-info bg-info/10',
  imaging: 'text-primary bg-primary/10',
  other: 'text-muted-foreground bg-muted',
};

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FileType>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'type'>('date');

  // Enrich files with patient info
  const enrichedFiles = mockFiles.map(file => ({
    ...file,
    patient: mockPatients.find(p => p.id === file.patientId),
  }));

  const filteredFiles = useMemo(() => {
    let files = [...enrichedFiles];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      files = files.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.patient?.firstName.toLowerCase().includes(query) ||
        f.patient?.lastName.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      files = files.filter(f => f.type === filterType);
    }

    // Sort
    files.sort((a, b) => {
      if (sortBy === 'date') {
        return b.uploadedAt.localeCompare(a.uploadedAt);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    return files;
  }, [searchQuery, filterType, sortBy, enrichedFiles]);

  const fileCategories: { value: FileType; label: string }[] = [
    { value: 'all', label: 'All Files' },
    { value: 'lab', label: 'Labs' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'report', label: 'Reports' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Files</h1>
          <p className="text-muted-foreground mt-1">
            {mockFiles.length} documents across all patients
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files or patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {fileCategories.map(cat => (
            <Button
              key={cat.value}
              variant={filterType === cat.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilterType(cat.value)}
              className="flex-shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={sortBy === 'date' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('date')}
              className="text-xs"
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'name' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('name')}
              className="text-xs"
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'type' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('type')}
              className="text-xs"
            >
              Type
            </Button>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => {
            const IconComponent = fileTypeIcons[file.type];
            const colorClass = fileTypeColors[file.type];
            
            return (
              <div key={file.id} className="wellness-card p-4 hover:shadow-wellness-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                        {file.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    </div>
                  </div>
                </div>

                {/* Patient & Date */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    {file.patient && (
                      <Link 
                        to={`/patients/${file.patientId}`}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{file.patient.firstName} {file.patient.lastName}</span>
                      </Link>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">{format(parseISO(file.uploadedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="wellness-card p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground">No files found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first document to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
}
