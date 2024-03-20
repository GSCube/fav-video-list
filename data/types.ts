export interface YTPlaylistItem {
  id: string;
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
    publishedAt: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export interface YTVideo {
  id: string;
  statistics: {
    viewCount: string;
  };
}

export interface FavVideosWithViewsResponse extends YTPlaylistItem {
  views: number;
}

export interface Video {
  playlistElementId: string;
  videoId: string;
  title: string;
  thumbnail: string;
  dateAdded: string;
  viewCount: number;
}
