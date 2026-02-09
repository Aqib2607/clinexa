import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatientPrescriptions() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
                    <p className="text-muted-foreground">Manage your current and past prescriptions</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amoxicillin</CardTitle>
                        <Badge>Active</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">500mg</div>
                        <p className="text-xs text-muted-foreground mt-1">Take 1 tablet every 8 hours</p>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                Prescribed: Mar 10, 2026
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <User className="mr-2 h-4 w-4" />
                                Dr. Sarah Mitchell
                            </div>
                        </div>

                        <Button className="w-full mt-4" variant="outline">
                            <FileText className="mr-2 h-4 w-4" /> View Details
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


