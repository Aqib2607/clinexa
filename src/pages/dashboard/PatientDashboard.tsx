import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Calendar,
  FileText,
  ClipboardList,
  Clock,
  Download,
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

const patientInfo = {
  name: "John Smith",
  dob: "March 15, 1980",
  bloodType: "A+",
  phone: "+1 (555) 123-4567",
  email: "john.smith@email.com",
  address: "123 Main Street, Healthcare City, HC 12345",
  emergencyContact: "Jane Smith (Wife) - +1 (555) 987-6543",
};

const upcomingAppointments = [
  { date: "Feb 15, 2026", time: "10:00 AM", doctor: "Dr. Sarah Mitchell", department: "Cardiology", status: "approved" },
  { date: "Mar 1, 2026", time: "02:30 PM", doctor: "Dr. Emily Chen", department: "General Medicine", status: "pending" },
];

const recentRecords = [
  { date: "Jan 28, 2026", type: "Lab Results", description: "Complete Blood Count", doctor: "Dr. Mitchell" },
  { date: "Jan 20, 2026", type: "Imaging", description: "Chest X-Ray", doctor: "Dr. Wilson" },
  { date: "Jan 15, 2026", type: "Consultation", description: "Cardiology Follow-up", doctor: "Dr. Mitchell" },
  { date: "Dec 10, 2025", type: "Lab Results", description: "Lipid Panel", doctor: "Dr. Chen" },
];

const prescriptions = [
  { name: "Lisinopril 10mg", dosage: "Once daily", refillsLeft: 3, status: "active" },
  { name: "Metformin 500mg", dosage: "Twice daily", refillsLeft: 2, status: "active" },
  { name: "Atorvastatin 20mg", dosage: "Once daily at bedtime", refillsLeft: 1, status: "active" },
];

const consentStatus = [
  { type: "General Treatment Consent", status: true, date: "Jan 15, 2026" },
  { type: "Data Processing Consent", status: true, date: "Jan 15, 2026" },
  { type: "Emergency Treatment Consent", status: true, date: "Jan 15, 2026" },
  { type: "Research Participation", status: false, date: null },
];

export default function PatientDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title={`Welcome, ${patientInfo.name}`}
        description="Manage your health records and appointments"
      >
        <Button className="btn-transition">
          <Plus className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </PageHeader>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-card rounded-xl shadow-card animate-slide-up">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patient/appointments">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="p-4 lg:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs text-primary font-medium">
                          {appointment.date.split(',')[0].split(' ')[0]}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {appointment.date.split(' ')[1].replace(',', '')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.department} · {appointment.time}</p>
                      </div>
                    </div>
                    <StatusBadge status={appointment.status as any} />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No upcoming appointments
                </div>
              )}
            </div>
            <div className="p-4 lg:px-6 border-t border-border">
              <Button asChild className="w-full sm:w-auto btn-transition">
                <Link to="/appointment">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New Appointment
                </Link>
              </Button>
            </div>
          </div>

          {/* Medical Records */}
          <div className="bg-card rounded-xl shadow-card animate-slide-up stagger-1">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Medical Records
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patient/records">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentRecords.map((record, index) => (
                <div key={index} className="p-4 lg:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{record.description}</p>
                      <p className="text-sm text-muted-foreground">{record.type} · {record.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-card rounded-xl shadow-card animate-slide-up stagger-2">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Active Prescriptions
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patient/prescriptions">View All</Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="p-4 lg:px-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-card-foreground">{prescription.name}</p>
                    <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={prescription.status as any} />
                    <p className="text-xs text-muted-foreground mt-1">{prescription.refillsLeft} refills left</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-3">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{patientInfo.name}</h3>
                <p className="text-sm text-muted-foreground">DOB: {patientInfo.dob}</p>
                <p className="text-sm text-primary font-medium">Blood Type: {patientInfo.bloodType}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{patientInfo.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{patientInfo.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{patientInfo.address}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 btn-transition" asChild>
              <Link to="/patient/settings">
                Edit Profile
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Consent Status */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-4">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Consent Status
            </h3>
            <div className="space-y-3">
              {consentStatus.map((consent, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-card-foreground">{consent.type}</span>
                  {consent.status ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
              <Link to="/patient/settings">Manage Consents</Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-5">
            <h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <Link to="/contact">
                  Contact Hospital
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <Link to="/patient/records">
                  Download Records
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between btn-transition" asChild>
                <a href="tel:+18001234567">
                  Emergency: +1 (800) 123-4567
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
