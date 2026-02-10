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
import { Users, Search, Calendar, Activity, Phone, Mail, Loader2 } from "lucide-react";
import { useDoctorPatients } from "@/hooks/usePatientNotes";

interface PatientData {
    id: string;
    name: string;
    email: string;
    patient?: {
        id: string;
        user_id: string;
        phone: string;
        gender: string;
        dob: string;
        address: string;
        blood_group: string;
    };
}

export default function DoctorPatients() {
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch ALL patients from API (no search filter for stats)
    const { data: patientsData, isLoading } = useDoctorPatients();

    const allPatients = (patientsData?.data || []) as PatientData[];

    // Filter patients client-side based on search
    const filteredPatients = searchQuery
        ? allPatients.filter(patient =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : allPatients;

    const activePatients = allPatients.length; // Total count always from all patients

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96 animate-fade-in">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Patients"
                description="Manage and view your patient list"
            >
                {/* <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add Patient
                </Button> */}
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Patients"
                    value={allPatients.length}
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
                    value={allPatients.filter(p => {
                        // improved check for new patients if created_at exists, assuming simplified for now
                        return false;
                    }).length}
                    icon={Calendar}
                    description="New patients"
                />
            </div>

            {/* Search */}
            <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="patient-search"
                        name="search"
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
                    filteredPatients.map((patient) => {
                        const age = patient.patient?.dob
                            ? new Date().getFullYear() - new Date(patient.patient.dob).getFullYear()
                            : 'N/A';

                        return (
                            <Card key={patient.id} className="hover:shadow-lg transition-shadow bg-card text-card-foreground">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{patient.name}</CardTitle>
                                            <CardDescription>
                                                {age} years • {patient.patient?.gender || 'Unknown'}
                                            </CardDescription>
                                        </div>
                                        <span
                                            className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600"
                                        >
                                            Active
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{patient.patient?.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">{patient.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Activity className="h-4 w-4" />
                                            <span>
                                                Blood Group: {patient.patient?.blood_group || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-border">
                                        <Button variant="outline" className="w-full btn-transition" size="sm">
                                            View Medical History
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}


