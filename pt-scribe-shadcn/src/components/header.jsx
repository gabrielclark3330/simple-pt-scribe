import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package2, Menu, Search, CircleUser, Mic, FileText, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import PTScribeLogo from "@/src/assets/ptscribefull.png";

const Header = ({currentPage}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/app/login');
  };
  const navItems = [
    { to: "/app/record", label: "Record", className: currentPage === "record" ? "text-foreground" : "text-muted-foreground" },
    { to: "/app/notes", label: "Notes", className: currentPage === "notes" ? "text-foreground" : "text-muted-foreground" },
    { to: "/app/patients", label: "Patients", className: currentPage === "patients" ? "text-foreground" : "text-muted-foreground" },
    { to: "/app/calendar", label: "Calendar", className: currentPage === "calendar" ? "text-foreground" : "text-muted-foreground" },
  ];

  const renderNavItems = (isMobile = false) => (
    <>
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className={`${item.className} transition-colors hover:text-foreground ${isMobile ? '' : 'md:text-sm'}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <img
            src={PTScribeLogo}
            className="h-8"
            alt="PT-Scribe Logo"
          />
        </Link>
        {renderNavItems()}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <img
                src={PTScribeLogo}
                className="h-8"
                alt="PT-Scribe Logo"
              />
            </Link>
            {renderNavItems(true)}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;