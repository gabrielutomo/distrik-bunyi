export interface DeezerRelease {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  url: string;
  preview: string; // URL audio 30 detik
  type: string;
  genre: 'indie' | 'rap' | 'alternative';
}

const fetchGenre = async (query: string, genreName: 'indie' | 'rap' | 'alternative'): Promise<DeezerRelease[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=5`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.data) return [];

    const toHttps = (url: string) => url?.replace(/^http:\/\//i, 'https://') ?? url;

    return data.data
      .filter((track: any) => track.preview) // Hanya ambil yang ada suaranya
      .map((track: any) => ({
        id: track.id, // Gunakan ID Track unik, bukan ID Album
        title: track.title,
        artist: track.artist.name,
        imageUrl: toHttps(track.album.cover_xl || track.album.cover_big || track.album.cover),
        url: track.link,
        preview: toHttps(track.preview), // Force HTTPS agar tidak diblokir browser
        type: 'single',
        genre: genreName,
      }));
  } catch (err) {
    return [];
  }
};

export const getNewReleasesDeezer = async (): Promise<DeezerRelease[]> => {
  try {
    // Definisi spesifik artis per skena agar lagu 100% akurat sesuai genre
    const [indie, rap, alt] = await Promise.all([
      fetchGenre('artist:"Hindia" OR artist:"Nadin Amizah" OR artist:"Pamungkas"', 'indie'),
      fetchGenre('artist:"Poris" OR artist:"Rich Brian" OR artist:"Ramengvrl"', 'rap'),
      fetchGenre('artist:"Reality Club" OR artist:"The Adams" OR artist:"Barasuara"', 'alternative')
    ]);

    // Gabungkan lagu-lagu tersebut dan acak sedikit urutannya
    const allReleases = [...indie, ...rap, ...alt];

    // Membersihkan Duplikat berdasarkan ID (PENTING untuk fix Error 12/Key Error)
    const uniqueReleases = Array.from(new Map(allReleases.map(item => [item.id, item])).values());

    return uniqueReleases.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Deezer API Error:", error);
    return [];
  }
};
