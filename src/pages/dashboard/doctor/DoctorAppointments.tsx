import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Filter, Search } from "lucide-react";

interface Appointment {
    id: string;
    patientName: string;
    patientAge: number;
    patientPhone: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
    reason: string;
}

export default function DoctorAppointments() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data - replace with API call
    const appointments: Appointment[] = [
        {
            id: "1",
            patientName: "John Doe",
            patientAge: 45,
            patientPhone: "+1 234-567-8900",
            date: "2024-02-10",
            time: "09:00 AM",
            status: "scheduled",
            reason: "Regular checkup",
        },
        {
            id: "2",
            patientName: "Jane Smith",
            patientAge: 32,
            patientPhone: "+1 234-567-8901",
            date: "2024-02-10",
            time: "10:30 AM",
            status: "scheduled",
            reason: "Follow-up consultation",
        },
        {
            id: "3",
            patientName: "Robert Johnson",
            patientAge: 58,
            patientPhone: "+1 234-567-8902",
            date: "2024-02-09",
            time: "02:00 PM",
            status: "completed",
            reason: "Blood pressure check",
        },
        {
            id: "4",
            patientName: "Emily Davis",
            patientAge: 28,
            patientPhone: "+1 234-567-8903",
            date: "2024-02-09",
            time: "11:00 AM",
            status: "cancelled",
            reason: "Annual physical",
        },
    ];

    const filteredAppointments = appointments.filter((apt) => {
        const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
        const matchesSearch =
            apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            apt.reason.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "scheduled":
                return "text-blue-600 bg-blue-50";
            case "completed":
                return "text-green-600 bg-green-50";
            case "cancelled":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Appointments"
                description="Manage your appointment schedule"
            >
                <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                </Button>
            </PageHeader>

            {/* Filters */}
            <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by patient name or reason..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No appointments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{appointment.patientName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.patientAge} years
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(appointment.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {appointment.time}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            {appointment.patientPhone}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="text-sm truncate">{appointment.reason}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                appointment.status
                                            )}`}
                                        >
                                            {appointment.status.charAt(0).toUpperCase() +
                                                appointment.status.slice(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
