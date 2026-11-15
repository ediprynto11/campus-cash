
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold text-blue-700">
          CampusCash
        </h1>

        <div className="flex items-center gap-4">
          <a href="/login" className="text-slate-700 hover:text-blue-700">
            Login
          </a>
          <a
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Daftar
          </a>
        </div>
      </nav>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-28 text-center">
        <span className="mb-5 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Solusi Dukungan Finansial Pendidikan
        </span>

        <h2 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
          Dukung Perjalanan Pendidikanmu Bersama CampusCash
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Platform simulasi bantuan pembiayaan pendidikan untuk membantu
          mahasiswa merencanakan kebutuhan akademik dengan lebih mudah
          dan transparan.
        </p>

        <a
          href="/register"
          className="mt-8 rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Mulai Sekarang
        </a>
      </section>
    </main>
  );
}
