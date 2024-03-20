import { Video } from '@/components/Table';
import { YoutubeVideo } from '@/data/types';

export const prepareDataForYTVideos = (video: YoutubeVideo): Video => {
  return ({
    playlistElementId: video.id,
    videoId: video.snippet.resourceId.videoId,
    title: video.snippet.title,
    viewCount: video.views,
    dateAdded: video.snippet.publishedAt,
    thumbnail: video.snippet.thumbnails.default.url,
  });
};
