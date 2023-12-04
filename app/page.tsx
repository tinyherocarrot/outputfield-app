import Script from 'next/script';
import Image from 'next/image';

import MainNav from '@/components/main-nav';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { getArtistsData } from '@/utils/get-artists';

export default async function Home() {
  const artists = await getArtistsData();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <div>
          {artists?.map((artist, i, arr) => (
            <HoverCard key={artist.id}>
              <HoverCardTrigger className="text-[50px]">
                <span className="hover:underline">{artist.name}</span>
                {(i + 1) !== arr.length ? ', ': '.'}
              </HoverCardTrigger>
              <HoverCardContent>
                <Image
                  src={`/${artist.preview}`}
                  alt={`preview image of ${artist.name}'s website`}
                  width="200"
                  height="150"
                />
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </main>
      <Script
        defer
        id="googlemaps"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
        type="text/javascript"
      /> 
    </>
  )
}
