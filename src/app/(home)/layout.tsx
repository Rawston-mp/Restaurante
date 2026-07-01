import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <MainLayoutWrapper>{children}</MainLayoutWrapper>;
}
