import CreateUserForm from "@/components/auth/CreateUserForm";

export default function RegisterPage() {
  /**
   * =====================================================
   * REGISTER PAGE (SERVER ROUTE COMPONENT)
   * =====================================================
   *
   * PURPOSE:
   * - Renders user registration UI
   * - Wraps CreateUserForm client component
   *
   * IMPORTANT:
   * - No authentication required to access this page
   * - Fully public route
   */
  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 bg-gray-50"
      aria-labelledby="register-title"
    >
      <div className="w-full max-w-lg space-y-6">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <header className="space-y-2 text-center">
          <h1
            id="register-title"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Create Your Account
          </h1>

          <p className="text-gray-600 text-sm">
            Join Blog and start sharing your ideas with the community.
          </p>
        </header>

        {/* =====================================================
            FORM WRAPPER
        ===================================================== */}
        <section
          className="bg-white border rounded-xl shadow-sm p-6"
          aria-label="Registration form"
        >
          <CreateUserForm />
        </section>

      </div>
    </main>
  );
}