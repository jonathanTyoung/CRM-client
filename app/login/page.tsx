import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex justify-center items-center p-10">
      <div className="w-full max-w-md">
        <h1 className="text-3xl mb-6 font-bold">Login</h1>
        <LoginForm />
      </div>
    </main>
  );
}
