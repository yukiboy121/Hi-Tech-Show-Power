export const business = {
  name: "Hi Tech Show Power Engineering",
  shortName: "Hi Tech Show Power",
  tagline: "Generator Maintenance · Electrical Installations · Air Conditioners",
  description:
    "Professional generator maintenance, electrical installations, and air conditioner services across Sri Lanka. 24-hour emergency support available.",
  hotline: "07 666 700 40",
  hotlineTel: "+94766670040",
  mobile: "071 629 9335",
  mobileTel: "+94716299335",
  email: "hitechshow.p@gmail.com",
  serviceHours: "24 Hour Service",
  location: "Sri Lanka — Island-wide mobile service",
} as const;

export const mainServices = [
  {
    title: "Generator Maintenance",
    desc: "Complete generator servicing, repair, and maintenance for diesel, petrol, and industrial units — Perkins, Cummins, and all major brands.",
    icon: "🔧",
    features: ["On-site repair", "All brands", "Genuine parts", "24-hour service"],
  },
  {
    title: "Electrical Installations",
    desc: "Professional electrical wiring, control panel setup, ATS installation, earthing, and full electrical system integration for homes and businesses.",
    icon: "⚡",
    features: ["Control panels", "ATS wiring", "Earthing & safety", "Load testing"],
  },
  {
    title: "Air Conditioners",
    desc: "Air conditioner installation, repair, and maintenance for residential and commercial units. Indoor and outdoor unit servicing.",
    icon: "❄️",
    features: ["Installation", "Repair & service", "Gas refilling", "All AC types"],
  },
  {
    title: "24 Hour Emergency",
    desc: "Power failure or breakdown at any time? Our emergency team is available around the clock — call our hotline for immediate assistance.",
    icon: "🚨",
    features: ["24/7 hotline", "Fast response", "On-site service", "All districts"],
  },
] as const;
