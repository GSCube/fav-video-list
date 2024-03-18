import {Video} from "@/components/Table";
import {YoutubeVideo} from "@/components/FavouriteMoviesList/types";

export const formatYoutubePlaylist = (video: YoutubeVideo): Video => ({
  playlistElementId: video.id,
  videoId: video.snippet.resourceId.videoId,
  title: video.snippet.title,
  watchCount: 0,
  dateAdded: video.snippet.publishedAt,
  thumbnail: video.snippet.thumbnails.default.url,
})
