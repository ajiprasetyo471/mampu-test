import { EnrichedUser } from "@/hooks/useEnrichedUsers";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  users: EnrichedUser[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export default function UsersTable({
  users,
  isLoading,
  isError,
  error,
  onRetry,
}: UsersTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div 
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="w-full space-y-4"
      >
        {/* Skeleton lines */}
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl animate-pulse gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-12"></div>
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16"></div>
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div 
        role="alert"
        className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl text-center space-y-4"
      >
        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full text-red-600 dark:text-red-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Failed to load users
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {error?.message || "An unexpected error occurred."}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-full shadow-lg shadow-red-500/20 transition-all duration-200 cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-550 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl text-center space-y-3"
      >
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          No users found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
          We couldn&apos;t find any users matching your criteria. Try adjusting your search query or status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 1. Desktop Layout (Table) */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-100/40 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/55 dark:bg-zinc-900/50">
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  Name
                </th>
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  Email
                </th>
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  Website
                </th>
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 text-center">
                  Posts
                </th>
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 text-center">
                  Completed Todos
                </th>
                <th scope="col" className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 text-center">
                  Pending Todos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => router.push(`/users/${user.id}`)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/users/${user.id}`);
                    }
                  }}
                  aria-label={`View details for ${user.name}`}
                  className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 cursor-pointer transition-colors duration-150 focus-visible:bg-zinc-50/60 dark:focus-visible:bg-zinc-800/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {/* User Avatar Initial */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-semibold text-white text-sm shadow-md shadow-indigo-500/10">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                          {user.name}
                        </span>
                        {user.username && (
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <a
                      href={`mailto:${user.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md min-h-[44px] inline-flex items-center px-2.5 py-1 -my-1 -mx-2.5 hover:bg-zinc-150/30 dark:hover:bg-zinc-800/30"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className="p-5">
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100/40 dark:border-indigo-900/20 transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                    >
                      {user.website}
                      <svg
                        className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity duration-150"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-450 rounded-full">
                      {user.totalPosts} posts
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-xs font-bold text-green-600 dark:text-green-450 rounded-full">
                      ✓ {user.completedTodos} completed
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-xs font-bold text-amber-600 dark:text-amber-450 rounded-full">
                      ⏰ {user.pendingTodos} pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Layout (Sleek Stacked Cards) */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => router.push(`/users/${user.id}`)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/users/${user.id}`);
              }
            }}
            aria-label={`View details for ${user.name}`}
            className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-5 shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-all duration-200 cursor-pointer"
          >
            {/* Ambient Accent Indicator */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>

            <div className="space-y-4 pl-2">
              {/* Header Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-semibold text-white text-sm shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Contact Links */}
              <div className="flex flex-col gap-2 pt-1">
                {/* Email */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href={`mailto:${user.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md min-h-[44px] inline-flex items-center px-2 py-1 -my-1 -mx-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                  >
                    {user.email}
                  </a>
                </div>

                {/* Website */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md min-h-[44px] px-2 py-1 -my-1 -mx-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                  >
                    {user.website}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Activity Stats Block */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                {/* Posts */}
                <div className="flex flex-col items-center justify-center p-2 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Posts</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{user.totalPosts}</span>
                </div>
                {/* Completed */}
                <div className="flex flex-col items-center justify-center p-2 bg-green-50/40 dark:bg-green-950/20 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Done</span>
                  <span className="text-sm font-extrabold text-green-600 dark:text-green-400 mt-0.5">{user.completedTodos}</span>
                </div>
                {/* Pending */}
                <div className="flex flex-col items-center justify-center p-2 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Pending</span>
                  <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{user.pendingTodos}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
