import { Container } from "@/components/ui/container";

export function ProductDetailLoadingShell() {
  return (
    <main className="relative z-10">
      <section data-header-theme="dark" className="bg-black text-white">
        <Container className="grid min-h-screen items-end gap-10 py-24 sm:py-28 lg:grid-cols-[0.74fr_1.26fr] lg:items-center lg:py-20">
          <div>
            <div className="h-3 w-28 animate-pulse rounded-full bg-white/12" />
            <div className="mt-8 h-3 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-24 max-w-2xl animate-pulse rounded-[2rem] bg-white/8 sm:h-32" />
            <div className="mt-6 h-6 w-full max-w-xl animate-pulse rounded-full bg-white/8" />
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="h-11 w-36 animate-pulse rounded-full bg-white/10" />
              <div className="h-11 w-36 animate-pulse rounded-full bg-white/8" />
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="h-24 animate-pulse rounded-[22px] bg-white/[0.06]" />
              <div className="h-24 animate-pulse rounded-[22px] bg-white/[0.06]" />
              <div className="h-24 animate-pulse rounded-[22px] bg-white/[0.06]" />
            </div>
          </div>

          <div className="flex min-h-[42svh] items-end justify-center sm:min-h-[52svh] lg:min-h-[82vh] lg:justify-end">
            <div className="h-[54svh] w-[32rem] max-w-full animate-pulse rounded-[3rem] bg-white/[0.06] sm:h-[62svh] lg:h-[84vh] lg:w-[46rem]" />
          </div>
        </Container>
      </section>

      <section data-header-theme="light" className="bg-white py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="mx-auto h-24 max-w-5xl animate-pulse rounded-[2rem] bg-black/[0.05] sm:h-32" />
        </Container>
      </section>

      <section data-header-theme="dark" className="bg-black py-20 sm:py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div className="h-48 animate-pulse rounded-[2rem] bg-white/[0.06]" />
          <div className="h-[42svh] animate-pulse rounded-[3rem] bg-white/[0.06] sm:h-[56svh] lg:h-[78vh]" />
        </Container>
      </section>

      <section data-header-theme="light" className="bg-white py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="h-[28rem] animate-pulse rounded-[2rem] bg-black/[0.05]" />
        </Container>
      </section>
    </main>
  );
}
