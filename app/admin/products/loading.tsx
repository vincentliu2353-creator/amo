import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { SectionContainer } from "@/components/ui/SectionContainer";

export default function AdminProductsLoading() {
  return (
    <InnerPageShell showHeader>
      <section className="bg-white">
        <SectionContainer className="py-20 md:py-28">
          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="grid min-h-[72vh] lg:grid-cols-[17rem_minmax(0,1fr)]">
              <div className="bg-black p-8">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-white/12" />
                  <div className="h-10 w-36 animate-pulse rounded-full bg-white/12" />
                </div>
              </div>
              <div className="bg-[#fbfaf7] p-8">
                <div className="space-y-4">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-black/8" />
                  <div className="h-14 w-full max-w-xl animate-pulse rounded-[1.5rem] bg-black/8" />
                  <div className="h-6 w-full max-w-2xl animate-pulse rounded-full bg-black/6" />
                </div>

                <div className="mt-10 grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="h-48 animate-pulse rounded-[1.75rem] bg-black/6" />
                    <div className="h-[32rem] animate-pulse rounded-[1.75rem] bg-black/6" />
                  </div>
                  <div className="h-[48rem] animate-pulse rounded-[1.75rem] bg-black/6" />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </InnerPageShell>
  );
}
