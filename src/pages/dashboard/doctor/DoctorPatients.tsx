import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, Search, Calendar, Activity, Phone, Mail } from "lucide-react";

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisit: string;
    condition: string;
    status: "active" | "inactive";
}

export default function DoctorPatients() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data - replace with API call
    const patients: Patient[] = [
        {
            id: "1",
            name: "John Doe",
            age: 45,
            gender: "Male",
            phone: "+1 234-567-8900",
            email: "john.doe@email.com",
            lastVisit: "2024-02-05",
            condition: "Hypertension",
            status: "active",
        },
        {
            id: "2",
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            phone: "+1 234-567-8901",
            email: "jane.smith@email.com",
            lastVisit: "2024-02-08",
            condition: "Diabetes Type 2",
            status: "active",
        },
        {
            id: "3",
            name: "Robert Johnson",
            age: 58,
            gender: "Male",
            phone: "+1 234-567-8902",
            email: "robert.j@email.com",
            lastVisit: "2024-01-28",
            condition: "Arthritis",
            status: "active",
        },
        {
            id: "4",
            name: "Emily Davis",
            age: 28,
            gender: "Female",
            phone: "+1 234-567-8903",
            email: "emily.d@email.com",
            lastVisit: "2024-02-01",
            condition: "Asthma",
            status: "active",
        },
    ];

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activePatients = patients.filter((p) => p.status === "active").length;

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Patients"
                description="Manage and view your patient list"
            >
                <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add Patient
                </Button>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Patients"
                    value={patients.length}
                    icon={Users}
                />
                <StatCard
                    title="Active Cases"
                    value={activePatients}
                    icon={Activity}
                    description="Currently under treatment"
                />
                <StatCard
                    title="This Month"
                    value={12}
                    icon={Calendar}
                    description="New patients"
                />
            </div>

            {/* Search */}
            <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No patients found
                    </div>
                ) : (
                    filteredPatients.map((patient) => (
                        <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                                        <CardDescription>
                                            {patient.age} years • {patient.gender}
                                        </CardDescription>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${patient.status === "active"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-gray-50 text-gray-600"
                                            }`}
                                    >
                                        {patient.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Last visit:{" "}
                                            {new Date(patient.lastVisit).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-medium text-card-foreground">
                                        Condition
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {patient.condition}
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full" size="sm">
                                    View Medical History
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
