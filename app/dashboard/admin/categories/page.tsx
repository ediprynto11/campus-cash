
"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
    id: number;
    name: string;
    description: string;
    maxAmount: string | number;
    isActive: boolean;
};

const formatRupiah = (amount: string | number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(amount));

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionId, setActionId] = useState<number | null>(null);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // Mengambil data kategori dari PostgreSQL melalui API
    async function fetchCategories() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/admin/categories");
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Gagal mengambil data kategori"
                );
            }

            setCategories(result);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengambil data"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void fetchCategories();
    }, []);

    const activeCount = categories.filter(
        (category) => category.isActive
    ).length;

    const inactiveCount = categories.length - activeCount;

    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const matchesSearch =
                category.name.toLowerCase().includes(search.toLowerCase()) ||
                category.description.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "all" ||
                (filter === "active" && category.isActive) ||
                (filter === "inactive" && !category.isActive);

            return matchesSearch && matchesFilter;
        });
    }, [categories, search, filter]);

    function resetForm() {
        setName("");
        setDescription("");
        setMaxAmount("");
        setEditingId(null);
        setError("");
        setIsModalOpen(false);
    }

    function handleAdd() {
        setEditingId(null);
        setName("");
        setDescription("");
        setMaxAmount("");
        setError("");
        setIsModalOpen(true);
    }

    function handleEdit(category: Category) {
        setEditingId(category.id);
        setName(category.name);
        setDescription(category.description);
        setMaxAmount(String(category.maxAmount));
        setError("");
        setIsModalOpen(true);
    }

    // Menambah atau memperbarui kategori
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        const amount = Number(maxAmount);

        if (!trimmedName || !trimmedDescription || !maxAmount.trim()) {
            setError("Semua kolom wajib diisi.");
            return;
        }

        if (!Number.isSafeInteger(amount) || amount <= 0) {
            setError("Batas maksimal harus berupa angka bulat lebih dari 0.");
            return;
        }

        setSaving(true);

        try {
            const isEditing = editingId !== null;

            const response = await fetch(
                isEditing
                    ? `/api/admin/categories/${editingId}`
                    : "/api/admin/categories",
                {
                    method: isEditing ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: trimmedName,
                        description: trimmedDescription,
                        maxAmount: String(amount),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Gagal menyimpan kategori"
                );
            }

            await fetchCategories();
            resetForm();

            setNotice(
                isEditing
                    ? "Kategori berhasil diperbarui."
                    : "Kategori berhasil ditambahkan."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat menyimpan kategori"
            );
        } finally {
            setSaving(false);
        }
    }

    // Mengaktifkan atau menonaktifkan kategori
    async function handleToggleStatus(category: Category) {
        const nextStatus = !category.isActive;

        const confirmed = window.confirm(
            nextStatus
                ? `Aktifkan kembali kategori ${category.name}?`
                : `Nonaktifkan kategori ${category.name}?`
        );

        if (!confirmed) return;

        setActionId(category.id);
        setNotice("");
        setError("");

        try {
            const response = await fetch(
                `/api/admin/categories/${category.id}`,
                {
                    method: nextStatus ? "PATCH" : "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    ...(nextStatus
                        ? {
                              body: JSON.stringify({
                                  isActive: true,
                              }),
                          }
                        : {}),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Gagal mengubah status kategori"
                );
            }

            await fetchCategories();

            setNotice(
                nextStatus
                    ? "Kategori berhasil diaktifkan."
                    : "Kategori berhasil dinonaktifkan."
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengubah status"
            );
        } finally {
            setActionId(null);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-7">

                {/* Header */}
                <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        {/* <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                            Manajemen Pembiayaan
                        </div> */}

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Kategori Pembiayaan
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Kelola kategori dan atur batas maksimal pembiayaan
                            yang dapat diajukan oleh mahasiswa.
                        </p>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                        <span className="text-lg leading-none">+</span>
                        Tambah Kategori
                    </button>
                </header>

                {/* Notifications */}
                {notice && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        <span>{notice}</span>
                        <button
                            onClick={() => setNotice("")}
                            className="font-semibold"
                        >
                            Tutup
                        </button>
                    </div>
                )}

                {error && !isModalOpen && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span>{error}</span>
                        <button
                            onClick={() => {
                                setError("");
                                void fetchCategories();
                            }}
                            className="font-semibold"
                        >
                            Coba lagi
                        </button>
                    </div>
                )}

                {/* Summary Cards */}
                <section className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                Total Kategori
                            </p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                                ▦
                            </div>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">
                            {loading ? "—" : categories.length}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Seluruh kategori terdaftar
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                Kategori Aktif
                            </p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                                ✓
                            </div>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">
                            {loading ? "—" : activeCount}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Dapat dipilih mahasiswa
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                Kategori Nonaktif
                            </p>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-500">
                                —
                            </div>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">
                            {loading ? "—" : inactiveCount}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Tidak tersedia untuk pengajuan baru
                        </p>
                    </div>
                </section>

                {/* Category Table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Daftar Kategori
                                </h2>
                                {/* <p className="mt-1 text-sm text-slate-500">
                                    Informasi dan pengaturan kategori pembiayaan.
                                </p> */}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari kategori..."
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-56"
                                />

                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Batas Maksimal</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-16 text-center text-slate-400"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
                                                Memuat data kategori...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <tr
                                            key={category.id}
                                            className="transition hover:bg-blue-50/30"
                                        >
                                            <td className="px-6 py-5">
                                                <p className="font-semibold text-slate-800">
                                                    {category.name}
                                                </p>
                                                <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
                                                    {category.description}
                                                </p>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="font-semibold text-slate-800">
                                                    {formatRupiah(category.maxAmount)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        category.isActive
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            category.isActive
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-400"
                                                        }`}
                                                    />
                                                    {category.isActive
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        disabled={actionId === category.id}
                                                        onClick={() =>
                                                            void handleToggleStatus(category)
                                                        }
                                                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                                                            category.isActive
                                                                ? "text-rose-600 hover:bg-rose-50"
                                                                : "text-emerald-600 hover:bg-emerald-50"
                                                        }`}
                                                    >
                                                        {actionId === category.id
                                                            ? "Memproses..."
                                                            : category.isActive
                                                              ? "Nonaktifkan"
                                                              : "Aktifkan"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                                                    ▦
                                                </div>
                                                <p className="mt-4 font-semibold text-slate-700">
                                                    Kategori tidak ditemukan
                                                </p>
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Coba ubah kata pencarian atau filter.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:flex-row">
                        <span>
                            Menampilkan {filteredCategories.length} dari {categories.length} kategori
                        </span>
                        {/* <button
                            onClick={() => void fetchCategories()}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Muat ulang data
                        </button> */}
                    </div>
                </section>
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
                    onClick={resetForm}
                >
                    <div
                        className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingId !== null
                                        ? "Edit Kategori"
                                        : "Tambah Kategori"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Lengkapi informasi kategori pembiayaan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: UKT"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Jelaskan tujuan kategori pembiayaan..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Batas Maksimal Pembiayaan
                                </label>
                                <div className="flex overflow-hidden rounded-xl border border-slate-200 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                                    <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-500">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        placeholder="10000000"
                                        className="w-full px-4 py-3 text-sm outline-none"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Masukkan nominal maksimal dalam rupiah.
                                </p>
                            </div>

                            {error && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Menyimpan..."
                                        : editingId !== null
                                          ? "Simpan Perubahan"
                                          : "Tambah Kategori"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
