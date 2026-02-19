import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Task Manager 🚀
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-md">
        Organize your tasks efficiently. Login or create an account to start managing your work.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
