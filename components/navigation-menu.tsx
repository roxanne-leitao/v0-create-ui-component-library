"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavigationItem {
  label: string
  href: string
}

interface AppNavigationMenuProps {
  items: NavigationItem[]
  className?: string
}

export function AppNavigationMenu({ items, className }: AppNavigationMenuProps) {
  const pathname = usePathname()

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {items.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <NavigationMenuItem key={index}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), isActive && "bg-accent text-accent-foreground")}
                >
                  {item.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
