"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Calendar, 
  FileCheck, 
  CreditCard, 
  AlertCircle,
  Check,
  Trash2,
  Settings,
  Mail,
  Smartphone,
  BellRing
} from "lucide-react"

interface Notification {
  id: string
  type: "appointment" | "result" | "payment" | "reminder"
  title: string
  description: string
  time: string
  date: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "appointment",
    title: "Appointment Confirmed",
    description: "Your appointment with Dr. Sara Tesfaye is confirmed for tomorrow at 10:00 AM. Location: Black Lion Hospital, Addis Ababa.",
    time: "2 hours ago",
    date: "Today",
    read: false,
  },
  {
    id: "2",
    type: "result",
    title: "Test Results Ready",
    description: "Your blood test results from Addis Diagnostic Center are now ready for collection. Visit the center with your ID to collect.",
    time: "5 hours ago",
    date: "Today",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "Preparation Required",
    description: "Remember to fast for 8-12 hours before your blood test tomorrow at 8:30 AM. Do not eat or drink anything except water.",
    time: "1 day ago",
    date: "Yesterday",
    read: true,
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Successful",
    description: "Your payment of ETB 500 for consultation with Dr. Sara Tesfaye has been successfully processed via Chapa.",
    time: "2 days ago",
    date: "May 8, 2026",
    read: true,
  },
  {
    id: "5",
    type: "appointment",
    title: "Appointment Reminder",
    description: "Reminder: You have an appointment with Bethel Clinic tomorrow at 2:00 PM for your general checkup.",
    time: "3 days ago",
    date: "May 7, 2026",
    read: true,
  },
  {
    id: "6",
    type: "result",
    title: "Results In Progress",
    description: "Your MRI scan from St. Gabriel Hospital is being processed. Expected completion: 2-3 business days.",
    time: "4 days ago",
    date: "May 6, 2026",
    read: true,
  },
]

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  appointment: Calendar,
  result: FileCheck,
  payment: CreditCard,
  reminder: AlertCircle,
}

const notificationColors: Record<string, string> = {
  appointment: "bg-primary/10 text-primary",
  result: "bg-green-100 text-green-600",
  payment: "bg-blue-100 text-blue-600",
  reminder: "bg-yellow-100 text-yellow-600",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    inApp: true,
    appointmentReminders: true,
    resultAlerts: true,
    paymentConfirmations: true,
    preparationInstructions: true,
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
    return groups
  }, {} as Record<string, Notification[]>)

  return (
    <>
   
      <div className="p-4 lg:p-8 space-y-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 bg-primary/10 text-primary">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="all" className="mt-6 space-y-6">
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
                <div className="space-y-2">
                  {items.map((notification) => {
                    const Icon = notificationIcons[notification.type]
                    return (
                      <Card 
                        key={notification.id} 
                        className={`transition-colors ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notificationColors[notification.type]}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{notification.title}</h4>
                                    {!notification.read && (
                                      <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {notification.time}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  {!notification.read && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteNotification(notification.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg">No notifications</h3>
                  <p className="text-muted-foreground mt-1">
                    You&apos;re all caught up! New notifications will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-6 space-y-3">
            {notifications.filter(n => !n.read).map((notification) => {
              const Icon = notificationIcons[notification.type]
              return (
                <Card key={notification.id} className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notificationColors[notification.type]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {notifications.filter(n => !n.read).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="font-semibold text-lg">All caught up!</h3>
                  <p className="text-muted-foreground mt-1">
                    You have no unread notifications
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.email}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">SMS</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.sms}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, sms: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="font-medium">In-App</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.inApp}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, inApp: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="font-medium">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.appointmentReminders}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, appointmentReminders: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="font-medium">Result Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when test results are ready</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.resultAlerts}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, resultAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="font-medium">Payment Confirmations</Label>
                      <p className="text-sm text-muted-foreground">Get notified about payment status</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.paymentConfirmations}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, paymentConfirmations: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <Label className="font-medium">Preparation Instructions</Label>
                      <p className="text-sm text-muted-foreground">Get instructions before appointments</p>
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.preparationInstructions}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, preparationInstructions: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button className="w-full sm:w-auto">Save Preferences</Button>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}