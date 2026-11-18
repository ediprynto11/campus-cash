
import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const menuItems = [
        {
            label: "Dashboard",
            href: "/dashboard/admin",
        },
        {
            label: "Data Mahasiswa",
            href: "/dashboard/admin/students",
        },
        {
            label: "Pengajuan Pembiayaan",
            href: "/dashboard/admin/applications",
        },
        {
            label: "Data Pembiayaan",
            href: "/dashboard/admin/loans",
        },
        {
            label: "Kategori Pembiayaan",
            href: "/dashboard/admin/categories",
        },
        {
            label: "Pengaturan Tenor",
            href: "/dashboard/admin/tenors",
        },
        {
            label: "Pembayaran",
            href: "/dashboard/admin/payments",
        },
        {
            label: "Laporan",
            href: "/dashboard/admin/reports",
        },
    ];

    return (
        <>
            <DashboardSidebar
                portal="admin"
                menuItems={menuItems}
            />

            <div className="min-h-screen md:ml-64">
                {children}
            </div>
        </>
    );
}
