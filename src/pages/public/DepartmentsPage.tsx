import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DepartmentCard } from "@/components/cards/DepartmentCard";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Activity,
  Stethoscope,
  Pill,
  Microscope,
  Syringe,
  Thermometer,
  Radiation,
  Search,
} from "lucide-react";

const departments = [
  { name: "Cardiology", description: "Comprehensive heart care including diagnostics, interventional procedures, and cardiac rehabilitation programs.", icon: Heart, doctorCount: 12 },
  { name: "Neurology", description: "Expert care for brain, spine, and nervous system disorders with advanced diagnostic capabilities.", icon: Brain, doctorCount: 8 },
  { name: "Orthopedics", description: "Complete bone, joint, and muscle treatment including joint replacement and sports medicine.", icon: Bone, doctorCount: 10 },
  { name: "Pediatrics", description: "Compassionate healthcare for infants, children, and adolescents with specialized care units.", icon: Baby, doctorCount: 15 },
  { name: "Ophthalmology", description: "Complete eye care services including LASIK, cataract surgery, and retinal treatments.", icon: Eye, doctorCount: 6 },
  { name: "Emergency Medicine", description: "24/7 emergency medical services with trauma care and critical care specialists.", icon: Activity, doctorCount: 20 },
  { name: "General Medicine", description: "Primary care and preventive medicine for adults with comprehensive health screenings.", icon: Stethoscope, doctorCount: 18 },
  { name: "Oncology", description: "Advanced cancer care including chemotherapy, radiation therapy, and surgical oncology.", icon: Radiation, doctorCount: 9 },
  { name: "Dermatology", description: "Skin care treatments including cosmetic procedures and skin cancer screening.", icon: Thermometer, doctorCount: 5 },
  { name: "Gastroenterology", description: "Digestive system care with advanced endoscopy and liver disease treatment.", icon: Pill, doctorCount: 7 },
  { name: "Pathology", description: "Diagnostic laboratory services with state-of-the-art testing facilities.", icon: Microscope, doctorCount: 8 },
  { name: "Anesthesiology", description: "Pain management and anesthesia services for all surgical procedures.", icon: Syringe, doctorCount: 12 },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-clinexa-dark py-16 lg:py-24">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-in">
            <span className="text-primary font-medium">Our Specialties</span>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mt-2 mb-6">
              Medical Departments
            </h1>
            <p className="text-lg text-clinexa-secondary/90">
              Explore our comprehensive range of medical departments, each staffed with experienced specialists dedicated to providing exceptional care.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-muted/50 border-b border-border sticky top-[64px] lg:top-[80px] z-20">
        <div className="container-wide">
          <div className="relative max-w-md animate-fade-in">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container-wide">
          {filteredDepartments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDepartments.map((dept, index) => (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <DepartmentCard {...dept} href={`/departments/${dept.name.toLowerCase().replace(/\s+/g, '-')}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No departments found matching your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container-wide text-center animate-fade-in">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Need Help Finding the Right Department?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our patient coordinators are available to help guide you to the appropriate specialist for your healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-transition">
              <Link to="/appointment">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="btn-transition">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
