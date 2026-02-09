import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

interface TimeSlot {
    time: string;
    available: boolean;
    patientName?: string;
}

interface DaySchedule {
    day: string;
    date: string;
    slots: TimeSlot[];
}

export default function DoctorSchedule() {
    const [selectedDay, setSelectedDay] = useState(0);

    // Mock data - replace with API call
    const weekSchedule: DaySchedule[] = [
        {
            day: "Monday",
            date: "2024-02-12",
            slots: [
                { time: "09:00 AM", available: false, patientName: "John Doe" },
                { time: "10:00 AM", available: false, patientName: "Jane Smith" },
                { time: "11:00 AM", available: true },
                { time: "02:00 PM", available: true },
                { time: "03:00 PM", available: false, patientName: "Robert Johnson" },
                { time: "04:00 PM", available: true },
            ],
        },
        {
            day: "Tuesday",
            date: "2024-02-13",
            slots: [
                { time: "09:00 AM", available: true },
                { time: "10:00 AM", available: true },
                { time: "11:00 AM", available: false, patientName: "Emily Davis" },
                { time: "02:00 PM", available: true },
                { time: "03:00 PM", available: true },
                { time: "04:00 PM", available: true },
            ],
        },
        {
            day: "Wednesday",
            date: "2024-02-14",
            slots: [
                { time: "09:00 AM", available: false, patientName: "Michael Brown" },
                { time: "10:00 AM", available: true },
                { time: "11:00 AM", available: true },
                { time: "02:00 PM", available: false, patientName: "Sarah Wilson" },
                { time: "03:00 PM", available: true },
                { time: "04:00 PM", available: true },
            ],
        },
        {
            day: "Thursday",
            date: "2024-02-15",
            slots: [
                { time: "09:00 AM", available: true },
                { time: "10:00 AM", available: true },
                { time: "11:00 AM", available: true },
                { time: "02:00 PM", available: true },
                { time: "03:00 PM", available: true },
                { time: "04:00 PM", available: true },
            ],
        },
        {
            day: "Friday",
            date: "2024-02-16",
            slots: [
                { time: "09:00 AM", available: false, patientName: "David Lee" },
                { time: "10:00 AM", available: false, patientName: "Lisa Anderson" },
                { time: "11:00 AM", available: true },
                { time: "02:00 PM", available: true },
                { time: "03:00 PM", available: true },
                { time: "04:00 PM", available: true },
            ],
        },
    ];

    const currentSchedule = weekSchedule[selectedDay];
    const availableSlots = currentSchedule.slots.filter((s) => s.available).length;
    const bookedSlots = currentSchedule.slots.filter((s) => !s.available).length;

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Schedule"
                description="Manage your availability and appointments"
            >
                <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Set Availability
                </Button>
            </PageHeader>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {weekSchedule.map((schedule, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDay(index)}
                        className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${selectedDay === index
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/50"
                            }`}
                    >
                        <div className="text-sm font-medium">{schedule.day}</div>
                        <div className="text-xs opacity-80">
                            {new Date(schedule.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Slots
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-bold">{currentSchedule.slots.length}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Available
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">{availableSlots}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Booked
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-blue-600" />
                            <span className="text-2xl font-bold text-blue-600">{bookedSlots}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Time Slots */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {currentSchedule.day} - {new Date(currentSchedule.date).toLocaleDateString()}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentSchedule.slots.map((slot, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-2 ${slot.available
                                        ? "border-green-200 bg-green-50"
                                        : "border-blue-200 bg-blue-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">{slot.time}</span>
                                    </div>
                                    {slot.available ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                                {slot.available ? (
                                    <p className="text-sm text-green-700">Available</p>
                                ) : (
                                    <p className="text-sm text-blue-700 font-medium">
                                        {slot.patientName}
                                    </p>
                                )}
                                {slot.available && (
                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                        Block Slot
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
