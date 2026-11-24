# Dead Slow Hoot — website

A Windows 95-style band site for GitHub Pages. It has links to your music and socials, tour dates with ticket links, a newsletter window, demos, and photo windows that shuffle through your photos.

```
index.html                     the page (you shouldn't need to touch it)
style.css                      the Windows 95 look
script.js                      windows, taskbar, start menu
themes.js                      colour schemes visitors can pick from
content.js                     ← EDIT THIS: links, tour dates, bio
photos/                        wallpaper (background.jpg) and logo stickers
photos/gallery/                ← your photos (photo-01.jpg … photo-10.jpg)
scripts/sync-substack.mjs      fetches your newest Substack post
demos/                         ← demo audio for the lucky dip (WAV, MP3…)
data/substack.js               newest Substack post (written automatically)
data/demos.js                  list of files in demos/ (written automatically)
scripts/list-demos.mjs         makes that list
setup/site.yml                 visible copy of the workflow, for pasting in by hand
.github/workflows/site.yml     publishes the site; lists demos; checks Substack every 6 hours
```

---

## 1. Put it on GitHub (about 5 minutes)

1. Create a new repository on GitHub, e.g. `deadslowhoot.github.io` (if your GitHub account or organisation is called `deadslowhoot`, this gives you the address `https://deadslowhoot.github.io`). Any name works. With another name, the address becomes `https://<account>.github.io/<repo-name>`.
2. Upload **all** the files from this folder, including the hidden `.github` folder. The easiest way is GitHub Desktop or `git push`. If you drag and drop in the browser instead, make sure `.github/workflows/` comes along; on a Mac, press **Cmd+Shift+.** in Finder to show hidden folders.
3. In the repo, go to **Settings → Pages**. Under *Build and deployment → Source*, choose **GitHub Actions**.
4. Go to the **Actions** tab. In the list on the left, click **Publish site**, then the **Run workflow** button on the right, then the green **Run workflow**. After about a minute the site is live at the address shown in Settings → Pages.

   **Don't see "Publish site"?** The hidden `.github` folder didn't upload. Add the file by hand:
   1. On the repo's main page, click **Add file → Create new file**.
   2. In the name box, type exactly `.github/workflows/site.yml`. The slashes turn into folders as you type.
   3. Paste in the contents of `site.yml` (a visible copy is in the `setup` folder of this download), then click **Commit changes**.
   4. Go back to the **Actions** tab. **Publish site** is now on the left, and it has probably already started by itself.

   **Actions tab asks you to enable workflows?** Click the green button to allow them.

From then on, every change you commit republishes the site automatically.

**Custom domain (optional):** Settings → Pages → Custom domain, then follow GitHub's DNS instructions.

---

## 2. Everyday updates — `content.js`

Open `content.js` on GitHub, click the ✏️ pencil, edit, then click **Commit changes**. The site updates a minute or two later.

- **Links:** fill in the `url` for each platform. Platforms with an empty url are hidden. You can add more lines in the same format.
- **Tour dates:** one line per show, with the date written `YYYY-MM-DD`. Visitors can click anywhere on a show's row to open its ticket link. Past shows disappear automatically. Use `soldOut: true` to grey out the button. Leave `ticketUrl` empty to show "TBA".
- **Bio, tagline, featured release:** at the top of the file.
- **Instagram desktop icon:** this appears automatically while the Instagram link is filled in.

> ⚠️ The three tour dates in the file are **examples**. Replace or delete them before you share the site.

---

## 3. Mailing list, lucky dip & newsletter window (Substack)

With your Substack address in `content.js`, the Listen & Follow window gets a **Join the mailing list for demos lucky dip** button:

1. A visitor clicks it and an email box drops down.
2. They type their email and press Enter. The site checks it looks like a real address and won't accept typos like `name@gmail` or `name.gmail.com`.
3. The button turns into a player and starts a random track from the `demos` folder. **Dip again** picks another, and it moves on to a new random track when one ends.
4. Their email is sent to you (see below), and the site remembers them, so next time the button goes straight to the player.

There's also a **Newsletter** window showing your newest Substack post. The newest post is fetched automatically every 6 hours. This needs the GitHub Action, but no account or token.

### Collecting sign-ups

Substack has no official way for another website to add subscribers, so there are two routes, set under `mailingList` in `content.js`:

- **`openSubstack: true`** (on by default): Substack's sign-up page opens in a new tab with the email already filled in. The visitor confirms there and they're subscribed straight away.
- **`googleFormLink`** (recommended, takes 5 minutes): every email is saved quietly to a Google Sheet that only you can see, even if the visitor ignores the Substack tab. You then import the sheet into Substack.

If `googleFormLink` is empty, the Substack tab always opens, so no sign-up is ever lost. If you set up the sheet, you can turn the tab off with `openSubstack: false`, so visitors never leave your site.

**Setting up the Google Sheet:**
1. Go to <https://forms.google.com> and start a **Blank form**. Call it "DSH website sign-ups".
2. Change the first question to **Short answer** and name it "Email".
3. In **Settings → Responses**, make sure **Collect email addresses** is off. If you see it, turn off **Restrict to users in…** or **Require sign-in**.
4. In the **Responses** tab, click **Link to Sheets** to create the spreadsheet.
5. Click the **⋮** menu (top right) → **Get pre-filled link**, type `test@test.com` into the box, click **Get link** and **Copy link**.
6. Paste that link into `content.js` as `googleFormLink: "…"` and commit.

**Adding them to Substack:** open the sheet, then **File → Download → CSV**. In Substack go to **Dashboard → Subscribers → Add subscribers → Import**, upload the CSV and choose the Email column. Substack skips anyone who's already subscribed, so importing the whole sheet every time is fine.

**Privacy:** you're collecting email addresses, so the sign-up box tells visitors what they're joining. Only use the list for the newsletter. If you're ever asked, delete someone's row from the sheet as well as removing them in Substack.

---

## 4. Demos

**Lucky dip:** upload audio files into the `demos` folder (**Add file → Upload files**). That's it. The GitHub Action notices them and adds them to the lucky dip within a couple of minutes. Titles come from the file names, so `taller-trees.wav` shows as "taller trees". Avoid odd characters in file names. Delete a file to take it out of the lucky dip.

**Big WAV files.** A 4-minute stereo WAV is about 40 MB.
- **Upload limit:** GitHub's website only accepts files up to 25 MB. Larger files (up to 100 MB) have to go up with **GitHub Desktop**.
- **Speed:** a 40 MB file also takes a while to start on mobile data.
- **Recommendation:** use 320 kbps MP3s (about 10 MB for 4 minutes). They're nearly impossible to tell apart from WAV on laptop or phone speakers, and they start playing almost instantly. WAV, MP3, M4A, OGG and FLAC all work.
- **Total size:** keep the whole site under 1 GB.

**Keep in mind:** this is a "thank you" for signing up, not a lock. The files sit in a public folder, so someone determined could find them. Don't upload anything that mustn't leak.

**Public Demos window (optional):** demos you list under `demos` in `content.js` also appear in their own Demos window for everyone, no sign-up needed. Leave the list empty to keep them for sign-ups only.

---

## 5. Photos

Three photo windows sit on the desktop, and every 5 seconds one of them swaps to a random photo. The three never show the same photo at once, and a window stops changing while the mouse is over it. The **Photos** folder icon shows the whole set.

**To use your own (the easy way):**
1. Name your photos `photo-01.jpg`, `photo-02.jpg` … `photo-10.jpg`. Use lower case, with the zero.
2. On GitHub, open `photos/gallery`, then **Add file → Upload files**, drag them in and click **Commit changes**. Files with the same names replace the placeholders. Nothing else needs editing.

**Different names, or more or fewer than 10:** upload them to `photos/gallery`, then edit the `photos` list in `content.js` to match the exact file names. Any number works; with 3 or fewer the windows just don't swap.

**Tips**
- Photos are cropped to squares, so keep the important bit near the middle.
- Resize them to about 1200 px wide before uploading. Phone photos are often 4–8 MB each, which makes the site slow on mobile data.
- They must be `.jpg`, `.png` or `.webp`. iPhone `.heic` photos won't show in most browsers; export them as JPEG first.
- To change how often they swap, edit `photoChangeSeconds` in `content.js`.

---

## Colour schemes

Visitors can change the site's colours in a Windows 95-style **Display Properties** window. They open it from the **Colours** desktop icon, the little monitor icon next to the clock, or **Start → Colour Scheme…**. Picking a scheme previews it across the whole site straight away. **OK** or **Apply** keeps it, and **Cancel** or the ✕ undoes it. Each visitor's choice is remembered on their own device, so it only changes the site for them.

There are 15 schemes, inspired by the ones built into Windows 95, plus a dark "Night Owl" and High Contrast Black. To add or tweak one, edit the list at the top of `themes.js`. Each line needs a `face` (window colour) and a `title` (title-bar colour), and everything else is worked out from those. To change which scheme new visitors see, edit `DEFAULT_SCHEME` in the same file.

## Changing the wallpaper or logo

- **Wallpaper:** replace `photos/background.jpg` with any image (keep the same name). The glitch flickers are added by the page on top of whatever image is there.
- **Logo:** `photos/sticker-text.png` and `photos/sticker-man.png` are the arched text and the little man. Replace either one with a transparent PNG of the same name.

## Floating windows

On computers, the windows drift slowly around the desktop and bounce off the edges. A window stops while the mouse is over it and stays put once it's clicked. Clicking empty desktop lets it float off again. To change the speed, edit `FLOAT_SPEED = [10, 24]` (pixels per second) near the middle of `script.js`. On phones the windows stack in a column and don't move. Floating is also off for anyone whose device is set to reduce motion.

## Previewing locally

Double-click `index.html`. Everything works offline, no server needed. 
