import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { Search, Filter } from "lucide-react";

const doctors = [
  { name: "Dr. Sarah Mitchell", specialty: "Cardiologist", rating: 4.9, experience: "15 years", availability: "Available", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
  { name: "Dr. James Wilson", specialty: "Neurologist", rating: 4.8, experience: "12 years", availability: "Available", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
  { name: "Dr. Emily Chen", specialty: "Pediatrician", rating: 4.9, experience: "10 years", availability: "Available", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
  { name: "Dr. Michael Brown", specialty: "Orthopedic Surgeon", rating: 4.7, experience: "18 years", availability: "Available", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80" },
  { name: "Dr. Lisa Anderson", specialty: "Dermatologist", rating: 4.6, experience: "8 years", availability: "Available", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Dr. David Kim", specialty: "General Physician", rating: 4.8, experience: "14 years", availability: "Busy", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" },
  { name: "Dr. Rachel Green", specialty: "Ophthalmologist", rating: 4.9, experience: "11 years", availability: "Available", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" },
  { name: "Dr. Robert Taylor", specialty: "Oncologist", rating: 4.8, experience: "16 years", availability: "Available", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" },
  { name: "Dr. Jennifer White", specialty: "Gastroenterologist", rating: 4.7, experience: "9 years", availability: "Available", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&q=80" },
  { name: "Dr. William Davis", specialty: "Cardiologist", rating: 4.8, experience: "20 years", availability: "Available", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80" },
  { name: "Dr. Amanda Martinez", specialty: "Pediatrician", rating: 4.9, experience: "7 years", availability: "Available", image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&q=80" },
  { name: "Dr. Christopher Lee", specialty: "Neurologist", rating: 4.6, experience: "13 years", availability: "Busy", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80" },
];

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Dermatologist",
  "General Physician",
  "Ophthalmologist",
  "Oncologist",
  "Gastroenterologist",
];

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All Specialties" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-clinexa-dark py-16 lg:py-24">
        <div className="container-wide">
          <div className="max-w-3xl animate-fade-in">
            <span className="text-primary font-medium">Expert Care</span>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mt-2 mb-6">
              Our Doctors
            </h1>
            <p className="text-lg text-clinexa-secondary/90">
              Meet our team of experienced physicians committed to providing you with the highest quality healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 lg:py-8 bg-muted/50 border-b border-border sticky top-[64px] lg:top-[80px] z-20">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container-wide">
          {filteredDoctors.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <DoctorCard {...doctor} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No doctors found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialty("All Specialties");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container-wide text-center animate-fade-in">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Can't Find the Right Doctor?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our patient coordinators can help match you with the perfect specialist for your healthcare needs.
          </p>
          <Button asChild size="lg" className="btn-transition">
            <Link to="/contact">Get Assistance</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
