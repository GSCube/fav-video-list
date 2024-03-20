This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview

### Why this stack?

1. Next.js - I don't have much experience with Next.js, so I want to learn more about it, it's also easy to deploy. I
   didn't
   spend much time though on what component could be rendered on the server I went with client side.
2. NextAuth.js - Looks like a good library for authentication with a lot of providers, so it was interesting to try it
   out, as it's look like popular library for next.js. I had some difficulties messy docs and examples.
3. React query - I'm familiar with this library to went with it and they have great docs, first I tried SWR that was
   recommended by Next team, but docs are not as good as react-query and didn't want spend much time on it. It's also
   easy to do polling so user can see updates in real time.

Maybe that was ambitious stack for couple days, but I wanted to learn more about those libraries. :)

### Challenges

1. I burned all my available free tier for google api, so needed to create second project there :)
2. Struggling with youtube api as I didn't use it for a long time, for some reason deleting (or adding) video from
   playlist will
   give success response from YT BE but video is still there sometimes, so I needed to do polling to update list.
3. NextAuth.js - I had some difficulties with types for that library

### Improvements to be made (if I had more time)

1. Fetch views count per video (I see there is a way to do it with YT API, but I didn't have time to do it) probably
   with GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id=VIDEO_ID1,VIDEO_ID2&key=YOUR_API_KEY and
   later merging data
2. I would like to add more tests, but I didn't have much time to do it, as still some AC parts are missing. Adding e2e
   tests with cypress or playwright would require to have some fun with google logging in :)
3. Delete all works on single page, but it's possible to extend it to all videos by fetching all ids before delete, not
   sure if api returns it all or need to do some while loop beforehand
4. Pagination could be improved when deleting last page of videos.

### Disclaimer

1. Some edge case errors can happen :) But for POC I guess it's fine.
2. There can be still (a bit) of the mess it the code.
3. App is not pretty, so don't burn your eyes (I recently prefer to go with ant design but used mui as in requirements)

### How to test it?

Link to deployed app: https://fav-video-list.vercel.app
To login you can use **google account**, but I need to add your email to the list of allowed users, so please let me know
what email you want to use if you are eager to test it. Good luck and have fun!

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in the values with command bellow:

```bash
cp .env.local.example .env.local
```

2. Add your google client id and secret to `.env.local` file.
3. generate AUTH_SECRET with command

```bash
openssl rand -base64 32
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
