import { ReactNode } from "react";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import MainLayout from "./MainLayout";

async function getSessionData(): Promise<boolean> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session.isLoggedIn === true;
}

export default async function MainLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const isLoggedIn = await getSessionData();

  return <MainLayout isLoggedIn={isLoggedIn}>{children}</MainLayout>;
}
