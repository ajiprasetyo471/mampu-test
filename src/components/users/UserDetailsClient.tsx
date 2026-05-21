"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useUserActivity } from "@/hooks/useUserActivity";

interface UserDetailsClientProps {
  id: string;
}

export default function UserDetailsClient({ id }: UserDetailsClientProps) {
  const { data: user, isLoading: isUserLoading, isError: isUserError, error: userError, refetch: refetchUser } = useUser(id);
  const { data: activity, isLoading: isActivityLoading, isError: isActivityError, error: activityError, refetch: refetchActivity } = useUserActivity(id);

  // Tabs state
  const [activeTab, setActiveTab] = useState<"posts" | "todos">("posts");
  // Todo sub-filter state
  const [todoFilter, setTodoFilter] = useState<"all" | "completed" | "pending">("all");

  const handleRetryAll = () => {
    refetchUser();
    refetchActivity();
  };

  // 1. Loading State for Main User Details
  if (isUserLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-8 animate-pulse">
        {/* Back Link Skeleton */}
        <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded-full w-28"></div>

        {/* Card Skeleton */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-10 space-y-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="space-y-3 flex-1 text-center sm:text-left w-full">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto sm:mx-0"></div>
              <div className="h-4 bg-zinc-100 dark:bg-zinc-850 rounded-lg w-1/3 mx-auto sm:mx-0"></div>
            </div>
          </div>
          
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-1/3"></div>
              <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-2/3"></div>
              <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-1/3"></div>
              <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-3/4"></div>
              <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 h-80 space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/4"></div>
          <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-full"></div>
          <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-5/6"></div>
          <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-lg w-4/5"></div>
        </div>
      </div>
    );
  }

  // 2. Error State for Main User Details
  if (isUserError || !user) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>

        <div className="flex flex-col items-center justify-center p-10 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl text-center space-y-4 shadow-xl">
          <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full text-red-600 dark:text-red-400">
            <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
              Failed to load user details
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 max-w-md">
              {userError?.message || "We encountered an error while fetching the user details. Please check your connection and try again."}
            </p>
          </div>
          <button
            onClick={handleRetryAll}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-full shadow-lg shadow-red-500/20 transition-all duration-200 cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const avatarLetter = user.name.charAt(0).toUpperCase();

  // Activity calculation
  const totalPosts = activity?.posts.length || 0;
  const completedTodos = activity?.todos.filter((t) => t.completed).length || 0;
  const pendingTodos = (activity?.todos.length || 0) - completedTodos;

  // Filtered todos based on current sub-filter
  const filteredTodos = activity?.todos.filter((todo) => {
    if (todoFilter === "completed") return todo.completed;
    if (todoFilter === "pending") return !todo.completed;
    return true;
  }) || [];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      
      {/* Back to List Link */}
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-bold text-zinc-650 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </Link>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Decorative Ambient Glows */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          
          {/* Header Block with Avatar & Name */}
          <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left pb-8 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 font-extrabold text-white text-3xl shadow-xl shadow-indigo-500/20">
              {avatarLetter}
            </div>
            <div className="space-y-1.5 flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 rounded-full">
                  @{user.username}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Info Section 1: Contact Details */}
            <div className="space-y-5">
              <h2 className="text-sm font-bold tracking-wider text-zinc-450 dark:text-zinc-500 uppercase flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h2>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Email Address</p>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm font-bold text-zinc-850 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md min-h-[44px] inline-flex items-center px-2 py-1 -my-1 -mx-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {user.phone && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-550">Phone Number</p>
                      <a
                        href={`tel:${user.phone}`}
                        className="text-sm font-bold text-zinc-850 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md min-h-[44px] inline-flex items-center px-2 py-1 -my-1 -mx-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40"
                      >
                        {user.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">Website</p>
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100/40 dark:border-indigo-900/20 transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                    >
                      {user.website}
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section 2: Company Details */}
            {user.company && (
              <div className="space-y-5">
                <h2 className="text-sm font-bold tracking-wider text-zinc-450 dark:text-zinc-500 uppercase flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Company Details
                </h2>
                <div className="p-5 bg-zinc-55 dark:bg-zinc-950/30 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl space-y-3 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-800 dark:text-zinc-200">
                      {user.company.name}
                    </h3>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                      Concept: {user.company.bs}
                    </p>
                  </div>
                  <p className="text-sm italic text-zinc-500 dark:text-zinc-400 relative pl-4 border-l-2 border-indigo-500/50">
                    &ldquo;{user.company.catchPhrase}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Info Section 3: Address Details */}
            {user.address && (
              <div className="md:col-span-2 space-y-5 border-t border-zinc-100 dark:border-zinc-800/80 pt-6">
                <h2 className="text-sm font-bold tracking-wider text-zinc-455 dark:text-zinc-500 uppercase flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address Location
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">Street</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">{user.address.street}</p>
                  </div>
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">Suite / Apt.</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">{user.address.suite}</p>
                  </div>
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">City</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">{user.address.city}</p>
                  </div>
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl">
                    <p className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">Zip Code</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-1">{user.address.zipcode}</p>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* User Activity Workspace (Posts & Todos Tabs) */}
      <div className="bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Workspace Tab Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4 gap-4">
          <div 
            role="tablist"
            aria-label="User activities workspace"
            className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 p-1 border border-zinc-150 dark:border-zinc-850 rounded-2xl w-fit"
          >
            <button
              id="posts-tab"
              role="tab"
              aria-selected={activeTab === "posts"}
              aria-controls="posts-panel"
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                activeTab === "posts"
                  ? "bg-white dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/50 dark:border-zinc-800/30"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-855 dark:hover:text-zinc-200"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5" />
              </svg>
              Recent Posts ({isActivityLoading ? "..." : totalPosts})
            </button>
            <button
              id="todos-tab"
              role="tab"
              aria-selected={activeTab === "todos"}
              aria-controls="todos-panel"
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                activeTab === "todos"
                  ? "bg-white dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/50 dark:border-zinc-800/30"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-855 dark:hover:text-zinc-200"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Todos Tasks ({isActivityLoading ? "..." : pendingTodos} pending)
            </button>
          </div>

          {/* Activity Sync Button */}
          {!isActivityLoading && !isActivityError && (
            <button
              onClick={() => refetchActivity()}
              className="text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:text-zinc-450 dark:hover:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 self-end sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 rounded-md"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
              </svg>
              Refresh Workspace
            </button>
          )}
        </div>

        {/* Tab Contents Area */}
        <div className="relative" aria-live="polite">
          {/* A. Loader for Activity Workspace */}
          {isActivityLoading && (
            <div 
              role="status"
              aria-busy="true"
              className="space-y-4 animate-pulse py-4"
            >
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="p-5 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-2xl space-y-3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3"></div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-full"></div>
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-2/3"></div>
                </div>
              ))}
            </div>
          )}

          {/* B. Error state for Activity Workspace */}
          {isActivityError && (
            <div 
              role="alert"
              className="flex flex-col items-center justify-center p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl text-center space-y-3"
            >
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200">Failed to load activity logs</h4>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {activityError?.message || "Workspace logs fetch failed."}
                </p>
              </div>
              <button
                onClick={() => refetchActivity()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-full shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
              >
                Retry Fetch
              </button>
            </div>
          )}

          {/* C. Successful Content Rendering */}
          {!isActivityLoading && !isActivityError && activity && (
            <div className="space-y-4">
                           {/* Tab 1: Posts Workspace */}
              {activeTab === "posts" && (
                <div 
                  id="posts-panel"
                  role="tabpanel"
                  aria-labelledby="posts-tab"
                  tabIndex={0}
                  className="max-h-[460px] overflow-y-auto pr-2 space-y-4 scrollbar-thin focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-800 rounded-xl"
                >
                  {activity.posts.length === 0 ? (
                    <div className="text-center py-10 text-sm text-zinc-400 dark:text-zinc-500">
                      No posts uploaded by this user.
                    </div>
                  ) : (
                    activity.posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-5 border border-zinc-150 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-2xl shadow-sm hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-200 group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Post Icon */}
                          <div className="mt-0.5 p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-zinc-850 dark:text-zinc-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors first-letter:uppercase">
                              {post.title}
                            </h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed first-letter:uppercase">
                              {post.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 2: Todos Workspace */}
              {activeTab === "todos" && (
                <div 
                  id="todos-panel"
                  role="tabpanel"
                  aria-labelledby="todos-tab"
                  className="space-y-4"
                >
                  {/* Todo Status sub-filters */}
                  <div className="flex items-center gap-1.5 flex-wrap border-b border-zinc-100 dark:border-zinc-850 pb-3">
                    {[
                      { value: "all", label: `All (${activity.todos.length})` },
                      { value: "completed", label: `Completed (${completedTodos})` },
                      { value: "pending", label: `Pending (${pendingTodos})` },
                    ].map((btn) => (
                      <button
                        key={btn.value}
                        onClick={() => setTodoFilter(btn.value as any)}
                        aria-pressed={todoFilter === btn.value}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                          todoFilter === btn.value
                            ? "bg-zinc-150 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-100"
                            : "text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-955 hover:text-zinc-700"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Todo scroll area */}
                  <div 
                    tabIndex={0}
                    className="max-h-[380px] overflow-y-auto pr-2 space-y-2.5 scrollbar-thin focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-800 rounded-xl"
                  >
                    {filteredTodos.length === 0 ? (
                      <div className="text-center py-10 text-sm text-zinc-400 dark:text-zinc-500">
                        No todos fit the criteria.
                      </div>
                    ) : (
                      filteredTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-3 p-4 border border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/10 dark:bg-zinc-950/10 rounded-2xl hover:bg-zinc-50/30 dark:hover:bg-zinc-950/30 transition-all duration-150"
                        >
                          {/* Checkbox Icon */}
                          <div className="shrink-0">
                            {todo.completed ? (
                              <div className="p-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="p-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-full border border-zinc-200 dark:border-zinc-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <span
                            className={`text-sm font-semibold first-letter:uppercase truncate ${
                              todo.completed
                                ? "text-zinc-400 dark:text-zinc-550 line-through decoration-zinc-300 dark:decoration-zinc-750 decoration-1"
                                : "text-zinc-800 dark:text-zinc-200"
                            }`}
                          >
                            {todo.title}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
