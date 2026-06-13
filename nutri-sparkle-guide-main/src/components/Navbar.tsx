import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          🥗 NutriGuide
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Navigation buttons removed - no authentication needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
