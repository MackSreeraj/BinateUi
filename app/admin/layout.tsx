import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect('/admin/login');
  }

  // Check if user is admin
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a 
            href="/admin/dashboard" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Dashboard
          </a>
          <a 
            href="/admin/users" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Users
          </a>
          <a 
            href="/api/auth/signout" 
            className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            Logout
          </a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
