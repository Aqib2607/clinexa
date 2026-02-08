import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Our Doctors", href: "/doctors" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Emergency Care", href: "/departments" },
    { name: "Cardiology", href: "/departments" },
    { name: "Neurology", href: "/departments" },
    { name: "Orthopedics", href: "/departments" },
    { name: "Pediatrics", href: "/departments" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Consent Policy", href: "/consent" },
  ],
};

export function PublicFooter() {
  return (
    <footer className="bg-clinexa-dark text-clinexa-secondary">
      {/* Main Footer */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-white">Clinexa</span>
            </Link>
            <p className="text-sm text-clinexa-secondary/80 mb-6">
              Providing exceptional healthcare services with compassion and cutting-edge technology since 1990.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>123 Medical Center Drive, Healthcare City, HC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>info@clinexa.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 shrink-0 text-primary" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-clinexa-secondary/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-clinexa-secondary/80 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            <p className="text-sm text-clinexa-secondary/80 mb-4">
              Follow us for health tips and hospital updates.
            </p>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-2">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-sm text-clinexa-secondary/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sidebar-border">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-clinexa-secondary/60">
            <p>© {new Date().getFullYear()} Clinexa Hospital Management System. All rights reserved.</p>
            <p>Designed for healthcare excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
