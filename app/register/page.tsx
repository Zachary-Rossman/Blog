import CreateUserForm from "@/components/auth/CreateUserForm";

export default function RegisterPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>

      <CreateUserForm />
    </div>
  );
}