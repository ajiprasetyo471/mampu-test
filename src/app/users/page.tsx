"use client";

import { useState, useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import UsersTable from "@/components/users/UsersTable";
import UsersFilterAndSort from "@/components/users/UsersFilterAndSort";

export default function UsersPage() {
  const { data: users = [], isLoading, isError, error, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Client-side filtering & sorting
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Filter by Name or Email
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // 2. Sort by Name
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchQuery, sortOrder]);

  return (
    <div className="flex-1 bg-zinc-50/50 dark:bg-black py-16 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-xs font-semibold text-indigo-700 dark:text-indigo-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
            Technical Test Task 2
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Users Directory
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Search, filter, and manage team members in real-time. Fetched from the JSONPlaceholder mock service.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl shadow-sm backdrop-blur-sm">
          <UsersFilterAndSort
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">
              {isLoading ? "Fetching Team..." : `All Members (${processedUsers.length})`}
            </h2>
            {!isLoading && !isError && (
              <button
                onClick={() => refetch()}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5"
                  />
                </svg>
                Sync Data
              </button>
            )}
          </div>

          <UsersTable
            users={processedUsers}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
          />
        </div>

      </div>
    </div>
  );
}
