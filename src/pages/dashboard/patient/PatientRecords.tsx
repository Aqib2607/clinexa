import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Loader2, FolderOpen } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MedicalRecord {
    id: number;
    date: string;
    name: string;
    type: string;
    doctor: string;
    status: string;
    resource_type: string;
}

export default function PatientRecords() {
    const { data: records = [], isLoading } = useQuery<MedicalRecord[]>({
        queryKey: ["patient-records"],
        queryFn: async () => {
            const res = await api.get("/patient/records");
            return res.data;
        },
    });

    const handleDownload = async (record: MedicalRecord) => {
        try {
            // Request a secure download link from the backend
            const res = await api.get(
                `/patient/download/${record.resource_type}-${record.id}`
            );
            if (res.data?.link) {
                window.open(res.data.link, "_blank");
            }
        } catch {
            // Fallback: nothing to download yet
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Medical Records</h2>
                    <p className="text-muted-foreground">
                        View and download your medical history
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    {records.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                            <p className="font-medium text-muted-foreground">
                                No medical records found
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your finalized lab and radiology results will appear here
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={`${record.resource_type}-${record.id}`}>
                                        <TableCell>
                                            {new Date(record.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                {record.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{record.type}</Badge>
                                        </TableCell>
                                        <TableCell>{record.doctor}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Download"
                                                    onClick={() => handleDownload(record)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
