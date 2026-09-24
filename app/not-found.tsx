import { PageContainer } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { BearMascot } from "@/components/bears/BearMascot";

export default function NotFound() {
  return (
    <PageContainer className="min-h-[60vh] items-center justify-center text-center">
      <div className="flex flex-col items-center gap-space-md">
        <BearMascot variant="polar" size={140} animated />
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          🐻‍❄️ This page went offline
        </h1>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          Polar traced the route and the destination host is unreachable. Let us
          get you back to somewhere cozy.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <Button variant="primary" href="/">
            Back to My Learning Hub
          </Button>
          <Button variant="outline" href="/notes">
            Open my notes
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
