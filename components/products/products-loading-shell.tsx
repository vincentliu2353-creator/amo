export function ProductsLoadingShell() {
  return (
    <div className="pt-24 sm:pt-28">
      <section
        data-header-theme="light"
        className="flex min-h-[20rem] items-center justify-center bg-white px-4 sm:min-h-[24rem] sm:px-6 lg:min-h-[26rem] lg:px-8"
      >
        <div className="w-full max-w-5xl animate-pulse text-center">
          <div className="mx-auto h-4 w-28 rounded-full bg-black/8" />
          <div className="mx-auto mt-5 h-14 max-w-3xl rounded-[2rem] bg-black/8 sm:h-16" />
          <div className="mx-auto mt-3 h-14 max-w-2xl rounded-[2rem] bg-black/7 sm:h-16" />
          <div className="mx-auto mt-5 h-6 max-w-xl rounded-full bg-black/6" />
        </div>
      </section>

      <section data-header-theme="light" className="bg-white pb-14 sm:pb-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden p-2 sm:p-4 lg:p-8">
            <div className="grid min-h-[calc(100svh-12rem)] gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
              <div className="animate-pulse">
                <div className="h-4 w-20 rounded-full bg-black/8" />
                <div className="mt-5 h-4 w-24 rounded-full bg-black/8" />
                <div className="mt-3 h-14 max-w-md rounded-[1.75rem] bg-black/10 sm:h-16" />
                <div className="mt-4 h-10 max-w-sm rounded-[1.25rem] bg-black/7" />
                <div className="mt-5 border-t border-black/8 pt-1">
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 border-b border-black/8 py-2.5">
                        <div className="h-4 w-28 rounded-full bg-black/8" />
                        <div className="h-4 w-20 rounded-full bg-black/10" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-12 w-36 rounded-full bg-black/10" />
                  <div className="h-12 w-36 rounded-full bg-black/7" />
                  <div className="h-12 w-12 rounded-full bg-black/7" />
                </div>
              </div>

              <div className="relative flex min-h-[20rem] items-center justify-center sm:min-h-[24rem] lg:min-h-[32rem]">
                <div className="absolute bottom-[14%] h-12 w-[62%] rounded-full bg-black/10 blur-2xl" />
                <div className="h-[16rem] w-[16rem] animate-pulse rounded-[2rem] bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.96),rgba(212,212,212,0.38)_42%,rgba(17,17,17,0.06)_78%,rgba(17,17,17,0)_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.1)] sm:h-[20rem] sm:w-[20rem]" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex gap-1.5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-12 w-20 rounded-[0.85rem] bg-black/8" />
                ))}
              </div>
              <div className="hidden h-6 w-28 rounded-full bg-black/8 md:block" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
