import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { getDailyMenuSections, getCategories } from "@/actions/actions";
import CardapioDiarioClient from "./CardapioDiarioClient";

export default async function CardapioDiarioPage() {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.userId) {
    redirect("/admin");
  }

  const [sections, categories] = await Promise.all([
    getDailyMenuSections(),
    getCategories(),
  ]);

  return <CardapioDiarioClient sections={sections} categories={categories} />;
}
