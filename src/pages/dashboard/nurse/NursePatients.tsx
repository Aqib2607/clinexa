import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
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
import { Users, Search, Activity, Bed, AlertCircle, Loader2 } from "lucide-react";

interface NursePatient {
    id: string;
    patient_id: number;
    name: string;
    age: number | null;
    gender: string;
    ward: string;
    bed_number: string;
    condition: string;
    status: string;
    doctor: string;
    last_vitals: string;
    admission_date: string;
}

export default function NursePatients() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: patients = [], isLoading } = useQuery<NursePatient[]>({
        queryKey: ["nurse-patients", searchQuery],
        queryFn: async () => {
            const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
            const res = await api.get(`/nurse/patients${params}`);
            return res.data;
        },
    });

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Patients"
                description="Monitor and manage patients under your care"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Patients" value={patients.length} icon={Users} />
                <StatCard
                    title="Critical"
                    value={criticalPatients}
                    icon={AlertCircle}
                    description="Requires immediate attention"
                />
                <StatCard title="Stable" value={stablePatients} icon={Activity} />
                <StatCard title="Beds Occupied" value={patients.length} icon={Bed} />
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
                {patients.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                        <p className="font-medium text-muted-foreground">No patients found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery
                                ? "Try a different search term"
                                : "There are currently no admitted patients"}
                        </p>
                    </div>
                ) : (
                    patients.map((patient) => (
                        <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                                        <CardDescription>
                                            {patient.age ? `${patient.age} years` : "Age N/A"} •{" "}
                                            {patient.gender}
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
                                        <span className="font-medium">{patient.bed_number}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Doctor:</span>
                                        <span className="font-medium">{patient.doctor}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Last Vitals:</span>
                                        <span className="font-medium">{patient.last_vitals}</span>
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
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link to="/nurse/patients">View Chart</Link>
                                    </Button>
                                    <Button size="sm" className="flex-1" asChild>
                                        <Link to="/nurse/vitals">Record Vitals</Link>
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
