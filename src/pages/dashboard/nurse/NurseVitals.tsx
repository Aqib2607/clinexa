import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Activity, Heart, Thermometer, Wind, Droplets, Save } from "lucide-react";

interface VitalRecord {
    id: string;
    patientName: string;
    timestamp: string;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
}

export default function NurseVitals() {
    const [selectedPatient, setSelectedPatient] = useState("");

    // Mock data - replace with API call
    const recentVitals: VitalRecord[] = [
        {
            id: "1",
            patientName: "John Doe",
            timestamp: "2024-02-09 14:30",
            bloodPressure: "120/80",
            heartRate: 72,
            temperature: 98.6,
            respiratoryRate: 16,
            oxygenSaturation: 98,
        },
        {
            id: "2",
            patientName: "Jane Smith",
            timestamp: "2024-02-09 13:15",
            bloodPressure: "118/76",
            heartRate: 68,
            temperature: 99.1,
            respiratoryRate: 18,
            oxygenSaturation: 97,
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Vital Signs"
                description="Record and monitor patient vital signs"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Record New Vitals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Record Vital Signs</CardTitle>
                        <CardDescription>
                            Enter patient vital signs measurements
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="patient">Select Patient</Label>
                            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                <SelectTrigger id="patient">
                                    <SelectValue placeholder="Choose a patient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">John Doe - ICU-101</SelectItem>
                                    <SelectItem value="2">Jane Smith - GW-205</SelectItem>
                                    <SelectItem value="3">Robert Johnson - ICU-103</SelectItem>
                                    <SelectItem value="4">Emily Davis - MAT-301</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="systolic">Blood Pressure (Systolic)</Label>
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                    <Input id="systolic" type="number" placeholder="120" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diastolic">Blood Pressure (Diastolic)</Label>
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                    <Input id="diastolic" type="number" placeholder="80" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <Input id="heartRate" type="number" placeholder="72" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature (°F)</Label>
                            <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-muted-foreground" />
                                <Input id="temperature" type="number" step="0.1" placeholder="98.6" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                            <div className="flex items-center gap-2">
                                <Wind className="h-4 w-4 text-muted-foreground" />
                                <Input id="respiratoryRate" type="number" placeholder="16" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-muted-foreground" />
                                <Input id="oxygenSaturation" type="number" placeholder="98" />
                            </div>
                        </div>

                        <Button className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            Save Vital Signs
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Vitals */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Recordings</CardTitle>
                        <CardDescription>
                            Latest vital signs recorded
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentVitals.map((record) => (
                            <div
                                key={record.id}
                                className="p-4 rounded-lg border bg-muted/50 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{record.patientName}</h4>
                                    <span className="text-xs text-muted-foreground">
                                        {record.timestamp}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">BP</p>
                                            <p className="font-medium">{record.bloodPressure}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">HR</p>
                                            <p className="font-medium">{record.heartRate} bpm</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Thermometer className="h-4 w-4 text-orange-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Temp</p>
                                            <p className="font-medium">{record.temperature}°F</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wind className="h-4 w-4 text-cyan-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">RR</p>
                                            <p className="font-medium">{record.respiratoryRate}/min</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">SpO2</p>
                                            <p className="font-medium">{record.oxygenSaturation}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
