import { Suspense } from "react";
import CityPlanClient from "./CityPlanClient";

export default async function CityPlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#4F8EF7]/30 border-t-[#4F8EF7] animate-spin" />
        </div>
      }
    >
      <CityPlanClient slug={slug} />
    </Suspense>
  );
}
