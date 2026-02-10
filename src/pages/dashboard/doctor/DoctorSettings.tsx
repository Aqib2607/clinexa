import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, Save } from "lucide-react";

import { useDoctorProfile, UpdateProfileData } from "@/hooks/useDoctorProfile";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function DoctorSettings() {
    const { data, isLoading } = useDoctorProfile();
    const { register, handleSubmit, reset } = useForm<UpdateProfileData>();
    const { updateMutation } = useDoctorProfile();

    useEffect(() => {
        if (data) {
            const names = (data.user?.name || '').split(' ');
            reset({
                first_name: names[0] || '',
                last_name: names.slice(1).join(' '),
                phone: data.user?.phone || '',
                specialization: data.doctor.specialization,
                license_number: data.doctor.license_number,
                bio: data.doctor.bio || '',
            });
        }
    }, [data, reset]);

    const handleSave = async (formData: UpdateProfileData) => {
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <PageHeader
                title="Settings"
                description="Manage your profile and preferences"
            />

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="h-4 w-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and professional information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input id="first_name" {...register('first_name')} autoComplete="given-name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input id="last_name" {...register('last_name')} autoComplete="family-name" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={data?.user.email} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" {...register('phone')} type="tel" autoComplete="tel" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input id="specialization" {...register('specialization')} autoComplete="off" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="license_number">Medical License Number</Label>
                                    <Input id="license_number" {...register('license_number')} autoComplete="off" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        rows={4}
                                        {...register('bio')}
                                    />
                                </div>
                                <Button type="submit" disabled={updateMutation.isPending}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose how you want to receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Switch id="emailNotifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="smsNotifications" className="text-base">SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via SMS
                                    </p>
                                </div>
                                <Switch id="smsNotifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="appointmentReminders" className="text-base">Appointment Reminders</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get reminders for upcoming appointments
                                    </p>
                                </div>
                                <Switch id="appointmentReminders" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="patientUpdates" className="text-base">Patient Updates</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notifications about patient status changes
                                    </p>
                                </div>
                                <Switch id="patientUpdates" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="labResults" className="text-base">Lab Results</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Alerts when lab results are available
                                    </p>
                                </div>
                                <Switch id="labResults" defaultChecked />
                            </div>
                            <Button>
                                <Save className="h-4 w-4 mr-2" />
                                Save Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
                            </div>
                            <Button>
                                <Lock className="h-4 w-4 mr-2" />
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Two-Factor Authentication</CardTitle>
                            <CardDescription>
                                Add an extra layer of security to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="enable2fa" className="text-base">Enable 2FA</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require a verification code in addition to your password
                                    </p>
                                </div>
                                <Switch id="enable2fa" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
