import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { getDailyMenuSections, getCategories } from "@/actions/actions";
import CardapioDiarioPage from "./CardapioDiarioPage";

export default async function CardapioDiarioLayout() {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.userId) {
    redirect("/admin");
  }

  const [sections, categories] = await Promise.all([
    getDailyMenuSections(),
    getCategories(),
  ]);

  return <CardapioDiarioPage sections={sections} categories={categories} />;
}
