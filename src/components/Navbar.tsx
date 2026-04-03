import skilljobLogo from "@/assets/skilljob-logo.png";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img src={skilljobLogo} alt="Skilljob" className="h-14 w-auto" />
        </a>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            How It Works
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            For Employers
          </a>
          <button className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:brightness-110 transition-all">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
