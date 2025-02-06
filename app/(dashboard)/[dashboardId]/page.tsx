
export default function Home() {
  return (
    <main className="px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">
            Morining, Issam!
          </h1>
          <p className="text-xs text-muted-foreground">
            Here&apos;s what&apos;s happening with your inventory today.
          </p>
        </div>
        <div>
          filter
        </div>
      </div>
    </main>
  );
}
