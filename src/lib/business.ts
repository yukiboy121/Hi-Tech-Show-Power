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
  appDownloads: {
    /** Set NEXT_PUBLIC_IOS_APP_URL when live on the App Store */
    ios: process.env.NEXT_PUBLIC_IOS_APP_URL ?? "",
    /** Set NEXT_PUBLIC_ANDROID_APP_URL when live on Google Play */
    android: process.env.NEXT_PUBLIC_ANDROID_APP_URL ?? "",
  },
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

/** Drop your photos into public/generators/ with these filenames */
export const generatorShowcase = [
  {
    title: "Diesel Generators",
    subtitle: "Industrial & standby units",
    image: "/generators/diesel.jpg",
    gradient: "bg-gradient-to-br from-slate-700 to-slate-900",
  },
  {
    title: "Perkins Units",
    subtitle: "Repair & maintenance",
    image: "/generators/perkins.jpg",
    gradient: "bg-gradient-to-br from-blue-700 to-blue-900",
  },
  {
    title: "Portable Generators",
    subtitle: "Home & shop power",
    image: "/generators/portable.jpg",
    gradient: "bg-gradient-to-br from-amber-600 to-orange-800",
  },
  {
    title: "Control Panels",
    subtitle: "Electrical installations",
    image: "/generators/panel.jpg",
    gradient: "bg-gradient-to-br from-red-700 to-red-900",
  },
] as const;
