import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Directory - Mampu Technical Test",
  description:
    "A responsive and interactive dashboard displaying our team members, complete with real-time filtering and sorting.",
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
