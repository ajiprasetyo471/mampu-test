"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEnrichedUsers } from "@/hooks/useEnrichedUsers";
import UsersTable from "@/components/users/UsersTable";
import UsersFilterAndSort from "@/components/users/UsersFilterAndSort";

function UsersPageContent() {
  const { data: users = [], isLoading, isError, error, refetch } = useEnrichedUsers();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. URL search params parsing
  const searchQuery = searchParams.get("search") || "";
  const sortField = (searchParams.get("sort") as "name" | "pendingTodos") || "name";
  const sortOrder = (searchParams.get("order") as "asc" | "desc") || "asc";
  const filter = searchParams.get("filter") || "all";

  // Local query state for fluid typing, debounced to URL
  const [searchVal, setSearchVal] = useState(searchQuery);

  // Sync local input with URL (e.g. Back navigation or direct URL editing)
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Helper to build URL and push state
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced URL updates for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchVal !== searchQuery) {
        updateQueryParams({ search: searchVal || null });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchVal, searchQuery]);

  // Client-side filtering & sorting
  const processedUsers = useMemo(() => {
    let result = [...users];

    // A. Filter by Search Query (Name or Email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // B. Filter by Activity Status
    if (filter === "pending") {
      result = result.filter((user) => user.pendingTodos > 0);
    } else if (filter === "no-completed") {
      result = result.filter((user) => user.completedTodos === 0);
    }

    // C. Sorting (Name or Pending Tasks count)
    result.sort((a, b) => {
      if (sortField === "pendingTodos") {
        const valA = a.pendingTodos;
        const valB = b.pendingTodos;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
        if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });

    return result;
  }, [users, searchQuery, filter, sortField, sortOrder]);

  return (
    <main className="flex-1 bg-zinc-50/50 dark:bg-black py-16 px-6 sm:px-12 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-xs font-semibold text-indigo-700 dark:text-indigo-400 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
            Technical Test Task 4
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Users Workspace
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
            Search, filter, and monitor team activities in real-time. Rich user statistics derived from recent posts and todos.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl shadow-sm backdrop-blur-sm">
          <UsersFilterAndSort
            searchQuery={searchVal}
            setSearchQuery={setSearchVal}
            sortField={sortField}
            setSortField={(field) => updateQueryParams({ sort: field })}
            sortOrder={sortOrder}
            setSortOrder={(order) => updateQueryParams({ order })}
            filter={filter}
            setFilter={(f) => updateQueryParams({ filter: f })}
          />
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">
              {isLoading ? "Fetching Team Activities..." : `All Members (${processedUsers.length})`}
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
    </main>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-zinc-50/50 dark:bg-black py-16 px-6 sm:px-12 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Loading workspace...</p>
          </div>
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
