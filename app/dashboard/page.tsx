"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Prevent UI flash
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
  
  // optional safety fallback
  if (!user) {
    return null;
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold">
          Profile
        </h2>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Username:</strong> {user?.username}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Quick Actions
        </h2>

        <ul className="list-disc pl-6 text-gray-700">
          <li>Create a new post</li>
          <li>View your posts</li>
          <li>Edit profile (future feature)</li>
        </ul>
      </div>
    </div>
  );
}