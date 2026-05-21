import { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
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
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {/* Skeleton lines */}
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl animate-pulse"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl text-center space-y-4">
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
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium rounded-full shadow-lg shadow-red-500/20 transition-all duration-200 cursor-pointer text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-3xl text-center space-y-3">
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
          We couldn&apos;t find any users matching your criteria. Try adjusting your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-100/40 dark:shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/55 dark:bg-zinc-900/50">
              <th className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Name
              </th>
              <th className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Email
              </th>
              <th className="p-5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Website
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="group hover:bg-zinc-50/40 dark:hover:bg-zinc-800/20 transition-colors duration-150"
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
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors duration-150"
                  >
                    {user.email}
                  </a>
                </td>
                <td className="p-5">
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100/40 dark:border-indigo-900/20 transition-all duration-150"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
