import AdminDashboardLayout from "@/app/(dashboard)/layout";
import AnalysisPage from "@/app/(dashboard)/page";

export default function Home() {
  return (
    <AdminDashboardLayout>
      <AnalysisPage />
    </AdminDashboardLayout>
  );
}
