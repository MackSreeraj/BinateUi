import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

// Define the type for scheduled content
interface ScheduledContent {
  _id: string;
  title: string;
  scheduledDate: string;
  platform: string;
  status: string;
  draft: string;
  publishedDate: string;
  user: string;
}

const ContentCalendarOverview: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [datesWithContent, setDatesWithContent] = useState<Date[]>([]);
  
  // Fetch real data from the API
  useEffect(() => {
    const fetchScheduledContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/content-schedule');
        
        if (!response.ok) {
          throw new Error('Failed to fetch content schedule data');
        }
        
        const data = await response.json();
        console.log('Fetched content schedules:', data.schedules);
        setScheduledContent(data.schedules);
        
        // Extract dates with content for calendar marking
        const dates = data.schedules
          .filter((item: ScheduledContent) => item.scheduledDate)
          .map((item: ScheduledContent) => {
            console.log(`Schedule date for ${item.title}: ${item.scheduledDate}`);
            return new Date(item.scheduledDate);
          });
        
        console.log('Dates with content:', dates);
        setDatesWithContent(dates);
      } catch (err) {
        console.error('Error fetching content schedule:', err);
        setError('Failed to load content schedule data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScheduledContent();
  }, []);
  
  // Get content for a specific date
  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(content => {
      if (!content.scheduledDate) return false;
      return isSameDay(new Date(content.scheduledDate), date);
    });
  };
  
  // Check if a date has scheduled content
  const hasScheduledContent = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    return scheduledContent.some(content => {
      if (!content.scheduledDate) return false;
      const scheduleDate = new Date(content.scheduledDate);
      const scheduleDateStr = format(scheduleDate, 'yyyy-MM-dd');
      return scheduleDateStr === dateStr;
    });
  };
  
  // We don't need tileContent anymore as we're using CSS to show the indicator
  const tileContent = null;
  
  // Custom tile className to style the current date, selected date, and dates with content
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isToday = isSameDay(date, new Date());
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      const hasContent = hasScheduledContent(date);
      
      let className = '';
      
      if (isToday) {
        className += ' bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground';
      }
      
      if (isSelected && !isToday) {
        className += ' bg-muted text-foreground hover:bg-muted hover:text-foreground';
      }
      
      if (hasContent) {
        className += ' has-content';
        
        // Debug log for July 31
        if (format(date, 'yyyy-MM-dd') === '2025-07-31') {
          console.log('July 31 has content class added');
        }
      }
      
      return className;
    }
    return '';
  };
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'published': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };
  
  // Get platform badge color
  const getPlatformColor = (platform: string) => {
    if (!platform) return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    
    switch (platform.toLowerCase()) {
      case 'blog': 
      case 'medium':
      case 'wordpress':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'twitter':
      case 'x':
      case 'facebook':
      case 'instagram':
      case 'linkedin':
      case 'tiktok':
        return 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20';
      case 'email':
      case 'newsletter':
      case 'mailchimp':
        return 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20';
      default: 
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
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
                  max-width: 100%;
                  border: none;
                  font-family: inherit;
                  line-height: 1.5;
                  background-color: var(--background);
                  color: var(--foreground);
                  border-radius: 8px;
                  overflow: hidden;
                  font-size: 1.1rem;
                }
                
                /* Style for dates with content */
                .has-content {
                  position: relative;
                }
                
                .has-content::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 6px;
                  height: 6px;
                  background-color: #f43f5e; /* rose-500 */
                  border-radius: 50%;
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
                  max-width: 100%;
                  padding: 0;
                  text-align: center;
                  line-height: 20px;
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 50px;
                  font-size: 1.1em;
                  border-radius: 6px;
                  transition: all 0.2s ease;
                  margin: 1px;
                  box-sizing: border-box;
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
                  z-index: 2;
                }
                
                /* Style the selected date */
                .react-calendar__tile--active {
                  background-color: var(--primary) !important;
                  color: white !important;
                  font-weight: bold;
                  box-sizing: border-box;
                  border-radius: 6px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
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
              {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Loading content...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">
                  <p>{error}</p>
                </div>
              ) : (selectedDate ? getContentForDate(selectedDate) : getContentForDate(new Date())).map((content) => (
                <div 
                  key={content._id} 
                  className="p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{content.title || '-'}</h3>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status ? (content.status.charAt(0).toUpperCase() + content.status.slice(1)) : '-'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{content.platform || '-'}</span>
                    {content.platform && (
                      <Badge variant="outline" className={getPlatformColor(content.platform)}>
                        {content.platform}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {!isLoading && !error && (selectedDate ? getContentForDate(selectedDate) : getContentForDate(new Date())).length === 0 && (
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
            {isLoading ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Loading upcoming content...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                <p>{error}</p>
              </div>
            ) : scheduledContent
              .filter(content => {
                if (!content.scheduledDate) return false;
                return new Date(content.scheduledDate) >= new Date();
              })
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 5)
              .map((content) => (
                <div 
                  key={content._id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0">
                      <div className="bg-accent/50 text-accent-foreground w-12 h-12 rounded-md flex flex-col items-center justify-center text-center">
                        <span className="text-xs">{content.scheduledDate ? format(parseISO(content.scheduledDate), 'MMM') : '-'}</span>
                        <span className="text-lg font-bold">{content.scheduledDate ? format(parseISO(content.scheduledDate), 'd') : '-'}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{content.title || '-'}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{content.platform || '-'}</span>
                        {content.platform && (
                          <>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className={getPlatformColor(content.platform)}>
                              {content.platform}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(content.status)}>
                    {content.status || '-'}
                  </Badge>
                </div>
              ))}
              {!isLoading && !error && scheduledContent.filter(content => {
                if (!content.scheduledDate) return false;
                return new Date(content.scheduledDate) >= new Date();
              }).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No upcoming content scheduled</p>
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
  );
};

export default ContentCalendarOverview;
