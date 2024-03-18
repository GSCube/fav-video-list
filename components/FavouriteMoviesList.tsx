"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {useEffect, useState} from "react";
import { Typography } from '@mui/material';

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
    const [favorites, setFavorites] = useState([]);
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/')
        }
    })

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

    console.log('favorites', favorites)

    return (
        <section>
            <Typography variant="h3" component="h2">
                Favorites Movies list
            </Typography>
            {favorites?.map((favorite) => (
                // @ts-ignore
                <div key={favorite.id}>
                    {/*@ts-ignore*/}
                    <h2>{favorite.snippet.title}</h2>
                    {/*@ts-ignore*/}
                    <img src={favorite.snippet.thumbnails.default.url} alt={favorite.snippet.title} />
                    <button>Play</button>
                    {/*@ts-ignore*/}
                    <button onClick={() => handleVideoDelete(favorite.id)}>Remove</button>
                </div>
            ))}


            <button onClick={handleFetchFavorites}>get</button>
        </section>
    )
}
