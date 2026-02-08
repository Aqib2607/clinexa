import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Lock, Mail, User, Phone, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob,
                gender: formData.gender,
                address: formData.address,
                password: formData.password,
            });

            toast.success("Registration successful! Please check your phone for OTP.");
            navigate('/patient/login');
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                toast.error(err.response?.data?.message || "Registration failed. Please try again.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-clinexa-dark relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <Link to="/" className="flex items-center gap-3 mb-12">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-2xl">C</span>
                        </div>
                        <span className="text-2xl font-bold text-white">Clinexa</span>
                    </Link>
                    <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                        Join Our
                        <span className="text-primary block">Healthcare Community</span>
                    </h1>
                    <p className="text-lg text-clinexa-secondary/90 max-w-md">
                        Register now to access your medical records, book appointments, and manage your healthcare journey online.
                    </p>
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-clinexa-secondary">Secure Data Protection</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-clinexa-secondary">24/7 Access to Records</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
                <div className="w-full max-w-md animate-fade-in">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">C</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Clinexa</span>
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Create Your Account</h2>
                        <p className="text-muted-foreground mt-2">Register as a patient to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="pl-10 focus-ring"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="pl-10 focus-ring"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-10 focus-ring"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="pl-10 focus-ring"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                >
                                    <SelectTrigger className="bg-card focus-ring">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card z-50">
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 Main St, City, State"
                                className="focus-ring"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 focus-ring"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 focus-ring"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-transition"
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link to="/patient/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>

                    <div className="mt-8 pt-8 border-t border-border text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Return to Hospital Website
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
