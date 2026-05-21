import { Metadata } from "next";
import { fetchUserById } from "@/services/userService";
import UserDetailsClient from "@/components/users/UserDetailsClient";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Resolve params in a way that works for Next 13/14/15
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await fetchUserById(id);
    return {
      title: `${user.name} (@${user.username}) - Users Directory`,
      description: `View complete details for ${user.name}, including contact info, company details, and address location on Mampu Technical Test.`,
    };
  } catch {
    return {
      title: "User Not Found - Users Directory",
      description: "The requested user details could not be found.",
    };
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <main className="flex-1 bg-zinc-50/50 dark:bg-black py-16 px-6 sm:px-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <UserDetailsClient id={id} />
      </div>
    </main>
  );
}
