import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FileText, Activity, TrendingUp, BarChart, Settings, AlertCircle, CheckCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AdminDashboard() {
  // In a real app, you would fetch these stats from your API
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, change: '+12%', changeType: 'positive' },
    { title: 'Active Sessions', value: '42', icon: Activity, change: '+5%', changeType: 'positive' },
    { title: 'Total Content', value: '5,678', icon: FileText, change: '+8%', changeType: 'positive' },
    { title: 'Trend Ideas', value: '328', icon: TrendingUp, change: '+24%', changeType: 'positive' },
  ];

  // Sample recent activities
  const recentActivities = [
    { user: 'John Doe', action: 'created a new trend', time: '2 minutes ago', status: 'success' },
    { user: 'Jane Smith', action: 'updated user profile', time: '15 minutes ago', status: 'success' },
    { user: 'Mike Johnson', action: 'deleted content item #1234', time: '1 hour ago', status: 'warning' },
    { user: 'Sarah Williams', action: 'published new content', time: '3 hours ago', status: 'success' },
    { user: 'Alex Brown', action: 'failed login attempt', time: '5 hours ago', status: 'error' },
  ];

  // Sample content performance data
  const contentPerformance = [
    { title: 'AI Trends 2025', views: 1245, engagement: 78, status: 'Published' },
    { title: 'Machine Learning Basics', views: 986, engagement: 65, status: 'Published' },
    { title: 'Future of Automation', views: 1567, engagement: 82, status: 'Published' },
    { title: 'Data Science Roadmap', views: 756, engagement: 45, status: 'Draft' },
  ];

  // Sample system notifications
  const systemNotifications = [
    { message: 'System update scheduled for tomorrow at 2:00 AM', type: 'info', time: '1 day' },
    { message: 'Database backup completed successfully', type: 'success', time: '6 hours' },
    { message: 'API rate limit warning for endpoint /api/trends', type: 'warning', time: '2 hours' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Timer className="mr-2 h-4 w-4" />
            Last updated: Just now
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Tabs for different dashboard sections */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions performed in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                      {activity.status === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />}
                      {activity.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <div>
                        <p className="text-sm font-medium">
                          <span className="font-bold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Activity</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Performance Tab */}
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Overview of content engagement and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((content, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{content.title}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${content.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {content.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{content.views} views</span>
                      <span>{content.engagement}% engagement</span>
                    </div>
                    <Progress value={content.engagement} className="h-1" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Content</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Status Tab */}
        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">System Health</p>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Healthy</span>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Recent Notifications</p>
                  {systemNotifications.map((notification, index) => (
                    <div key={index} className="flex items-start mb-3 last:mb-0">
                      {notification.type === 'info' && <Timer className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />}
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />}
                      {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />}
                      <div>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time} ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">System Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-8 border rounded-md">
                  <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics data visualization will appear here</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-1">User Growth</p>
                    <p className="text-2xl font-bold">+24%</p>
                    <p className="text-xs text-muted-foreground">Compared to last month</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-1">Content Engagement</p>
                    <p className="text-2xl font-bold">68%</p>
                    <p className="text-xs text-muted-foreground">Average across all content</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Detailed Analytics</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
