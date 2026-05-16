import { getNewReleasesDeezer } from '@/lib/deezer';
import { getArticles, getWeeklyReleases, getUnderratedAlbums } from '@/lib/queries';
import HomeClient from '@/components/HomeClient';

export default async function Page() {
  // Fetch semua data secara paralel
  const [deezerReleases, articles, weeklyReleases, underratedAlbums] = await Promise.all([
    getNewReleasesDeezer(),
    getArticles(),
    getWeeklyReleases(),
    getUnderratedAlbums(),
  ]);

  return (
    <HomeClient
      deezerReleases={deezerReleases}
      articles={articles}
      weeklyReleases={weeklyReleases}
      underratedAlbums={underratedAlbums}
    />
  );
}
