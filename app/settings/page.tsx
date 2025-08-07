"use client";

import { useState } from "react";
import { 
  User, 
  Settings, 
  Bell, 
  Link as LinkIcon, 
  Shield, 
  Key, 
  HelpCircle, 
  FileText,
  Zap,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const router = useRouter();

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "integrations", label: "Integrations", icon: LinkIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Keys", icon: Key },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "usage", label: "Usage & Billing", icon: Zap },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "legal", label: "Legal", icon: FileText },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <div className="py-4 px-8 border-b border-border">
        <div className="flex items-center mb-2">
          <button 
            onClick={() => router.back()} 
            className="mr-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 bg-muted/20 border-r border-border overflow-y-auto">
          <nav className="p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center w-full px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "account" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Account Settings</h2>
              
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      defaultValue="Sebastin Peter"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      defaultValue="ryan.gosling@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Role
                    </label>
                    <select className="w-full px-4 py-2 bg-input border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Avatar</h3>
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    JD
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                      Upload New Avatar
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: Square image, at least 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Integrations</h2>
              
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Connected Services</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-[#4285F4] flex items-center justify-center text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22L2 12 12 2M22 12H2M12 22V12"/></svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-foreground font-medium text-sm">Google Drive</h4>
                        <p className="text-muted-foreground text-sm">Connected</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 text-sm">
                      Disconnect
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-[#4A154B] flex items-center justify-center text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2C13.837 2 13.5 2.337 13.5 3v4c0 .663.337 1 1 1h4c.663 0 1-.337 1-1s-.337-1-1-1h-3v-3c0-.663-.337-1-1-1z"/><path d="M16.5 10c-.663 0-1 .337-1 1s.337 1 1 1h3v3c0 .663.337 1 1 1s1-.337 1-1v-4c0-.663-.337-1-1-1h-4z"/><path d="M9.5 14c.663 0 1-.337 1-1s-.337-1-1-1h-3v-3c0-.663-.337-1-1-1s-1 .337-1 1v4c0 .663.337 1 1 1h4z"/><path d="M7.5 22c.663 0 1-.337 1-1v-4c0-.663-.337-1-1-1h-4c-.663 0-1 .337-1 1s.337 1 1 1h3v3c0 .663.337 1 1 1z"/></svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-foreground font-medium text-sm">Slack</h4>
                        <p className="text-muted-foreground text-sm">Not connected</p>
                      </div>
                    </div>
                    <Link href="https://api.slack.com/apps" target="_blank" className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                      Connect <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-[#0079BF] flex items-center justify-center text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><rect width="3" height="9" x="7" y="7"/><rect width="3" height="5" x="14" y="7"/></svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-foreground font-medium text-sm">Trello</h4>
                        <p className="text-muted-foreground text-sm">Not connected</p>
                      </div>
                    </div>
                    <Link href="https://trello.com/app-key" target="_blank" className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                      Connect <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Social Media Integrations</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-[#0A66C2] flex items-center justify-center text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-foreground font-medium text-sm">LinkedIn</h4>
                        <p className="text-muted-foreground text-sm">Auto-post content to LinkedIn</p>
                      </div>
                    </div>
                    <Link href="https://www.linkedin.com/developers/apps/new" target="_blank" className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                      Connect <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded bg-[#1DA1F2] flex items-center justify-center text-white font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-foreground font-medium text-sm">Twitter</h4>
                        <p className="text-muted-foreground text-sm">Auto-post content to Twitter</p>
                      </div>
                    </div>
                    <Link href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="flex items-center px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                      Connect <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Available Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg hover:border-input cursor-pointer flex items-center">
                    <div className="h-10 w-10 rounded bg-[#171515] flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-sm">GitHub</h4>
                      <p className="text-muted-foreground text-sm mt-1">Connect your GitHub repositories</p>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-input cursor-pointer flex items-center">
                    <div className="h-10 w-10 rounded bg-[#FC636B] flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a3 3 0 0 0-1.5 2.598M3 5.845v10.31a3 3 0 0 0 1.5 2.598l7.5 4.33a3 3 0 0 0 3 0l7.5-4.33a3 3 0 0 0 1.5-2.598V5.845a3 3 0 0 0-1.5-2.598l-7.5-4.33a3 3 0 0 0-3 0l-7.5 4.33Z"/><path d="M13.5 12a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/><path d="M6.75 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/><path d="M17.25 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Asana</h4>
                      <p className="text-muted-foreground text-sm mt-1">Sync with Asana projects</p>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-input cursor-pointer flex items-center">
                    <div className="h-10 w-10 rounded bg-black flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 4.5v15h15v-15h-15zm9.75 8.25v5.25h-4.5v-5.25h4.5zm0-1.5h-4.5V6h4.5v5.25zm1.5 0V6h4.5v5.25h-4.5zm0 1.5h4.5v5.25h-4.5v-5.25z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Notion</h4>
                      <p className="text-muted-foreground text-sm mt-1">Connect to Notion workspace</p>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-input cursor-pointer flex items-center">
                    <div className="h-10 w-10 rounded bg-[#FF4A00] flex items-center justify-center text-white mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 3.6c1.992 0 3.6 1.608 3.6 3.6s-1.608 3.6-3.6 3.6-3.6-1.608-3.6-3.6 1.608-3.6 3.6-3.6zm0 17.04c-3 0-5.676-1.536-7.2-3.864.036-2.388 4.8-3.696 7.2-3.696s7.164 1.308 7.2 3.696c-1.524 2.328-4.2 3.864-7.2 3.864z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Zapier</h4>
                      <p className="text-muted-foreground text-sm mt-1">Create automated workflows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
              
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Content Updates</h4>
                      <p className="text-muted-foreground text-sm">Receive updates about content changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Trend Alerts</h4>
                      <p className="text-muted-foreground text-sm">Get notified about new trending topics</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">System Notifications</h4>
                      <p className="text-muted-foreground text-sm">Important system updates and maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Marketing</h4>
                      <p className="text-muted-foreground text-sm">Product updates and promotional content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-base font-medium text-card-foreground mb-3">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Content Comments</h4>
                      <p className="text-muted-foreground text-sm">When someone comments on your content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-foreground font-medium text-sm">Mentions</h4>
                      <p className="text-muted-foreground text-sm">When you are mentioned in comments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border-muted after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add other tab contents as needed */}
          {activeTab !== "account" && activeTab !== "integrations" && activeTab !== "notifications" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground mb-2">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
                <p className="text-muted-foreground">This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
