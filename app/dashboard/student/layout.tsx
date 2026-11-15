
import DashboardSidebar from "@/components/DashboardSidebar";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard/student" },
    { label: "Ajukan Pembiayaan", href: "/dashboard/student/apply" },
    { label: "Riwayat Pengajuan", href: "/dashboard/student/applications" },
    { label: "Cicilan Saya", href: "/dashboard/student/installments" },
    { label: "Riwayat Pembayaran", href: "/dashboard/student/payments" },
  ];

  return (
    <>
      <DashboardSidebar
        portal="student"
        menuItems={menuItems}
      />

      <div className="min-h-screen md:ml-64">
        {children}
      </div>
    </>
  );
}
