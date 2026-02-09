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
import { Users, Search, Activity, Bed, AlertCircle } from "lucide-react";

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    ward: string;
    bedNumber: string;
    condition: string;
    status: "stable" | "critical" | "recovering";
    lastVitals: string;
}

export default function NursePatients() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data - replace with API call
    const patients: Patient[] = [
        {
            id: "1",
            name: "John Doe",
            age: 45,
            gender: "Male",
            ward: "ICU",
            bedNumber: "ICU-101",
            condition: "Post-surgery recovery",
            status: "stable",
            lastVitals: "2 hours ago",
        },
        {
            id: "2",
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            ward: "General",
            bedNumber: "GW-205",
            condition: "Pneumonia",
            status: "recovering",
            lastVitals: "1 hour ago",
        },
        {
            id: "3",
            name: "Robert Johnson",
            age: 58,
            gender: "Male",
            ward: "ICU",
            bedNumber: "ICU-103",
            condition: "Cardiac arrest",
            status: "critical",
            lastVitals: "30 minutes ago",
        },
        {
            id: "4",
            name: "Emily Davis",
            age: 28,
            gender: "Female",
            ward: "Maternity",
            bedNumber: "MAT-301",
            condition: "Post-delivery",
            status: "stable",
            lastVitals: "3 hours ago",
        },
    ];

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const criticalPatients = patients.filter((p) => p.status === "critical").length;
    const stablePatients = patients.filter((p) => p.status === "stable").length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "stable":
                return "text-green-600 bg-green-50";
            case "critical":
                return "text-red-600 bg-red-50";
            case "recovering":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Patients"
                description="Monitor and manage patients under your care"
            >
                <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Assign Patient
                </Button>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Patients"
                    value={patients.length}
                    icon={Users}
                />
                <StatCard
                    title="Critical"
                    value={criticalPatients}
                    icon={AlertCircle}
                    description="Requires immediate attention"
                />
                <StatCard
                    title="Stable"
                    value={stablePatients}
                    icon={Activity}
                />
                <StatCard
                    title="Beds Occupied"
                    value={patients.length}
                    icon={Bed}
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
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            patient.status
                                        )}`}
                                    >
                                        {patient.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Ward:</span>
                                        <span className="font-medium">{patient.ward}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Bed:</span>
                                        <span className="font-medium">{patient.bedNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Last Vitals:</span>
                                        <span className="font-medium">{patient.lastVitals}</span>
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
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        View Chart
                                    </Button>
                                    <Button size="sm" className="flex-1">
                                        Record Vitals
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
