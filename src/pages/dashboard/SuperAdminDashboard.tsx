import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import {
  Building2,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  Shield,
  Clock,
  Plus,
  Download,
} from "lucide-react";

const stats = [
  { title: "Total Hospitals", value: 24, icon: Building2, trend: { value: 8, isPositive: true } },
  { title: "Active Users", value: "12,847", icon: Users, trend: { value: 12, isPositive: true } },
  { title: "System Uptime", value: "99.9%", icon: Server },
  { title: "Security Alerts", value: 3, icon: AlertTriangle, description: "Requires attention" },
];

const hospitals = [
  { id: "H001", name: "Clinexa Central Hospital", city: "New York", status: "active", users: 245, lastSync: "2 min ago" },
  { id: "H002", name: "Westside Medical Center", city: "Los Angeles", status: "active", users: 189, lastSync: "5 min ago" },
  { id: "H003", name: "Metro Health System", city: "Chicago", status: "active", users: 312, lastSync: "1 min ago" },
  { id: "H004", name: "Pacific Care Hospital", city: "San Francisco", status: "pending", users: 156, lastSync: "10 min ago" },
  { id: "H005", name: "Southern Medical", city: "Houston", status: "active", users: 201, lastSync: "3 min ago" },
];

const auditLogs = [
  { time: "10:45 AM", user: "admin@clinexa.com", action: "User Created", details: "New doctor account added" },
  { time: "10:32 AM", user: "system", action: "Backup Complete", details: "Daily backup successful" },
  { time: "10:15 AM", user: "admin@westside.com", action: "Settings Changed", details: "Updated billing config" },
  { time: "09:58 AM", user: "system", action: "Security Scan", details: "No vulnerabilities found" },
];

const hospitalColumns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Hospital Name" },
  { key: "city", header: "City" },
  {
    key: "status",
    header: "Status",
    render: (item: typeof hospitals[0]) => (
      <StatusBadge status={item.status as any} />
    ),
  },
  { key: "users", header: "Users" },
  { key: "lastSync", header: "Last Sync" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      <PageHeader
        title="Super Admin Dashboard"
        description="System-wide overview and management"
      >
        <Button variant="outline" className="btn-transition">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button className="btn-transition">
          <Plus className="h-4 w-4 mr-2" />
          Add Hospital
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
        {/* Hospitals Table */}
        <div className="lg:col-span-2 animate-slide-up">
          <div className="bg-card rounded-xl shadow-card">
            <div className="p-4 lg:p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Registered Hospitals</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/superadmin/hospitals">View All</Link>
                </Button>
              </div>
            </div>
            <DataTable columns={hospitalColumns} data={hospitals} />
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-1">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="flex items-center gap-2 text-sm text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Services</span>
                <span className="flex items-center gap-2 text-sm text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage</span>
                <span className="flex items-center gap-2 text-sm text-success">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  78% Used
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Security</span>
                <span className="flex items-center gap-2 text-sm text-warning">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  3 Alerts
                </span>
              </div>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-card rounded-xl p-5 lg:p-6 shadow-card animate-slide-up stagger-2">
            <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    {index < auditLogs.length - 1 && <div className="w-px h-full bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-card-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
              <Link to="/superadmin/audit">View All Logs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
