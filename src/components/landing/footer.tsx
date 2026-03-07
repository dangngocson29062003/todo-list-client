export default function Footer() {
  return (
    <footer className="border-t mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-start gap-2">
            <img
              src="/images/logo.png"
              alt="Weaver Logo"
              className="w-[16px] h-[16px] md:w-[32px] md:h-[32px]"
            />
            <h3 className="text-2xl font-semibold ">Weaver</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Build, collaborate and manage projects with your team.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Weaver. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
