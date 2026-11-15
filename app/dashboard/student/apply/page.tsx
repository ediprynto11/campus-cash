"use client";

import { useState } from "react";

const categories = [
    {
        id: "ukt",
        name: "Biaya UKT",
        description: "Bantuan pembayaran uang kuliah.",
        maxAmount: 10000000,
    },
    {
        id: "research",
        name: "Penelitian dan Skripsi",
        description: "Kebutuhan penelitian dan penyusunan skripsi.",
        maxAmount: 5000000,
    },
    {
        id: "academic",
        name: "Kebutuhan Akademik",
        description: "Buku, perangkat, dan kebutuhan pembelajaran.",
        maxAmount: 3000000,
    },
    {
        id: "graduation",
        name: "Biaya Wisuda",
        description: "Kebutuhan administrasi dan kelulusan.",
        maxAmount: 3000000,
    },
];

const tenors = [
    { months: 3, fee: 2 },
    { months: 6, fee: 4 },
    { months: 9, fee: 5 },
    { months: 12, fee: 7 },
];

const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);

export default function ApplyPage() {
    const [categoryId, setCategoryId] = useState("ukt");
    const [amount, setAmount] = useState(3000000);
    const [tenor, setTenor] = useState(6);
    const [purpose, setPurpose] = useState("");
    const [testCount, setTestCount] = useState(0);

    const selectedCategory = categories.find(
        (category) => category.id === categoryId
    )!;

    const selectedTenor = tenors.find(
        (item) => item.months === tenor
    )!;

    const feeAmount = amount * (selectedTenor.fee / 100);
    const totalAmount = amount + feeAmount;
    const installment = totalAmount / tenor;

    const isAmountValid =
        amount > 0 && amount <= selectedCategory.maxAmount;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isAmountValid) {
            alert("Nominal melebihi batas kategori pembiayaan.");
            return;
        }

        alert("Simulasi berhasil! Fitur penyimpanan pengajuan belum tersedia.");
    }

    return (
        <main className="relative z-10 min-h-screen bg-slate-100 p-6 md:p-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Ajukan Pembiayaan
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Pilih kebutuhan pendidikan dan lihat simulasi
                        kewajiban pembayaran sebelum mengajukan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-bold text-slate-800">
                            1. Pilih Kategori Pembiayaan
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setCategoryId(category.id)}
                                    className={`rounded-xl border p-5 text-left transition ${categoryId === category.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-slate-200 hover:border-blue-300"
                                        }`}
                                >
                                    <h3 className="font-semibold text-slate-800">
                                        {category.name}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {category.description}
                                    </p>
                                    <p className="mt-3 text-sm font-medium text-blue-700">
                                        Maksimal {formatRupiah(category.maxAmount)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-bold text-slate-800">
                            2. Detail Pengajuan
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nominal Pembiayaan
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(event) =>
                                        setAmount(Number(event.target.value))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Batas kategori: {formatRupiah(selectedCategory.maxAmount)}
                                </p>

                                {!isAmountValid && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Nominal harus lebih dari Rp0 dan tidak boleh
                                        melebihi batas kategori.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Tenor Pembayaran
                                </label>
                                <select
                                    value={tenor}
                                    onChange={(event) =>
                                        setTenor(Number(event.target.value))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                >
                                    {tenors.map((item) => (
                                        <option key={item.months} value={item.months}>
                                            {item.months} Bulan - Biaya Layanan {item.fee}%
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Tujuan Pengajuan
                                </label>
                                <textarea
                                    value={purpose}
                                    onChange={(event) => setPurpose(event.target.value)}
                                    rows={4}
                                    placeholder="Jelaskan kebutuhan pembiayaan pendidikanmu..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-bold text-slate-800">
                            3. Simulasi Pembayaran
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                    Pokok Pembiayaan
                                </span>
                                <span className="font-medium">
                                    {formatRupiah(amount)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                    Biaya Layanan ({selectedTenor.fee}%)
                                </span>
                                <span className="font-medium">
                                    {formatRupiah(feeAmount)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">
                                    Tenor
                                </span>
                                <span className="font-medium">
                                    {tenor} Bulan
                                </span>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <div className="flex justify-between gap-4">
                                    <span className="font-semibold text-slate-800">
                                        Total Pembayaran
                                    </span>
                                    <span className="font-bold text-blue-700">
                                        {formatRupiah(totalAmount)}
                                    </span>
                                </div>

                                <div className="mt-3 flex justify-between gap-4">
                                    <span className="font-semibold text-slate-800">
                                        Cicilan per Bulan
                                    </span>
                                    <span className="font-bold text-blue-700">
                                        {formatRupiah(installment)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-5 text-xs text-slate-500">
                            Simulasi menggunakan biaya layanan flat satu kali
                            berdasarkan pokok pembiayaan. Nilai ini masih berupa
                            konfigurasi contoh untuk prototype.
                        </p>
                    </section>

                    <button
                        type="submit"
                        disabled={!isAmountValid || !purpose.trim()}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        Kirim Pengajuan
                    </button>
                </form>
            </div>
        </main>
    );
}
