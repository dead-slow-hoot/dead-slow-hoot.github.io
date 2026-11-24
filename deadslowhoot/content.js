/* ==========================================================================
   DEAD SLOW HOOT — SITE CONTENT
   --------------------------------------------------------------------------
   This is the only file you need to edit for everyday updates.
   Edit it straight on GitHub (open the file, click the pencil icon, then
   "Commit changes") and the site updates itself a minute or two later.

   Rules of thumb:
   - Keep the "quotes" around text and the commas at the end of lines.
   - A link with an empty url ("") is hidden from the site, so you can
     leave platforms you don't use blank.
   - Tour dates are written YEAR-MONTH-DAY, e.g. "2027-03-14".
     Shows automatically disappear from the list the day after they happen.
   ========================================================================== */

window.SITE = {
  bandName: "Dead Slow Hoot",
  tagline: "Bittersweet, anthemic, melancholy alt rock made in Sheffield.",
  about:
    "Dead Slow Hoot is a left of the dial indie rock band taking influence from bands like Wilco, Built To Spill and Big Thief - tender songs that take unexpected turns, tight but loose.",

  // The big button in the welcome window. Point it at your newest release.
  featured: {
    label: "Listen to the new record",
    url: "https://deadslowhoot.bandcamp.com",
  },

  // Optional contact email (leave "" to hide).
  email: "",

  /* ---------------------------------------------------------------
     MAILING LIST (Substack)
     Paste your Substack address, e.g. "https://deadslowhoot.substack.com".
     This adds a "Join the mailing list" button and a Newsletter window.
     If the GitHub Action is set up, the window shows your newest post
     automatically. If not, fill in latestPost below by hand (or leave
     it empty and the window just shows the sign-up button).
     --------------------------------------------------------------- */
  substack: "https://deadslowhoot.substack.com",

  /* Sign-ups from the "Join the mailing list for demos lucky dip" button.
     googleFormLink: paste your Google Form's PRE-FILLED link here (see the
       README, "Collecting sign-ups") and every email is saved to a Google
       Sheet you own, ready to import into Substack. Leave "" to turn off.
     openSubstack: also open Substack's sign-up page in a new tab with the
       email filled in, so they're subscribed straight away once they
       confirm. If googleFormLink is empty this always happens, so no
       sign-up is ever lost. */
  mailingList: {
    googleFormLink: "",
    openSubstack: true,
  },
  latestPost: {
    title: "",
    date: "",        // "2026-11-20"
    excerpt: "",
    url: "",
  },

  /* ---------------------------------------------------------------
     LINKS
     group: which heading it sits under ("Listen", "Follow", "Shop")
     icon:  music | video | camera | web | merch | mail
     --------------------------------------------------------------- */
  links: [
    { group: "Listen", label: "Spotify",     icon: "music",  url: "https://open.spotify.com/artist/39OHhg4B0aJg3JxlYjtfJ3" },
    { group: "Listen", label: "Bandcamp",    icon: "music",  url: "https://deadslowhoot.bandcamp.com" },
    { group: "Listen", label: "Apple Music", icon: "music",  url: "" },
    { group: "Listen", label: "YouTube",     icon: "video",  url: "" },
    { group: "Listen", label: "SoundCloud",  icon: "music",  url: "" },

    { group: "Follow", label: "Instagram",   icon: "camera", url: "https://www.instagram.com/deadslowhoot/" },
    { group: "Follow", label: "TikTok",      icon: "video",  url: "" },
    { group: "Follow", label: "Facebook",    icon: "web",    url: "" },
    { group: "Follow", label: "Bluesky",     icon: "web",    url: "" },

    { group: "Shop",   label: "Merch",       icon: "merch",  url: "https://deadslowhoot.bandcamp.com/merch" },
  ],

  /* ---------------------------------------------------------------
     TOUR DATES
     Visitors can click anywhere on a show's row to open its ticket link.
     soldOut: true  shows a greyed-out "Sold out" button instead.
     note: optional small text, e.g. "w/ Support Band" or "Free entry"
     --------------------------------------------------------------- */
  tourDates: [
    { date: "2026-12-16", city: "London", venue: "The Victoria, Dalston", note: "Xmas Party w/ Bojockey + Del Tonto",
      ticketUrl: "https://dice.fm/event/dlg6w6-xmas-party-dead-slow-hoot-bojockey-del-tonto-16th-dec-the-victoria-london-tickets" },
  ],

  /* ---------------------------------------------------------------
     DEMOS
     LUCKY DIP: every audio file you upload into the "demos" folder is
     added to the lucky dip automatically (WAV, MP3, M4A, OGG or FLAC).
     Nothing to edit here. Titles come from the file names, so
     "taller-trees.wav" shows as "taller trees".

     DEMOS WINDOW (optional, separate): demos listed below are ALSO shown
     to everyone, with no sign-up, in their own Demos window. Leave the
     list empty to keep demos for mailing-list sign-ups only.
     --------------------------------------------------------------- */
  // Text on the mailing-list button
  luckyDipLabel: "Join the mailing list for demos lucky dip",
  demos: [
    // { title: "Song Name (demo)", file: "demos/song-name.mp3", note: "Rehearsal room, Nov 2026" },
  ],

  /* ---------------------------------------------------------------
     PHOTOS
     The three photo windows shuffle through these at random, and the
     Photos folder icon shows them all.
     To use your own: upload them into the photos/gallery folder on
     GitHub. If you name them photo-01.jpg to photo-10.jpg they replace
     the placeholders automatically, no editing needed. Otherwise
     list their exact file names here. You can have as many as you like.
     Square-ish photos look best (they're cropped to squares).
     --------------------------------------------------------------- */
  photos: [
    "photos/gallery/photo-01.jpg",
    "photos/gallery/photo-02.jpg",
    "photos/gallery/photo-03.jpg",
    "photos/gallery/photo-04.jpg",
    "photos/gallery/photo-05.jpg",
    "photos/gallery/photo-06.jpg",
    "photos/gallery/photo-07.jpg",
    "photos/gallery/photo-08.jpg",
    "photos/gallery/photo-09.jpg",
    "photos/gallery/photo-10.jpg",
  ],
  photoChangeSeconds: 5,   // how often one of the windows swaps its photo
};
