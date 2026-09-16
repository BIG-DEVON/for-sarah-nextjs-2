# Happy Birthday My Darling Bubbles — Next.js edition

Open this folder in VS Code, then run:

```bash
npm run dev
```

The site appears at `http://localhost:4173`.

## Deploy on Vercel

Push this folder to GitHub and import that repository in Vercel. Vercel will
detect Next.js automatically; leave the framework preset, build command, and
output settings on their defaults. This project does not need environment
variables or a database.

You can also deploy from the VS Code terminal with the Vercel CLI if you
already use it. The production build is `npm run build`.

## Sarah's photographs

The five supplied photographs are already installed in `public/photos` as
`01.jpg` through `05.jpg`. The gallery is fully wired and Vercel will include
them automatically.

The three saved mirror photographs in `public/writing` replace the original
writing-card placeholders.

The privacy-safe origin-chat image is in `public/story`, the custom birthday
cake is in `public/cake`, and Ade's original song is in `public/audio/Ade1.m4a`.
The opening sound seal is intentional: browsers require one tap before they
will play music with sound.

Edit photo labels, focal positions, alt text, the sonnet, flow, and bestowed titles in `app/content.ts`.
The complete visual system and animation choreography live in `app/page.tsx` and `app/globals.css`.
