import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

// Define the type for scheduled content
interface ScheduledContent {
  id: string;
  title: string;
  date: Date;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  type: 'blog' | 'social' | 'email' | 'other';
}

const ContentCalendarOverview: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  
  // Mock data for scheduled content - in a real app, this would come from an API
  useEffect(() => {
    const mockData: ScheduledContent[] = [
      {
        id: '1',
        title: 'AI Trends in 2025',
        date: new Date(2025, 6, 29), // July 29, 2025
        platform: 'Blog',
        status: 'scheduled',
        type: 'blog'
      },
      {
        id: '2',
        title: 'New Product Announcement',
        date: new Date(2025, 6, 30), // July 30, 2025
        platform: 'Twitter',
        status: 'draft',
        type: 'social'
      },
      {
        id: '3',
        title: 'Weekly Newsletter',
        date: new Date(2025, 6, 27), // Today (July 27, 2025)
        platform: 'Email',
        status: 'scheduled',
        type: 'email'
      },
      {
        id: '4',
        title: 'Case Study: AI Implementation',
        date: new Date(2025, 6, 27), // Today (July 27, 2025)
        platform: 'LinkedIn',
        status: 'scheduled',
        type: 'social'
      }
    ];
    
    setScheduledContent(mockData);
  }, []);
  
  // Get content for a specific date
  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(content => 
      isSameDay(new Date(content.date), date)
    );
  };
  
  // Custom tile content to show indicators for dates with content
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const content = getContentForDate(date);
      if (content.length > 0) {
        return (
          <div className="flex justify-center mt-2">
            {content.map((item, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full mx-0.5 ${item.type === 'blog' ? 'bg-purple-500' : 
                  item.type === 'social' ? 'bg-pink-500' : 
                  item.type === 'email' ? 'bg-indigo-500' : 'bg-gray-500'}`}
                title={item.title}
              ></div>
            ))}
          </div>
        );
      }
    }
    return null;
  };
  
  // Custom tile className to style the current date and selected date
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isToday = isSameDay(date, new Date());
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      
      if (isSelected) return 'bg-accent text-accent-foreground rounded-md';
      if (isToday) return 'bg-primary/10 text-primary-foreground font-bold rounded-md';
      
      return '';
    }
    return '';
  };
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'published': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };
  
  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blog': return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'social': return 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20';
      case 'email': return 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground">
            Manage your content publishing schedule and track performance
          </p>
        </div>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" />
          New Content
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Content Schedule</CardTitle>
            <CardDescription>
              {format(value, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="calendar-container">
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                  line-height: 1.5;
                  background-color: var(--background);
                  color: var(--foreground);
                }
                .react-calendar__navigation {
                  height: 44px;
                  margin-bottom: 1em;
                }
                .react-calendar__navigation button {
                  min-width: 44px;
                  background: none;
                  font-size: 16px;
                  color: var(--foreground);
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: var(--accent);
                  color: var(--accent-foreground);
                  border-radius: 6px;
                }
                .react-calendar__month-view__weekdays {
                  text-transform: uppercase;
                  font-weight: bold;
                  font-size: 0.8em;
                  color: var(--muted-foreground);
                  text-align: center;
                }
                .react-calendar__month-view__days__day {
                  padding: 8px;
                  height: 60px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-between;
                  color: var(--foreground);
                  font-weight: 500;
                }
                
                .react-calendar__month-view__days__day abbr {
                  font-size: 1em;
                  font-weight: 500;
                  display: block;
                  margin-bottom: 0.5rem;
                }
                .react-calendar__tile {
                  text-align: center;
                  padding: 0.5em 0.5em;
                  background: none;
                  color: var(--foreground);
                  font-size: 1em;
                  border-radius: 6px;
                  position: relative;
                  transition: all 0.2s ease;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: var(--accent);
                  color: var(--accent-foreground);
                  border-radius: 6px;
                }
                .react-calendar__tile--now {
                  background-color: rgba(0, 128, 128, 0.2) !important;
                  color: var(--foreground) !important;
                  font-weight: bold;
                  border-radius: 6px;
                  border: 2px solid teal;
                  position: relative;
                  z-index: 1;
                  box-shadow: 0 0 0 2px rgba(0, 128, 128, 0.3);
                }
                .react-calendar__tile--now:enabled:hover,
                .react-calendar__tile--now:enabled:focus {
                  background-color: rgba(0, 128, 128, 0.3);
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                  color: var(--muted-foreground);
                  opacity: 0.5;
                }
                
                /* Custom styles for the calendar days */
                .react-calendar__month-view__weekdays__weekday {
                  padding: 0.5rem;
                  color: var(--foreground);
                  font-weight: bold;
                  text-transform: uppercase;
                  border-bottom: 2px solid teal;
                  margin: 2px;
                  position: relative;
                }
                
                .react-calendar__month-view__weekdays__weekday abbr {
                  text-decoration: none;
                  font-size: 0.85em;
                }
                
                /* Add hover effect to calendar tiles */
                .react-calendar__tile:hover {
                  background-color: var(--accent);
                  color: var(--accent-foreground);
                  transform: scale(1.05);
                  z-index: 2;
                }
                
                /* Style the selected date */
                .react-calendar__tile--active {
                  background-color: var(--primary) !important;
                  color: white !important;
                  font-weight: bold;
                }
                
                /* Style the month navigation buttons */
                .react-calendar__navigation button:hover {
                  background-color: var(--accent);
                  border-radius: 4px;
                }
              `}</style>
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setValue(value);
                  }
                }}
                value={value}
                onClickDay={(date) => handleDateClick(date)}
                tileContent={tileContent}
                tileClassName={tileClassName}
                prevLabel={<ChevronLeft className="h-4 w-4" />}
                nextLabel={<ChevronRight className="h-4 w-4" />}
                prev2Label={null}
                next2Label={null}
                selectRange={false}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Scheduled Content for Selected Date */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today\'s Content'}
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `${getContentForDate(selectedDate).length} items scheduled` 
                : `${getContentForDate(new Date()).length} items scheduled for today`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(selectedDate ? getContentForDate(selectedDate) : getContentForDate(new Date())).map((content) => (
                <div 
                  key={content.id} 
                  className="p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{content.title}</h3>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{content.platform}</span>
                    <Badge variant="outline" className={getTypeColor(content.type)}>
                      {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {(selectedDate ? getContentForDate(selectedDate) : getContentForDate(new Date())).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No content scheduled for this date</p>
                  <Button variant="outline" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Content Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Content</CardTitle>
          <CardDescription>
            Next 7 days of scheduled content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledContent
              .filter(content => content.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((content) => (
                <div 
                  key={content.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0">
                      <div className="bg-accent/50 text-accent-foreground w-12 h-12 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-xs">{format(content.date, 'MMM')}</span>
                        <span className="text-lg font-bold">{format(content.date, 'd')}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{content.platform}</span>
                        <span className="mx-2">•</span>
                        <Badge variant="outline" className={getTypeColor(content.type)}>
                          {content.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(content.status)}>
                    {content.status}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCalendarOverview;
