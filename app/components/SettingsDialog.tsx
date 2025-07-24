'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  HelpCircle,
  Save
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your preferences and account settings.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="account" className="mt-4">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="account" className="flex flex-col items-center gap-1 py-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-2">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-2">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex flex-col items-center gap-1 py-2">
              <Globe className="h-4 w-4" />
              <span className="text-xs">Language</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex flex-col items-center gap-1 py-2">
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Help</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account information and profile settings.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <input
                    id="name"
                    defaultValue="Sebastin Peter"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <input
                    id="email"
                    defaultValue="john.doe@example.com"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <input
                    id="role"
                    defaultValue="Admin"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how and when you receive notifications.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in the browser
                    </p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="content-updates">Content Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new content
                    </p>
                  </div>
                  <Switch id="content-updates" defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your data and privacy preferences.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection
                    </p>
                  </div>
                  <Switch id="data-collection" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="third-party">Third-party Integrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow third-party services to access your data
                    </p>
                  </div>
                  <Switch id="third-party" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Appearance Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the look and feel of the application.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout
                    </p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Language Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred language.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="language" className="text-right">
                    Language
                  </Label>
                  <select
                    id="language"
                    defaultValue="en"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Help & Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help and learn more about using Binate AI Content Engine.
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Documentation</h4>
                    <p className="text-sm">
                      Visit our comprehensive documentation to learn more about features and usage.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href="https://thebinate.com/docs" target="_blank" rel="noopener noreferrer">
                        View Documentation
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Support</h4>
                    <p className="text-sm">
                      Need help? Contact our support team for assistance.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href="https://thebinate.com/support" target="_blank" rel="noopener noreferrer">
                        Contact Support
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="submit" className="gap-1">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
