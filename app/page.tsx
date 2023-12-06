import MainNav from '@/components/main-nav';
import { getArtistsData } from '@/utils/get-artists';
import ArtistList from '@/components/artist-list';

export default async function Home() {
  const artists = await getArtistsData();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <ArtistList data={artists} />      
      </main>
    </>
  )
}
