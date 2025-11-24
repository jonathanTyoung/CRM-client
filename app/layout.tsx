import "./globals.css";
import Sidebar from "../components/nav/Sidebar";
import Topbar from "../components/nav/Topbar";
import { AuthProvider } from "../context/AuthContext";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-white dark:bg-black antialiased">
        <AuthProvider>
          
          {/* Sidebar persists across the site */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">

            {/* Slim top header */}
            <Topbar />

            {/* Page content */}
            <main className="p-6 pt-20">
              {children}
            </main>
    
          </div>

        </AuthProvider>
      </body>
    </html>
  );
}
