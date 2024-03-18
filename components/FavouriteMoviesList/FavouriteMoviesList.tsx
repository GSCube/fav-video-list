"use client"
import {useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import React, {useEffect, useState} from "react";
import {Typography, Button} from '@mui/material';
import {Video, VideoTable} from '../Table';
import {Modal} from "@mui/material";
import {Box} from "@mui/system";
import YouTube from "react-youtube";
import {modalStyle} from "@/components/FavouriteMoviesList/styles";
import {formatYoutubePlaylist} from "@/components/FavouriteMoviesList/utils";
import {YoutubeVideo} from "@/components/FavouriteMoviesList/types";


const deleteVideo = async (accessToken: string, id: string) => {
  if (!accessToken) {
    return
  }
  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?id=${id}`, {
    // const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true", {
    method: 'DELETE',

    headers: {
      // @ts-ignore
      Authorization: `Bearer ${accessToken}`,
      // Accept: "application/json",
    },
  });


  return response; // This will contain information about the user's favorite movies or videos
};


const fetchFavorites = async (accessToken: string) => {
  if (!accessToken) {
    return
  }
  const response = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=LL", {
    // const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true", {
    headers: {
      // @ts-ignore
      Authorization: `Bearer ${accessToken || tempToken}`,
      Accept: "application/json",
    },
  });

  const data = await response.json();
  console.log(data)
  return data.items; // This will contain information about the user's favorite movies or videos
};

export const FavouriteMoviesList = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedVideoId, setSelectedVideoId] = React.useState('');
  const [favorites, setFavorites] = useState<YoutubeVideo[]>([]);
  const {data: session} = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/')
    }
  })

  console.log('session in component', session)
  // console.log('session', session?.token?.token?.account?.access_token)

  // @ts-ignore
  const {accessToken} = session || {}


  const handleFetchFavorites = () => {
    fetchFavorites(accessToken).then((fav) => {
      console.log('fav', fav)
      setFavorites(fav)
    })
  }

  console.log('favorites', favorites)

  useEffect(() => {
    handleFetchFavorites()
  }, [accessToken]);

  const handleVideoDelete = async (id: string) => {
    await deleteVideo(accessToken, id)
    await fetchFavorites(accessToken).then((fav) => {
      console.log('fav', fav)
      setFavorites(fav)
    })
  }

  const handlePlay = (id: string) => {
    setSelectedVideoId(id)
    setOpen(true)
  }

  console.log('favorites', favorites)

  const ytVideos: Video[] = favorites?.map(formatYoutubePlaylist)

  return (
    <section>
      <Typography variant="h3" component="h2">
        Favorites Movies list
      </Typography>


      {ytVideos && <VideoTable videos={ytVideos} onPlay={handlePlay} onDelete={handleVideoDelete}/>}


      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <YouTube
            videoId={selectedVideoId}
          />
        </Box>
      </Modal>
      <Button onClick={handleFetchFavorites}>get</Button>
    </section>
  )
}
