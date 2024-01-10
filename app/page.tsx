import * as React from "react"

import MainNav from '@/components/main-nav';
import { getArtistsData } from '@/utils/get-artists';
import { ArtistListContainer } from "@/components/artist-list-container";
import { CustomDragLayer } from "@/components/custom-drag-layer";
import { Artist } from "@/ts/interfaces/artist.interfaces";
import { initAdmin } from "@/lib/firebase/firebase-admin";
import { getArtists } from "@/lib/firebase/firestore";

export default async function Home() {
  // await initAdmin()
  // const artists = await getArtistsData() as Artist[];
  const firebaseArtists = await getArtists() as Artist[];
  console.log(firebaseArtists)

  return (
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <ArtistListContainer artists={firebaseArtists} />
        <CustomDragLayer />
      </main>
  )
}
