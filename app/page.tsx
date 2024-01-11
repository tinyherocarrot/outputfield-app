import * as React from "react"

import MainNav from '@/components/main-nav';
import { ArtistListContainer } from "@/components/artist-list-container";
import { CustomDragLayer } from "@/components/custom-drag-layer";
import { Artist } from "@/ts/interfaces/artist.interfaces";
import { getArtists } from "@/lib/firebase/firestore";

export default async function Home() {
  const Artists = await getArtists() as Artist[];

  return (
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <ArtistListContainer artists={Artists} />
        <CustomDragLayer />
      </main>
  )
}
