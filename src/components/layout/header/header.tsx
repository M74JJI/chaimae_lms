import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { DialogTitle } from "@/components/ui/dialog";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MenuIcon, NextIcon } from "@/components/icons";
import { links } from "@/data/navigation-links";

import NavItem from "./nav-item";

const Header = () => {
  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6 border-b">
      {/* Mobile Menu Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <DialogTitle>
            <Link href="/" prefetch={false}>
              <NextIcon />
            </Link>
          </DialogTitle>
          <Link href="#" prefetch={false} className="hidden">
            <NextIcon />
          </Link>
          <div className="grid gap-2 py-6">
            {links.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Menu */}
      <NavigationMenu className="hidden lg:flex">
        <Link href="/" className="mr-6 hidden lg:flex" prefetch={false}>
          <NextIcon />
        </Link>
        <NavigationMenuList>
          {links.map((item, index) => (
            <NavItem key={index} item={item} isDesktop={true} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Authentication & Theme Toggle */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <Link href="/auth/signin">
            <Button>Sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline">Sign up</Button>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
