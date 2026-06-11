import { redirect } from "next/navigation";

import { requireAdminPageSession } from "@/lib/admin/auth";

export default async function AdminProductUploadPage() {
  await requireAdminPageSession("/admin/product-upload");
  redirect("/admin/products/new");
}
