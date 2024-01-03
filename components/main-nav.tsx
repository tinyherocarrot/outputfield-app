"use client"

import {
    NavigationMenu,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import useScroll from "@/lib/hooks/useScroll";
import Link from "next/link"

export default function MainNav() {
    const { isScrollingDown } = useScroll()

    return(
        <nav className={`
            flex 
            w-full 
            justify-between 
            mb-12 
            sticky
            transition-top
            delay-150
            duration-300
            ${isScrollingDown ? '-top-[50px]' : 'top-8'}
        `}>
            <h1>Output Field</h1>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/info" legacyBehavior passHref>
                            <NavigationMenuLink
                                className="py-2 px-4"
                            >
                                INFO
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/nominate" legacyBehavior passHref>
                            <NavigationMenuLink
                                className="py-2 px-4"
                            >
                                NOMINATE
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="py-2 px-4">
                        <a href="">DISCORD</a>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="py-2 px-4">
                            <a href="">IG</a>
                    </NavigationMenuItem>
                    <NavigationMenuIndicator className="NavigationMenuIndicator" />
                </NavigationMenuList>
                <NavigationMenuViewport />
            </NavigationMenu>
        </nav>
    )
}