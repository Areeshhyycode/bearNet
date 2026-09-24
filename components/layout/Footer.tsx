export function Footer() {
  return (
    <footer className="mt-auto w-full bg-surface-container-low py-space-lg shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-space-sm px-margin-mobile sm:flex-row sm:px-margin">
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-[16px] font-semibold text-on-surface">
            BearNet
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            • Cozy Cyber Defense Sanctuary
          </span>
        </div>
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant sm:text-right">
          © 2025 BearNet Learning Systems. Study cozy, defend safely.
        </p>
      </div>
    </footer>
  );
}
