
import { Suspense } from "react";
import AdminCertificateForm from "@/components/AdminCertificateForm";

export const instant = false;

export default function EditCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="admin-certificate-form-loading">
          Loading certificate editor...
        </div>
      }
    >
      <AdminCertificateForm mode="edit" />
    </Suspense>
  );
}
