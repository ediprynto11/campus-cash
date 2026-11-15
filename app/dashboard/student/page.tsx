export default function StudentDashboard() {
    return (
        <main className="min-h-screen bg-slate-100">
            <section className="p-6 md:p-10">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Ringkasan aktivitas pembiayaan pendidikanmu.
                        </p>
                    </div>

                    <div className="rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
                        <span className="font-medium text-slate-700">
                            Mahasiswa
                        </span>
                    </div>
                </header>

                <div className="mb-8 rounded-2xl bg-blue-600 p-8 text-white">
                    <p className="text-sm text-blue-100">
                        Selamat datang,
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                        Mahasiswa CampusCash!
                    </h3>
                    <p className="mt-3 max-w-xl text-sm text-blue-100">
                        Kelola kebutuhan pembiayaan pendidikan dan pantau
                        pengajuanmu dengan mudah melalui CampusCash.
                    </p>

                    <a
                        href="#"
                        className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700"
                    >
                        Ajukan Pembiayaan
                    </a>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Pengajuan Aktif
                        </p>
                        <h3 className="mt-3 text-3xl font-bold text-slate-800">
                            0
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">
                            Pengajuan menunggu proses
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Pembiayaan
                        </p>
                        <h3 className="mt-3 text-3xl font-bold text-slate-800">
                            Rp0
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">
                            Total pembiayaan disetujui
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Cicilan Berikutnya
                        </p>
                        <h3 className="mt-3 text-3xl font-bold text-slate-800">
                            Rp0
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">
                            Belum ada tagihan
                        </p>
                    </div>
                </div>

                <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">
                        Aktivitas Terbaru
                    </h3>
                    <p className="mt-4 text-sm text-slate-500">
                        Belum ada aktivitas. Pengajuan dan pembayaranmu
                        akan ditampilkan di sini.
                    </p>
                </div>
            </section>
        </main>
    );
}
