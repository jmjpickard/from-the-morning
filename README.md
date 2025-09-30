# From The Morning

A Spotify-integrated music blog platform built with the [T3 Stack](https://create.t3.gg/).

## Features

- **Spotify Integration**: Full Spotify playback controls with Web Playback SDK
- **In-Browser Playback**: Play music directly in your browser on any device (phone, laptop, tablet)
- **Blog Platform**: Create and share music-related blog posts
- **User Authentication**: Secure OAuth authentication with Spotify

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)

## Prerequisites

- **Spotify Premium Account**: Required for Web Playback SDK features
- **Spotify Developer App**: Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- **Environment Variables**: Configure OAuth credentials (see `.env.example`)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database:
   ```bash
   npx prisma migrate dev
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Spotify Integration

This app uses Spotify's Web Playback SDK to enable music playback directly in your browser:

- **No separate app required**: Play music on the device you're browsing from
- **Works everywhere**: Phone, laptop, tablet - any device with a modern browser
- **Seamless controls**: Full playback controls including play, pause, skip, volume, shuffle, and repeat
- **Device switching**: Easily switch between browser playback and external Spotify devices

For more details, see [WEB_PLAYBACK_IMPLEMENTATION.md](./WEB_PLAYBACK_IMPLEMENTATION.md)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
