import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Users,
  Calendar,
  Stethoscope,
  TrendingUp,
  Clock,
  Building2,
  UserCheck,
  Activity,
  Plus,
  Download,
  BarChart3,
} from "lucide-react";

const stats = [
  { title: "Total Appointments", value: 847, icon: Calendar, trend: { value: 15, isPositive: true } },
  { title: "Active Doctors", value: 42, icon: Stethoscope, description: "8 on leave" },
  { title: "Patients Today", value: 156, icon: Users, trend: { value: 5, isPositive: true } },
  { title: "Avg Wait Time", value: "12 min", icon: Clock, trend: { value: 8, isPositive: false } },
];

const appointments = [
  { id: "A001", patient: "John Smith", doctor: "Dr. Sarah Mitchell", department: "Cardiology", time: "09:00 AM", status: "approved" },
  { id: "A002", patient: "Emily Johnson", doctor: "Dr. James Wilson", department: "Neurology", time: "09:30 AM", status: "in-progress" },
  { id: "A003", patient: "Michael Davis", doctor: "Dr. Emily Chen", department: "Pediatrics", time: "10:00 AM", status: "pending" },
  { id: "A004", patient: "Sarah Williams", doctor: "Dr. Michael Brown", department: "Orthopedics", time: "10:30 AM", status: "approved" },
  { id: "A005", patient: "Robert Taylor", doctor: "Dr. Lisa Anderson", department: "Dermatology", time: "11:00 AM", status: "approved" },
];

const doctorAvailability = [
  { name: "Dr. Sarah Mitchell", department: "Cardiology", status: "Available", patients: 8 },
  { name: "Dr. James Wilson", department: "Neurology", status: "Busy", patients: 12 },
  { name: "Dr. Emily Chen", department: "Pediatrics", status: "Available", patients: 6 },
  { name: "Dr. Michael Brown", department: "Orthopedics", status: "Available", patients: 9 },
];

const departmentStats = [
  { name: "Cardiology", appointments: 45, occupancy: "85%" },
  { name: "Neurology", appointments: 32, occupancy: "72%" },
  { name: "Pediatrics", appointments: 58, occupancy: "90%" },
  { name: "Orthopedics", appointments: 28, occupancy: "65%" },
  { name: "Emergency", appointments: 89, occupancy: "95%" },
];

const appointmentColumns = [
  { key: "id", header: "ID" },
  { key: "patient", header: "Patient" },
  { key: "doctor", header: "Doctor" },
  { key: "department", header: "Department" },
  { key: "time", header: "Time" },
  {
    key: "status",
    header: "Status",
    render: (item: typeof appointments[0]) => (
      <StatusBadge status={item.status as any} />
    ),
  },
];

export default function HospitalAdminDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title="Hospital Dashboard"
        description="Today's overview and hospital operations"
      >
        <Button variant="outline" className="btn-transition">
          <Download className="h-4 w-4 mr-2" />
          Daily Report
        </Button>
        <Button className="btn-transition">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
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
        {/* Today's Appointments */}
        <div className="lg:col-span-2 animate-slide-up">
          <div className="bg-card rounded-xl shadow-card">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Today's Appointments</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/appointments">View All</Link>
                </Button>
              </div>
            </div>
            <DataTable columns={appointmentColumns} data={appointments} />
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Doctor Availability */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-1">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Doctor Availability
            </h3>
            <div className="space-y-3">
              {doctorAvailability.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">{doctor.department}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${doctor.status === "Available" ? "text-success" : "text-warning"}`}>
                      {doctor.status}
                    </span>
                    <p className="text-xs text-muted-foreground">{doctor.patients} patients</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
              <Link to="/admin/doctors">View All Doctors</Link>
            </Button>
          </div>

          {/* Department Performance */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-2">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Department Load
            </h3>
            <div className="space-y-3">
              {departmentStats.map((dept, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-card-foreground">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">{dept.occupancy}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: dept.occupancy }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-4">
              <Link to="/admin/departments">View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
