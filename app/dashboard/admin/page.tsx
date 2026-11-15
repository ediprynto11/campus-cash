import DashboardSidebar from "@/components/DashboardSidebar";

const statistics = [
    { title: "Total Mahasiswa", value: "0" },
    { title: "Pengajuan Menunggu", value: "0" },
    { title: "Pembiayaan Aktif", value: "0" },
    { title: "Total Pembayaran", value: "Rp0" },
];

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-slate-100">
            <DashboardSidebar
                portal="admin"  
                menuItems={[
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
                ]}
            />
            <section className="p-6 md:p-10">
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Dashboard Admin
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Pantau dan kelola aktivitas CampusCash.
                    </p>
                </header>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {statistics.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <p className="text-sm text-slate-500">
                                {item.title}
                            </p>
                            <h3 className="mt-3 text-2xl font-bold text-slate-800">
                                {item.value}
                            </h3>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">
                        Pengajuan Terbaru
                    </h3>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b text-slate-500">
                                <tr>
                                    <th className="py-3">Mahasiswa</th>
                                    <th className="py-3">Kategori</th>
                                    <th className="py-3">Jumlah</th>
                                    <th className="py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-8 text-center text-slate-400"
                                    >
                                        Belum ada data pengajuan.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
