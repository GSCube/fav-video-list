"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React, {useEffect, useState} from "react";
import { Typography, Button } from '@mui/material';
import {Video, VideoTable} from './Table';
import {Modal} from "@mui/material";
import {Box} from "@mui/system";
import YouTube from "react-youtube";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
};

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
            Authorization: `Bearer ${accessToken ||tempToken}`,
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
    const [favorites, setFavorites] = useState([]);
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/')
        }
    })

    const handleClose = () =>{
        console.log('close')
        setOpen(false);
    }
    // @ts-ignore
    console.log('session in component', session)
    // console.log('session', session?.token?.token?.account?.access_token)
    // @ts-ignore
    const { accessToken } = session || {}


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

    const ytVideos: Video[]  = favorites?.map((favorite) => ({
        // @ts-ignore
        playlistElementId: favorite.id,
        // @ts-ignore
        videoId: favorite.snippet.resourceId.videoId,
        // @ts-ignore
        title: favorite.snippet.title,
        watchCount: 0,
        dateAdded: '2021-10-10',
        // @ts-ignore
        thumbnail: favorite.snippet.thumbnails.default.url,
    }))

    return (
        <section>
            <Typography variant="h3" component="h2">
                Favorites Movies list
            </Typography>


            {ytVideos && <VideoTable videos={ytVideos} onPlay={handlePlay} onDelete={handleVideoDelete} />}


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <YouTube
                        videoId={selectedVideoId}                  // defaults -> ''
                        // id={string}                       // defaults -> ''
                        // className={string}                // defaults -> ''
                        // iframeClassName={string}          // defaults -> ''
                        // style={object}                    // defaults -> {}
                        // title={string}                    // defaults -> ''
                        // loading={string}                  // defaults -> undefined
                        // opts={obj}                        // defaults -> {}
                        // onReady={func}                    // defaults -> noop
                        // onPlay={func}                     // defaults -> noop
                        // onPause={func}                    // defaults -> noop
                        // onEnd={func}                      // defaults -> noop
                        // onError={func}                    // defaults -> noop
                        // onStateChange={func}              // defaults -> noop
                        // onPlaybackRateChange={func}       // defaults -> noop
                        // onPlaybackQualityChange={func}    // defaults -> noop
                    />
                </Box>
            </Modal>
            <Button onClick={handleFetchFavorites}>get</Button>
        </section>
    )
}
