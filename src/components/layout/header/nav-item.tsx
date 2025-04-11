import Link from "next/link";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ChevronDownIcon } from "lucide-react";

type NavItemProps = {
  item: {
    name: string;
    link?: string;
    menu?: {
      name: string;
      link: string;
      description?: string;
    }[];
    description?: string;
  };
  isDesktop?: boolean;
};

const NavItem = ({ item, isDesktop }: NavItemProps) => {
  if (isDesktop) {
    return (
      <NavigationMenu>
        <NavigationMenuItem key={item.name}>
          {item.link ? (
            <NavigationMenuLink asChild>
              <Link
                href={item.link}
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                {item.name}
                {item.description && (
                  <span className="sr-only">{item.description}</span>
                )}
              </Link>
            </NavigationMenuLink>
          ) : item.menu ? (
            <>
              <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] p-2">
                  {item.menu.map((subItem, subIndex) => (
                    <NavigationMenuLink asChild key={subIndex}>
                      <Link
                        key={subIndex}
                        href={subItem.link}
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        prefetch={false}
                      >
                        <div className="text-sm font-medium leading-none group-hover:underline">
                          {subItem.name}
                        </div>
                        {subItem.description && (
                          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </>
          ) : null}
        </NavigationMenuItem>
      </NavigationMenu>
    );
  } else {
    return (
      <div>
        {item.link ? (
          <Link
            href={item.link}
            className="flex w-full items-center py-2 text-lg font-semibold"
            prefetch={false}
          >
            {item.name}
          </Link>
        ) : item.menu ? (
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center text-lg font-semibold">
              {item.name}
              <ChevronDownIcon
                className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-2 p-4">
                {item.menu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    className="group flex flex-col"
                  >
                    <span className="font-medium group-hover:underline">
                      {subItem.name}
                    </span>
                    {subItem.description && (
                      <span className="text-sm text-muted-foreground">
                        {subItem.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </div>
    );
  }
};

export default NavItem;
