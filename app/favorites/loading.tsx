import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { SectionContainer } from "@/components/ui/SectionContainer";

export default function FavoritesLoading() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-white">
        <SectionContainer className="py-20 md:py-28">
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="h-4 w-28 animate-pulse rounded-full bg-black/8" />
              <div className="h-16 w-full max-w-2xl animate-pulse rounded-[1.5rem] bg-black/8" />
              <div className="h-6 w-full max-w-xl animate-pulse rounded-full bg-black/6" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[28rem] animate-pulse rounded-[2rem] bg-black/6" />
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>
    </InnerPageShell>
  );
}
