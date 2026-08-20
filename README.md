# VIIZME

A dark, premium YouTube video archive built with Next.js.

## Run locally

Requirements:
- Node.js 18.17+ (Node 20 LTS recommended)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Add / edit videos

Edit:

`public/config.json`

Format:

```json
{
  "name": "Video name",
  "link": "https://www.youtube.com/watch?v=VIDEO_ID",
  "tag": ["TWICE", "Sana"],
  "star": 5
}
```

`tag` can contain multiple tags. `star` is 1-5.

You do NOT need to edit the React code to add videos.

## Deploy to Vercel

### Method 1 — GitHub (recommended)

1. Create a new GitHub repository, e.g. `viizme`.
2. Upload all files in this folder.
3. Go to https://vercel.com
4. Sign in with GitHub.
5. Click **Add New → Project**.
6. Import the `viizme` repository.
7. Framework should be detected as **Next.js**.
8. Click **Deploy**.

After deployment, Vercel gives you a URL such as:

`https://viizme.vercel.app`

### Updating videos after deployment

Change only:

`public/config.json`

Commit/push the change to GitHub. Vercel will automatically redeploy.

### Important

The YouTube thumbnail is loaded from YouTube's image server and the video is played using YouTube's embedded player. The site itself does not download or host the videos.

## Preview ratio

The archive thumbnails and featured preview use a **9:16 vertical** layout. The YouTube playback modal remains 16:9 so the embedded YouTube player displays normally.
