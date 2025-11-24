import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex justify-center items-center p-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-6 font-bold">Create Account</h1>
        <RegisterForm />
      </div>
    </main>
  );
}
