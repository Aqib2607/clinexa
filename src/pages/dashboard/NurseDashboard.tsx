import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { SystemUpdates } from "@/components/SystemUpdates";
import {
  Users,
  Activity,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  ThermometerSun,
  Heart,
  Droplets,
  ChevronRight,
  Plus,
} from "lucide-react";

const stats = [
  { title: "Assigned Patients", value: 8, icon: Users, description: "Ward A & B" },
  { title: "Pending Vitals", value: 4, icon: Activity },
  { title: "Tasks Completed", value: "12/15", icon: ClipboardCheck },
  { title: "Shift Ends", value: "3:00 PM", icon: Clock },
];

const assignedPatients = [
  {
    name: "John Smith",
    room: "A-101",
    condition: "Post-Surgery",
    doctor: "Dr. Mitchell",
    vitalsStatus: "due",
    lastVitals: "2 hours ago",
    alerts: ["Medication at 10:00 AM"]
  },
  {
    name: "Emily Johnson",
    room: "A-102",
    condition: "Observation",
    doctor: "Dr. Wilson",
    vitalsStatus: "completed",
    lastVitals: "30 min ago",
    alerts: []
  },
  {
    name: "Michael Davis",
    room: "A-103",
    condition: "Critical Care",
    doctor: "Dr. Brown",
    vitalsStatus: "due",
    lastVitals: "3 hours ago",
    alerts: ["IV fluid change", "Blood test scheduled"]
  },
  {
    name: "Sarah Williams",
    room: "B-201",
    condition: "Recovery",
    doctor: "Dr. Chen",
    vitalsStatus: "completed",
    lastVitals: "1 hour ago",
    alerts: ["Discharge preparation"]
  },
];

const pendingTasks = [
  { task: "Administer medication - Room A-101", priority: "high", time: "10:00 AM" },
  { task: "Change IV fluid - Room A-103", priority: "high", time: "10:30 AM" },
  { task: "Vital signs - Ward A patients", priority: "medium", time: "11:00 AM" },
  { task: "Prepare discharge papers - Room B-201", priority: "low", time: "12:00 PM" },
  { task: "Blood sample collection - Room A-103", priority: "medium", time: "02:00 PM" },
];

const recentVitals = [
  { patient: "Emily Johnson", bp: "120/80", temp: "98.4°F", pulse: "72", time: "30 min ago" },
  { patient: "Sarah Williams", bp: "118/76", temp: "98.6°F", pulse: "68", time: "1 hour ago" },
  { patient: "John Smith", bp: "135/85", temp: "99.1°F", pulse: "78", time: "2 hours ago" },
];

export default function NurseDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title="Nurse Station"
        description="Your assigned patients and tasks"
      >
        <Button className="btn-transition">
          <Plus className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
      </PageHeader>

      {/* System Updates */}
      <SystemUpdates />

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
        {/* Assigned Patients */}
        <div className="lg:col-span-2 animate-slide-up">
          <div className="bg-card rounded-xl shadow-card">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Assigned Patients</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/nurse/patients">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {assignedPatients.map((patient, index) => (
                <div
                  key={index}
                  className="p-4 lg:px-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <span className="font-bold text-muted-foreground">{patient.room}</span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.condition} · {patient.doctor}</p>
                        {patient.alerts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {patient.alerts.map((alert, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                                {alert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={patient.vitalsStatus === 'due' ? 'pending' : 'completed'} />
                      <p className="text-xs text-muted-foreground mt-1">Last: {patient.lastVitals}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pl-16">
                    <Button size="sm" variant="outline" className="btn-transition">
                      View Chart
                    </Button>
                    <Button size="sm" className="btn-transition">
                      <Activity className="h-4 w-4 mr-1" />
                      Record Vitals
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-1">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Pending Tasks
            </h3>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`h-2 w-2 rounded-full mt-2 ${task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-card-foreground">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
              <Link to="/nurse/tasks">View All Tasks</Link>
            </Button>
          </div>

          {/* Recent Vitals */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-2">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-primary" />
              Recent Vitals
            </h3>
            <div className="space-y-4">
              {recentVitals.map((vital, index) => (
                <div key={index} className="pb-3 border-b border-border last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-card-foreground mb-2">{vital.patient}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-destructive" />
                      <span className="text-muted-foreground">{vital.bp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThermometerSun className="h-3 w-3 text-warning" />
                      <span className="text-muted-foreground">{vital.temp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-primary" />
                      <span className="text-muted-foreground">{vital.pulse} bpm</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{vital.time}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
              <Link to="/nurse/vitals">View History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
