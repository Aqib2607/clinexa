import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatCard } from "@/components/dashboard/StatCard";
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
import { CheckCircle2, Clock, AlertCircle, ClipboardList, Filter } from "lucide-react";

interface Task {
    id: string;
    title: string;
    patientName: string;
    ward: string;
    priority: "high" | "medium" | "low";
    dueTime: string;
    completed: boolean;
    notes?: string;
}

export default function NurseTasks() {
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    // Mock data - replace with API call
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Administer medication",
            patientName: "John Doe",
            ward: "ICU-101",
            priority: "high",
            dueTime: "14:00",
            completed: false,
            notes: "Blood pressure medication",
        },
        {
            id: "2",
            title: "Check vital signs",
            patientName: "Jane Smith",
            ward: "GW-205",
            priority: "medium",
            dueTime: "15:00",
            completed: false,
        },
        {
            id: "3",
            title: "Wound dressing change",
            patientName: "Robert Johnson",
            ward: "ICU-103",
            priority: "high",
            dueTime: "14:30",
            completed: false,
            notes: "Post-surgery wound care",
        },
        {
            id: "4",
            title: "Patient mobility assistance",
            patientName: "Emily Davis",
            ward: "MAT-301",
            priority: "low",
            dueTime: "16:00",
            completed: true,
        },
        {
            id: "5",
            title: "IV fluid check",
            patientName: "John Doe",
            ward: "ICU-101",
            priority: "medium",
            dueTime: "13:00",
            completed: true,
        },
    ]);

    const toggleTaskComplete = (taskId: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const filteredTasks = tasks.filter((task) => {
        if (priorityFilter === "all") return true;
        return task.priority === priorityFilter;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const highPriorityTasks = tasks.filter(
        (t) => t.priority === "high" && !t.completed
    ).length;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "text-red-600 bg-red-50";
            case "medium":
                return "text-yellow-600 bg-yellow-50";
            case "low":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="My Tasks"
                description="Manage your nursing tasks and assignments"
            >
                <Button>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Add Task
                </Button>
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Tasks" value={totalTasks} icon={ClipboardList} />
                <StatCard
                    title="Completed"
                    value={completedTasks}
                    icon={CheckCircle2}
                    description="Tasks finished"
                />
                <StatCard
                    title="Pending"
                    value={pendingTasks}
                    icon={Clock}
                    description="Tasks remaining"
                />
                <StatCard
                    title="High Priority"
                    value={highPriorityTasks}
                    icon={AlertCircle}
                    description="Urgent tasks"
                />
            </div>

            {/* Filter */}
            <div className="bg-card rounded-xl p-4 shadow-card">
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No tasks found
                        </CardContent>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <Card
                            key={task.id}
                            className={`transition-all ${task.completed ? "opacity-60" : "hover:shadow-md"
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => toggleTaskComplete(task.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle
                                                className={`text-base ${task.completed ? "line-through text-muted-foreground" : ""
                                                    }`}
                                            >
                                                {task.title}
                                            </CardTitle>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>
                                        <CardDescription>
                                            {task.patientName} • {task.ward}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Due: {task.dueTime}</span>
                                </div>
                                {task.notes && (
                                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                                )}
                                {!task.completed && (
                                    <Button variant="outline" size="sm" className="mt-2">
                                        Add Notes
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
