import ContactView from "@/components/views/contact-view";
import { getCurrentUser } from "@/lib/auth";

export default async function ContactPage() {
  const user = await getCurrentUser();
  const contactUser = user ? { name: user.name, email: user.email } : null;
  return <ContactView user={contactUser} />;
}
