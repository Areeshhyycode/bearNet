/** Auth pages opt out of the app chrome — no navbar, no footer. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
