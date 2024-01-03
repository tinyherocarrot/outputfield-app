import * as React from "react"

import MainNav from '@/components/main-nav';
import { getArtistsData } from '@/utils/get-artists';
import { ArtistListContainer } from "@/components/artist-list-container";
import { CustomDragLayer } from "@/components/custom-drag-layer";
import { Artist } from "@/ts/interfaces/artist.interfaces";

export default async function Home() {
  const artists = await getArtistsData() as Artist[];

  return (
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <ArtistListContainer artists={artists} />
        <CustomDragLayer />
      </main>
  )
}
