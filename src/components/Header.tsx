
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";
import { School, BookOpen, BookText, Video, Link2, Wrench } from 'lucide-react';
import MobileMenu from "@/components/MobileMenu";

const Header = () => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <MobileMenu />
          <Link to="/" className="flex items-center text-2xl font-bold text-primary hover-scale">
            <School className="h-8 w-8 mr-2 text-primary" />
            <span className="hidden md:inline">EduPercentage</span>
          </Link>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Αρχική
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Εξερεύνηση</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/resources"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          Εκπαιδευτικοί Πόροι
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Ανακαλύψτε εκπαιδευτικό υλικό, βιβλία και άρθρα για όλα τα μαθήματα
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/subject/mathematics" title="Μαθηματικά">
                    Ασκήσεις, τεστ και θεωρία
                  </ListItem>
                  <ListItem href="/subject/physics" title="Φυσική">
                    Πειράματα και προσομοιώσεις
                  </ListItem>
                  <ListItem href="/resources" title="Εκπαιδευτικοί Πόροι">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Βιβλία
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <BookText className="h-4 w-4" />
                      Σημειώσεις
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Video className="h-4 w-4" />
                      Βίντεο
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Link2 className="h-4 w-4" />
                      Χρήσιμοι σύνδεσμοι
                    </div>
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about" className={navigationMenuTriggerStyle()}>
                  Σχετικά
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {isAuthenticated && (isTeacher || isAdmin) && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/add-content" className={navigationMenuTriggerStyle()}>
                    Προσθήκη Υλικού
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/it-support-login" className={navigationMenuTriggerStyle()}>
                  <div className="flex items-center">
                    <Wrench className="h-4 w-4 mr-1" />
                    IT Support
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex gap-4 items-center">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
