import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Users,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  AlertCircle,
  ChevronRight,
  Stethoscope,
  Plus,
} from "lucide-react";

const stats = [
  { title: "Today's Appointments", value: 12, icon: Calendar, description: "3 completed" },
  { title: "Assigned Patients", value: 28, icon: Users },
  { title: "Pending Prescriptions", value: 5, icon: ClipboardList },
  { title: "Next Appointment", value: "09:30 AM", icon: Clock, description: "John Smith" },
];

const todaySchedule = [
  { time: "09:00 AM", patient: "John Smith", type: "Follow-up", status: "completed", notes: "Routine checkup" },
  { time: "09:30 AM", patient: "Emily Johnson", type: "Consultation", status: "in-progress", notes: "New patient" },
  { time: "10:00 AM", patient: "Michael Davis", type: "Emergency", status: "pending", notes: "Chest pain" },
  { time: "10:30 AM", patient: "Sarah Williams", type: "Follow-up", status: "pending", notes: "Post-surgery" },
  { time: "11:00 AM", patient: "Robert Taylor", type: "Consultation", status: "pending", notes: "Referral" },
  { time: "11:30 AM", patient: "Lisa Anderson", type: "Checkup", status: "pending", notes: "Annual physical" },
];

const recentPatients = [
  { name: "John Smith", age: 45, condition: "Hypertension", lastVisit: "Today", status: "stable" },
  { name: "Emily Johnson", age: 32, condition: "Migraine", lastVisit: "Today", status: "monitoring" },
  { name: "Michael Davis", age: 58, condition: "Diabetes Type 2", lastVisit: "Yesterday", status: "stable" },
  { name: "Sarah Williams", age: 41, condition: "Post-op Recovery", lastVisit: "2 days ago", status: "improving" },
];

const alerts = [
  { type: "critical", message: "Lab results ready for Michael Davis", time: "5 min ago" },
  { type: "warning", message: "Prescription renewal request from John Smith", time: "15 min ago" },
  { type: "info", message: "New referral patient scheduled for tomorrow", time: "1 hour ago" },
];

export default function DoctorDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title="Welcome, Dr. Mitchell"
        description="Here's your schedule for today"
      >
        <Button className="btn-transition">
          <Plus className="h-4 w-4 mr-2" />
          Quick Note
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl shadow-card animate-slide-up">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Today's Schedule</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/doctor/appointments">Full Schedule</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {todaySchedule.map((appointment, index) => (
                <div
                  key={index}
                  className="p-4 lg:px-6 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-medium text-card-foreground">{appointment.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type} · {appointment.notes}</p>
                  </div>
                  <StatusBadge status={appointment.status as any} />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="btn-transition">
                      View
                    </Button>
                    {appointment.status === "in-progress" && (
                      <Button size="sm" className="btn-transition">
                        <FileText className="h-4 w-4 mr-1" />
                        Prescribe
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-card rounded-xl shadow-card animate-slide-up stagger-1">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Recent Patients</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/doctor/patients">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentPatients.map((patient, index) => (
                <div
                  key={index}
                  className="p-4 lg:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition} · Age {patient.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
                    <p className={`text-xs font-medium capitalize ${
                      patient.status === 'stable' ? 'text-success' : 
                      patient.status === 'improving' ? 'text-primary' : 'text-warning'
                    }`}>
                      {patient.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-2">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Alerts & Notifications
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-destructive/5 border-destructive/20' :
                    alert.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                    'bg-muted/50 border-border'
                  }`}
                >
                  <p className="text-sm text-card-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-3">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <Link to="/doctor/prescriptions">
                  Write Prescription
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <Link to="/doctor/patients">
                  Search Patient
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <Link to="/doctor/schedule">
                  Update Availability
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
