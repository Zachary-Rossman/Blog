import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    /**
     * ==============================
     * LOGIN PAGE (UI WRAPPER)
     * ==============================
     *
     * PURPOSE:
     * This page is responsible ONLY for layout.
     * It does NOT handle authentication logic directly.
     *
     * All logic is delegated to:
     * - LoginForm component (handles API request, state, validation)
     * - AuthProvider (handles global user state)
     *
     * This keeps the App Router architecture clean:
     * UI pages = composition only
     * Components = logic + interaction
     */

    <main
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-gray-50"
      aria-labelledby="login-title"
    >
      {/**
        * CENTERED CONTAINER
        * ------------------
        * max-w-md ensures the login form does not stretch too wide
        * space-y-6 creates consistent vertical rhythm
        */}
      <div className="w-full max-w-md space-y-6">

        {/**
          * HEADER SECTION
          * --------------
          * Purely informational UX layer:
          * - Title establishes context
          * - Subtitle reduces cognitive load for users
          */}
        <header className="text-center space-y-2">
          <h1
            id="login-title"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Welcome Back
          </h1>

          <p className="text-sm text-gray-600">
            Log in to continue to your dashboard and manage your posts.
          </p>
        </header>

        {/**
          * FORM CONTAINER
          * --------------
          * This is intentionally isolated as a "card UI"
          * to visually separate authentication from page chrome.
          *
          * LoginForm handles:
          * - input state
          * - validation
          * - API call (/api/login)
          * - cookie/session update via backend
          * - redirect on success
          */}
        <section
          className="bg-white border rounded-xl shadow-sm p-6"
          aria-label="Login form"
        >
          <LoginForm />
        </section>

      </div>
    </main>
  );
}