
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// PATCH: Mengedit kategori atau mengubah status aktif
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { message: "ID kategori tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const data: {
      name?: string;
      description?: string;
      maxAmount?: string;
      isActive?: boolean;
    } = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { message: "Nama kategori tidak valid" },
          { status: 400 }
        );
      }
      data.name = body.name.trim();
    }

    if (body.description !== undefined) {
      if (
        typeof body.description !== "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          { message: "Deskripsi tidak valid" },
          { status: 400 }
        );
      }
      data.description = body.description.trim();
    }

    if (body.maxAmount !== undefined) {
      const amount = String(body.maxAmount);

      if (
        !/^\d+(\.\d{1,2})?$/.test(amount) ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) <= 0
      ) {
        return NextResponse.json(
          { message: "Batas maksimal tidak valid" },
          { status: 400 }
        );
      }

      data.maxAmount = amount;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { message: "Status kategori tidak valid" },
          { status: 400 }
        );
      }

      data.isActive = body.isActive;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data yang diubah" },
        { status: 400 }
      );
    }

    const category = await prisma.loanCategory.update({
      where: { id: categoryId },
      data,
    });

    return NextResponse.json({
      message: "Kategori berhasil diperbarui",
      data: category,
    });
  } catch (error: unknown) {
    console.error("PATCH category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

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
      { message: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

// DELETE: Menonaktifkan kategori, bukan menghapus permanen
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { message: "ID kategori tidak valid" },
        { status: 400 }
      );
    }

    const category = await prisma.loanCategory.update({
      where: { id: categoryId },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Kategori berhasil dinonaktifkan",
      data: category,
    });
  } catch (error: unknown) {
    console.error("DELETE category error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menonaktifkan kategori" },
      { status: 500 }
    );
  }
}
