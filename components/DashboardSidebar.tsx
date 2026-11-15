
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

type DashboardSidebarProps = {
  portal: "student" | "admin";
  menuItems: MenuItem[];
  activePath: string;
};

export default function DashboardSidebar({
  portal,
  menuItems,
  activePath,
}: DashboardSidebarProps) {
  const isAdmin = portal === "admin";

  return (
    <aside
      className={`fixed hidden h-screen w-64 p-6 shadow-sm md:block ${
        isAdmin ? "bg-slate-900 text-white" : "bg-white"
      }`}
    >
      <h1 className="text-2xl font-bold text-blue-600">
        CampusCash
      </h1>

      <p className="mb-8 mt-2 text-xs text-slate-400">
        {isAdmin ? "ADMIN PORTAL" : "STUDENT PORTAL"}
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = item.href === activePath;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-sm ${
                isActive
                  ? "bg-blue-600 font-semibold text-white"
                  : isAdmin
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/login"
        className={`absolute bottom-8 left-6 text-sm ${
          isAdmin ? "text-red-400" : "text-red-500"
        }`}
      >
        Keluar
      </Link>
    </aside>
  );
}
