import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
import { CheckCircle2, Clock, AlertCircle, ClipboardList, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Task {
    id: string;
    title: string;
    patient_name: string;
    ward: string;
    priority: "high" | "medium" | "low";
    due_time: string;
    completed: boolean;
    type: string;
    admission_id: string;
    notes?: string;
}

export default function NurseTasks() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [priorityFilter, setPriorityFilter] = useState<string>("all");

    const { data: tasks = [], isLoading } = useQuery<Task[]>({
        queryKey: ["nurse-tasks"],
        queryFn: async () => {
            const res = await api.get("/nurse/tasks");
            return res.data;
        },
    });

    const completeTaskMutation = useMutation({
        mutationFn: async (taskId: string) => {
            return api.patch(`/nurse/tasks/${taskId}/complete`);
        },
        onSuccess: () => {
            toast({ title: "Task completed", description: "Task marked as completed." });
            queryClient.invalidateQueries({ queryKey: ["nurse-tasks"] });
            queryClient.invalidateQueries({ queryKey: ["nurse-vitals"] });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to complete task.", variant: "destructive" });
        },
    });

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
                title="My Tasks"
                description="Manage your nursing tasks and assignments"
            />

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
                        <CardContent className="py-12 text-center">
                            <ClipboardList className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                            <p className="font-medium text-muted-foreground">No tasks found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {priorityFilter !== "all"
                                    ? "Try changing the filter"
                                    : "All vitals are up to date"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTasks.map((task) => (
                        <Card
                            key={task.id}
                            className={`transition-all ${
                                task.completed ? "opacity-60" : "hover:shadow-md"
                            }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => {
                                            if (!task.completed) {
                                                completeTaskMutation.mutate(task.id);
                                            }
                                        }}
                                        className="mt-1"
                                        disabled={task.completed || completeTaskMutation.isPending}
                                    />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle
                                                className={`text-base ${
                                                    task.completed
                                                        ? "line-through text-muted-foreground"
                                                        : ""
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
                                            {task.patient_name} • {task.ward}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Due: {task.due_time}</span>
                                </div>
                                {task.notes && (
                                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                                )}
                                {!task.completed && task.type === "vitals" && (
                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                        <Link to="/nurse/vitals">Record Vitals</Link>
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
