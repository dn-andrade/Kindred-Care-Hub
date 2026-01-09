import { useState } from 'react';
import { 
  User, 
  Bell, 
  CreditCard, 
  Shield, 
  Mail,
  Phone,
  Building,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock notification settings
  const [notifications, setNotifications] = useState({
    appointments: true,
    newFiles: true,
    labResults: true,
    patientMessages: true,
    systemUpdates: false,
    emailDigest: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-background">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-background">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Personal Information</h3>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">AF</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Profile Photo</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Amanda" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Foster" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" defaultValue="amanda.foster@medicare.com" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" defaultValue="(555) 987-6543" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" defaultValue="Primary Care Physician" />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Clinic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="clinicName" defaultValue="MediCare Wellness Clinic" className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input id="license" defaultValue="MD-123456789" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="100 Medical Center Dr, San Francisco, CA 94102" />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Appointment Reminders</h4>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                </div>
                <Switch 
                  checked={notifications.appointments} 
                  onCheckedChange={() => toggleNotification('appointments')} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">New Files</h4>
                  <p className="text-sm text-muted-foreground">When new documents are uploaded</p>
                </div>
                <Switch 
                  checked={notifications.newFiles} 
                  onCheckedChange={() => toggleNotification('newFiles')} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Lab Results</h4>
                  <p className="text-sm text-muted-foreground">When lab results are ready for review</p>
                </div>
                <Switch 
                  checked={notifications.labResults} 
                  onCheckedChange={() => toggleNotification('labResults')} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Patient Messages</h4>
                  <p className="text-sm text-muted-foreground">When patients send you messages</p>
                </div>
                <Switch 
                  checked={notifications.patientMessages} 
                  onCheckedChange={() => toggleNotification('patientMessages')} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">System Updates</h4>
                  <p className="text-sm text-muted-foreground">News and feature updates</p>
                </div>
                <Switch 
                  checked={notifications.systemUpdates} 
                  onCheckedChange={() => toggleNotification('systemUpdates')} 
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Daily Email Digest</h4>
                    <p className="text-sm text-muted-foreground">Receive a daily summary via email</p>
                  </div>
                  <Switch 
                    checked={notifications.emailDigest} 
                    onCheckedChange={() => toggleNotification('emailDigest')} 
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Current Plan</h3>
            
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">Professional Plan</h4>
                  <p className="text-sm text-muted-foreground mt-1">Unlimited patients, all features included</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">$99</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="mt-4">
              Upgrade Plan
            </Button>
          </div>

          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Payment Method</h3>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
              <div className="h-10 w-16 rounded bg-foreground/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>

          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Billing History</h3>
            
            <div className="divide-y divide-border">
              {[
                { date: 'Jan 1, 2025', amount: '$99.00', status: 'Paid' },
                { date: 'Dec 1, 2024', amount: '$99.00', status: 'Paid' },
                { date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid' },
              ].map((invoice, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{invoice.amount}</span>
                    <span className="status-badge status-badge-success">{invoice.status}</span>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Data Privacy</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Session Timeout</h4>
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
                <select className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Activity Log</h4>
                  <p className="text-sm text-muted-foreground">View all account activity</p>
                </div>
                <Button variant="ghost" size="sm">View Log</Button>
              </div>
            </div>
          </div>

          <div className="wellness-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Data Sharing</h3>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Control how your data is shared with other healthcare providers and systems.
              </p>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">HIPAA Compliant</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      All data is encrypted and handled in compliance with HIPAA regulations.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline">
                Manage Data Sharing Permissions
              </Button>
            </div>
          </div>

          <div className="wellness-card p-6 border-destructive/20">
            <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
              Delete Account
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
