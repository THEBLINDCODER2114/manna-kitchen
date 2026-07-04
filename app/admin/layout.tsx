import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminRealtime from "@/components/admin/AdminRealtime";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black text-white">
      <AdminSidebar />

      <div className="ml-72">
        <AdminNavbar />
        <AdminRealtime />
        <main
          className="
          pt-20
          min-h-screen
          overflow-y-auto
          p-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
