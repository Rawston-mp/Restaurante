"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionOptions, SessionData } from "@/lib/session";

// ─── Auth ────────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const validation = loginSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, message: "Dados inválidos." };
  }

  const user = await prisma.user.findUnique({
    where: { email: validation.data.email },
  });

  if (!user) {
    return { success: false, message: "Credenciais inválidas." };
  }

  const passwordOk = await bcrypt.compare(
    validation.data.password,
    user.password_hash
  );
  if (!passwordOk) {
    return { success: false, message: "Credenciais inválidas." };
  }

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.userId = user.id;
  session.email = user.email;
  session.isLoggedIn = true;
  await session.save();

  redirect("/admin");
}

export async function logoutAction() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  session.destroy();
  redirect("/admin/login");
}

export async function getSession(): Promise<SessionData> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}

export async function isUserLoggedIn(): Promise<boolean> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session.isLoggedIn === true;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

export async function createCategory(formData: FormData): Promise<void> {
  const validation = categorySchema.safeParse({ name: formData.get("name") });
  if (!validation.success) return;
  await prisma.category.create({ data: { name: validation.data.name } });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

// ─── Change Password ─────────────────────────────────────────────────────────

export async function changePasswordAction(formData: FormData) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn || !session.userId) {
    return { success: false, message: "Não autorizado." };
  }

  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Preencha todos os campos." };
  }
  if (newPassword.length < 8) {
    return { success: false, message: "A nova senha deve ter pelo menos 8 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, message: "As senhas não coincidem." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { success: false, message: "Usuário não encontrado." };

  const ok = await bcrypt.compare(currentPassword, user.password_hash);
  if (!ok) return { success: false, message: "Senha atual incorreta." };

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password_hash: hash } });

  return { success: true, message: "Senha alterada com sucesso!" };
}

// ─── Menu Items ──────────────────────────────────────────────────────────────

// Aceita URL completa (https://...) ou caminho local (/uploads/...)
const imageUrlField = z
  .string()
  .refine(
    (v) => v === "" || v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
    "URL ou caminho de imagem inválido"
  )
  .optional()
  .or(z.literal(""))
  .transform((v) => (!v || v === "" ? undefined : v));

const menuItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Preço deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  image_url: imageUrlField,
  is_active: z.coerce.boolean().optional().default(true),
});

export async function getMenuItems() {
  return prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveMenuGrouped() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { is_active: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function createMenuItem(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    image_url: formData.get("image_url"),
    is_active: formData.get("is_active") === "on",
  };
  const validation = menuItemSchema.safeParse(raw);
  if (!validation.success) return;
  await prisma.menuItem.create({
    data: {
      name: validation.data.name,
      description: validation.data.description,
      price: validation.data.price,
      categoryId: validation.data.categoryId,
      image_url: validation.data.image_url ?? null,
      is_active: validation.data.is_active,
    },
  });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

export async function updateMenuItemActive(id: string, is_active: boolean) {
  await prisma.menuItem.update({ where: { id }, data: { is_active } });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

export async function updateMenuItem(id: string, formData: FormData): Promise<void> {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    image_url: formData.get("image_url"),
    is_active: formData.get("is_active") === "on",
  };
  const validation = menuItemSchema.safeParse(raw);
  if (!validation.success) return;
  await prisma.menuItem.update({
    where: { id },
    data: {
      name: validation.data.name,
      description: validation.data.description ?? null,
      price: validation.data.price,
      categoryId: validation.data.categoryId,
      image_url: validation.data.image_url ?? null,
      is_active: validation.data.is_active,
    },
  });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function getGallery() {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
}

const gallerySchema = z.object({
  image_url: z
    .string()
    .refine(
      (v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
      "URL ou caminho de imagem inválido"
    ),
  alt_text: z.string().optional(),
});

export async function createGalleryItem(formData: FormData) {
  const raw = {
    image_url: formData.get("image_url"),
    alt_text: formData.get("alt_text"),
  };
  const validation = gallerySchema.safeParse(raw);
  if (!validation.success) return;
  await prisma.gallery.create({
    data: {
      image_url: validation.data.image_url,
      alt_text: validation.data.alt_text ?? null,
    },
  });
  revalidatePath("/admin/fotos");
  revalidatePath("/fotos");
}

export async function deleteGalleryItem(id: string) {
  await prisma.gallery.delete({ where: { id } });
  revalidatePath("/admin/fotos");
  revalidatePath("/fotos");
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSetting(key: string): Promise<string | null> {
  const s = await prisma.settings.findUnique({ where: { key } });
  return s?.value ?? null;
}

export async function getAllSettings() {
  const rows = await prisma.settings.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function upsertSettings(formData: FormData) {
  const keys = [
    "telefone",
    "whatsapp",
    "endereco",
    "horarios",
    "instagram",
    "foto_estabelecimento",
    "maps_url",
  ];
  for (const key of keys) {
    const value = (formData.get(key) as string) ?? "";
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  revalidatePath("/horarios");
  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
}

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [menuCount, galleryCount, categoryCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.gallery.count(),
    prisma.category.count(),
  ]);
  return { menuCount, galleryCount, categoryCount };
}
