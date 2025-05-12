import SideNav from "./side-nav"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-24 pt-12 container mx-auto">

      {/* nav */}
     <SideNav/>

      <div className="flex-1">{children}</div>

    </div>
  );
}
