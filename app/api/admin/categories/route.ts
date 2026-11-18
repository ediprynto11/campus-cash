
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Mengambil seluruh kategori
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get("activeOnly") === "true";

        const categories = await prisma.loanCategory.findMany({
            where: activeOnly
                ? { isActive: true }
                : undefined,
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET categories error:", error);

        return NextResponse.json(
            { message: "Gagal mengambil data kategori" },
            { status: 500 }
        );
    }
}


// POST: Menambahkan kategori baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const maxAmount = String(body.maxAmount ?? "");

    if (!name || !description || !/^\d+(\.\d{1,2})?$/.test(maxAmount)) {
      return NextResponse.json(
        { message: "Data kategori tidak valid" },
        { status: 400 }
      );
    }

    if (maxAmount === "0" || Number(maxAmount) <= 0) {
      return NextResponse.json(
        { message: "Batas maksimal harus lebih dari nol" },
        { status: 400 }
      );
    }

    const category = await prisma.loanCategory.create({
      data: {
        name,
        description,
        maxAmount,
      },
    });

    return NextResponse.json(
      {
        message: "Kategori berhasil ditambahkan",
        data: category,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Nama kategori sudah digunakan" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan kategori" },
      { status: 500 }
    );
  }
}
