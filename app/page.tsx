import { getNewReleasesDeezer } from '@/lib/deezer';
import HomeClient from '@/components/HomeClient';

export default async function Page() {
  // Fetch data dari Deezer di server-side 
  const deezerReleases = await getNewReleasesDeezer();

  return <HomeClient deezerReleases={deezerReleases} />;
}

