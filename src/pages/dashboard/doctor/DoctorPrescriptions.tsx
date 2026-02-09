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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Search, Plus, FileText } from "lucide-react";

interface Prescription {
    id: string;
    patientName: string;
    date: string;
    medications: string[];
    diagnosis: string;
    notes: string;
}

export default function DoctorPrescriptions() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Mock data - replace with API call
    const prescriptions: Prescription[] = [
        {
            id: "1",
            patientName: "John Doe",
            date: "2024-02-09",
            medications: ["Lisinopril 10mg - Once daily", "Aspirin 81mg - Once daily"],
            diagnosis: "Hypertension",
            notes: "Monitor blood pressure weekly",
        },
        {
            id: "2",
            patientName: "Jane Smith",
            date: "2024-02-08",
            medications: ["Metformin 500mg - Twice daily", "Glipizide 5mg - Once daily"],
            diagnosis: "Type 2 Diabetes",
            notes: "Check blood sugar levels before meals",
        },
        {
            id: "3",
            patientName: "Robert Johnson",
            date: "2024-02-05",
            medications: ["Ibuprofen 400mg - As needed", "Glucosamine 1500mg - Once daily"],
            diagnosis: "Osteoarthritis",
            notes: "Physical therapy recommended",
        },
    ];

    const filteredPrescriptions = prescriptions.filter((rx) =>
        rx.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Prescriptions"
                description="Manage patient prescriptions"
            >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Prescription
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Prescription</DialogTitle>
                            <DialogDescription>
                                Fill in the prescription details for your patient
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient">Patient Name</Label>
                                <Input id="patient" placeholder="Select or search patient..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Input id="diagnosis" placeholder="Enter diagnosis..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medications">Medications</Label>
                                <Textarea
                                    id="medications"
                                    placeholder="Enter medications with dosage and frequency..."
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Additional instructions or notes..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsDialogOpen(false)}>
                                    Create Prescription
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {/* Search */}
            <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by patient name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Prescriptions Table */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Diagnosis</TableHead>
                            <TableHead>Medications</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPrescriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No prescriptions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPrescriptions.map((prescription) => (
                                <TableRow key={prescription.id}>
                                    <TableCell className="font-medium">
                                        {prescription.patientName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            {new Date(prescription.date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>{prescription.diagnosis}</TableCell>
                                    <TableCell className="max-w-md">
                                        <ul className="text-sm space-y-1">
                                            {prescription.medications.map((med, idx) => (
                                                <li key={idx} className="text-muted-foreground">
                                                    • {med}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm">
                                            <FileText className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            Print
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
