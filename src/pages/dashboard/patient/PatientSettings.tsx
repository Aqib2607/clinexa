import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface PatientProfile {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
    patient: {
        id: number;
        uhid: string;
        name: string;
        dob: string | null;
        gender: string | null;
        phone: string | null;
        email: string | null;
        address: string | null;
        blood_type: string | null;
    };
}

export default function PatientSettings() {
    const { toast } = useToast();

    const { data: profile, isLoading } = useQuery<PatientProfile>({
        queryKey: ["patient-profile"],
        queryFn: async () => {
            const res = await api.get("/patient/profile");
            return res.data;
        },
    });

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (profile) {
            setName(profile.patient?.name || profile.user?.name || "");
            setPhone(profile.patient?.phone || profile.user?.phone || "");
            setAddress(profile.patient?.address || "");
        }
    }, [profile]);

    const updateProfileMutation = useMutation({
        mutationFn: async () => {
            return api.post("/patient/profile", { name, phone, address });
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Profile updated successfully." });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive",
            });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: async () => {
            return api.post("/patient/profile", {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Password updated successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: (err: unknown) => {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message || "Failed to update password.";
            toast({ title: "Error", description: message, variant: "destructive" });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={profile?.user.email ?? ""}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="uhid">UHID</Label>
                                <Input
                                    id="uhid"
                                    value={profile?.patient.uhid ?? "N/A"}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            {profile?.patient.blood_type && (
                                <div className="space-y-2">
                                    <Label>Blood Type</Label>
                                    <Input value={profile.patient.blood_type} disabled />
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => updateProfileMutation.mutate()}
                                disabled={updateProfileMutation.isPending}
                            >
                                {updateProfileMutation.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input
                                    id="current"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input
                                    id="new"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">Confirm Password</Label>
                                <Input
                                    id="confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {newPassword &&
                                confirmPassword &&
                                newPassword !== confirmPassword && (
                                    <p className="text-sm text-destructive">
                                        Passwords do not match
                                    </p>
                                )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => changePasswordMutation.mutate()}
                                disabled={
                                    changePasswordMutation.isPending ||
                                    !currentPassword ||
                                    !newPassword ||
                                    newPassword !== confirmPassword
                                }
                            >
                                {changePasswordMutation.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
