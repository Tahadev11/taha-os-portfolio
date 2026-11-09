
import AdminEditProjectForm from "@/components/AdminEditProjectForm";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const instant = false;

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  return <AdminEditProjectForm projectId={id} />;
}
