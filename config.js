/* =====================================================================
   H24 Creationz products site: EVERYTHING YOU EDIT LIVES IN THIS FILE.
   Both versions (index.html and index-bold.html) read from here.
   ===================================================================== */
window.H24 = {
  brand: {
    name: "H24 Creationz",
    logo: "assets/h24-logo.png",
    studio: "https://harshavarthanep.github.io/h24creationz/",
    email: "h24creationz@gmail.com",
    motto: "Think Different Be Different"
  },

  lab: {
    hub: "https://harshavarthanep.github.io/apps/",
    repo: "https://github.com/harshavarthanep/apps"
  },

  // Slide timings in milliseconds
  timing: {
    slideInterval: 4000,        // each screenshot
    videoSlideInterval: 10000,  // the video slide waits longer
    touchResumeDelay: 5000,     // phones: resume auto-slide this long after a touch
    loaderMinMs: 2300           // loading screen on the first visit (time for the logo to assemble)
  },

  // Counters: free Abacus API, no sign-up. Real counts are added on top of the base numbers.
  counter: {
    enabled: true,
    provider: "https://abacus.jasoncameron.dev",
    namespace: "h24creationz-products",  // keep unique; changing it restarts the real counts
    baseVisitors: 6847,
    uniquePerBrowser: true,               // count each browser once as a visitor
    viewSecondsVisible: 1.2               // a product counts as viewed after being on screen this long
  },

  coffee: {
    upiIds: ["8667701001@upi", "8667701001@yapl"],   // first one is selected by default
    payeeName: "H24 Creationz",
    note: "Coffee for H24 Creationz",
    amounts: [
      { amt: 49,  label: "a chai" },
      { amt: 99,  label: "a coffee" },
      { amt: 199, label: "a cold brew" },
      { amt: 499, label: "a new feature" }
    ],
    defaultAmount: 99,
    fastCloseSeconds: 8,     // closed faster than this = playful "I saw that" toast
    thankYouSeconds: 25,     // stayed this long (time to scan and pay) = heartfelt thank-you
    nudgeAfterSeconds: 40    // small speech bubble near the coffee button, once per visit
  },

  // Browser logos come from the open-source browser-logos project.
  browserLogoBase: "https://cdn.jsdelivr.net/gh/alrra/browser-logos@main/src/",
  browsers: {
    chrome:  { name: "Chrome",  chromium: true,  storeName: "Chrome Web Store" },
    edge:    { name: "Edge",    chromium: true,  storeName: "Edge Add-ons" },
    brave:   { name: "Brave",   chromium: true,  storeName: "Chrome Web Store" },
    opera:   { name: "Opera",   chromium: true,  storeName: "Opera Add-ons" },
    vivaldi: { name: "Vivaldi", chromium: true,  storeName: "Chrome Web Store" },
    firefox: { name: "Firefox", chromium: false, storeName: "Firefox Add-ons" },
    safari:  { name: "Safari",  chromium: false, storeName: "App Store" }
  },

  /* EXTENSIONS
     stores: exact listing URLs. "" = not published yet (shows "Coming soon").
     Chromium browsers (Edge, Brave, Opera, Vivaldi) use the Chrome Web Store link until they have their own. */
  extensions: [
    {
      id: "flickflick", name: "Flick Flick", ready: true, accent: "#F2B000",
      logo: "assets/logos/flickflick.png",
      tagline: "Alt+Tab for your browser tabs.",
      why: "You jump between the same two tabs all day. Flick Flick takes you back to the last one with Alt+Q, and hold it to pick any recent tab, the way Alt+Tab picks a window. The best ideas from Arc, Zen and PowerToys, in the Chromium browser you already use.",
      features: [
        "Alt+Q flicks to your last tab. Hold it to pick any recent tab with previews.",
        "Glance opens links in a floating window, full size or side by side, without reloading.",
        "Command bar for tabs, bookmarks and history, plus quick sums and plain-word reminders.",
        "Vertical tabs, split view, volume up to 600%, picture in picture and screenshots.",
        "Focus sessions, routines and Bit Bit, a tiny desk pet. Everything stays in your browser."
      ],
      site: "https://harshavarthanep.github.io/flickflick/",   // add the Flick Flick website link here when it goes live
      stores: {
        chrome: "https://chromewebstore.google.com/detail/ccjfgehimibjhjfbncilcfpdpnaibkml",
        edge: "", opera: "", firefox: "", safari: ""
      },
      baseViews: 4213, baseDownloads: 1386,
      media: {
        video: "media/flickflick/demo-30s.mp4",       // short clip: plays on hover in the card
        fullVideo: "media/flickflick/demo.mp4",       // full demo: plays in the player
        poster: "media/flickflick/poster.jpg",
        shots: ["media/flickflick/1.jpg", "media/flickflick/2.jpg", "media/flickflick/3.jpg", "media/flickflick/4.jpg",
                "media/flickflick/5.jpg", "media/flickflick/6.jpg", "media/flickflick/7.jpg", "media/flickflick/8.jpg"],
        captions: ["All of it, one flick away", "Alt+Q tab switcher", "Alt + right-click ring", "Glance at any link",
                   "Command bar", "Volume up to 600%", "Bit Bit, your desk pet", "Make it yours"]
      }
    },
    {
      id: "shelfshelf", name: "Shelf Shelf", ready: true, accent: "#2F8CFF",
      logo: "assets/logos/shelfshelf.png",
      tagline: "Your favourite sites as apps, with a dock and to-dos.",
      why: "Bookmarks get buried and your to-do list lives in another window. Shelf Shelf turns your new tab into a calm home screen: favourite sites as apps, folders and a dock, plus to-dos with reminders right where you start.",
      features: [
        "Favourite sites as apps, with folders and a Dock, like your phone.",
        "Right-click any page to add it to your Shelf, or press Alt+Shift+K.",
        "To-dos that remind you: type \"Call Sam tomorrow 5pm\" and it sets the time.",
        "Seven themes, Liquid Glass or solid, any accent colour, even your own photo.",
        "Syncs across your computers. No account, no ads, no tracking."
      ],
      site: "https://harshavarthanep.github.io/Shelf-Shelf/download",
      web: "https://harshavarthanep.github.io/Shelf-Shelf/",
      stores: {
        chrome: "https://chromewebstore.google.com/detail/bhhnembgfddoomakgmegbhkpklcgelhn",
        edge: "", opera: "", firefox: "", safari: ""
      },
      baseViews: 3689, baseDownloads: 1127,
      media: {
        video: "media/shelfshelf/demo-30s.mp4",
        fullVideo: "media/shelfshelf/demo.mp4",
        poster: "media/shelfshelf/poster.jpg",
        shots: ["media/shelfshelf/1.jpg", "media/shelfshelf/2.jpg", "media/shelfshelf/3.jpg", "media/shelfshelf/4.jpg",
                "media/shelfshelf/5.jpg", "media/shelfshelf/6.jpg", "media/shelfshelf/7.jpg"],
        captions: ["Your favourite sites, one click away", "Right-click to add", "To-dos that remind you", "A Dock and folders",
                   "Make it yours", "Synced and private", "Everything in one extension"]
      }
    }
  ],

  /* APPS: ready:false hides an app (it then shows as "cooking" in the lab section).
     downloadReady:false shows "Notify me when the apps launch" instead of the Download button.
     dock:false keeps a second listing of the same product out of the hero dock, loader and footer. */
  apps: [
    {
      id: "zenpdf", name: "ZenPDF Pro", ready: true, accent: "#F0532D",
      logo: "assets/logos/zenpdf.png",
      tagline: "Every PDF tool, on your device.",
      why: "Edit, sign, fill, merge, compress and convert PDFs privately and offline, without uploading them anywhere. Smart Autofill fills long forms in seconds and learns your fixes, so the same form never takes long twice.",
      features: [
        "42 PDF tools in one calm app: edit, sign, fill, merge, compress, convert.",
        "Private by design. Your files never leave your device, and it works offline.",
        "Smart Autofill fills any form in seconds and learns as you go.",
        "Your own rules, for any country.",
        "Windows, macOS, Linux, Android, iPhone and the web."
      ],
      platforms: ["Web", "Windows", "macOS", "Linux", "Android", "iPhone"],
      site: "https://harshavarthanep.github.io/ZenPDF-Pro/download",
      web: "https://harshavarthanep.github.io/ZenPDF-Pro/",
      download: "https://harshavarthanep.github.io/ZenPDF-Pro/download",
      baseViews: 5126, baseDownloads: 2043,
      media: {
        video: "https://harshavarthanep.github.io/ZenPDF-Pro/media/ZenPDF-Pro-30s-Horizontal.mp4",
        fullVideo: "https://harshavarthanep.github.io/ZenPDF-Pro/media/ZenPDF-Pro-Demo.mp4",
        poster: "https://harshavarthanep.github.io/ZenPDF-Pro/media/zenpdf-pro-demo-poster.jpg",
        shots: [
          "https://harshavarthanep.github.io/ZenPDF-Pro/media/home.jpg",
          "https://harshavarthanep.github.io/ZenPDF-Pro/media/tools.jpg",
          "https://harshavarthanep.github.io/ZenPDF-Pro/media/filled.jpg",
          "https://harshavarthanep.github.io/ZenPDF-Pro/media/review.jpg",
          "https://harshavarthanep.github.io/ZenPDF-Pro/media/home-dark.jpg"
        ],
        captions: ["Home", "42 tools", "Form filled in seconds", "Review before you save", "Dark mode"]
      }
    },
    {
      id: "nodalis", name: "Nodalis", ready: true, accent: "#7C5CFA",
      logo: "assets/logos/nodalis.png",
      tagline: "Your knowledge, connected.",
      why: "A free, offline-first notes app for everything you think: linked markdown notes, a knowledge graph, an endless canvas, tasks, a calendar and databases, all in one calm place. Your files stay yours.",
      features: [
        "Linked markdown notes and a graph that shows how your ideas connect.",
        "An endless canvas, plus tasks straight from your notes.",
        "Any folder becomes a database, with a calendar and boards.",
        "Offline-first, with private sync and six themes, light or dark.",
        "Windows, macOS, Linux, Android, iPhone and the web."
      ],
      platforms: ["Web", "Windows", "macOS", "Linux", "Android", "iPhone"],
      site: "https://harshavarthanep.github.io/Nodalis-app/download",
      web: "https://harshavarthanep.github.io/Nodalis-app/",
      download: "https://harshavarthanep.github.io/Nodalis-app/download",
      baseViews: 2874, baseDownloads: 736,
      media: {
        video: "https://harshavarthanep.github.io/Nodalis-app/media/nodalis-demo.mp4",
        poster: "https://harshavarthanep.github.io/Nodalis-app/media/nodalis-demo-poster.jpg",
        shots: [
          "https://harshavarthanep.github.io/Nodalis-app/media/shot-note-read.jpg",
          "https://harshavarthanep.github.io/Nodalis-app/media/shot-graph-dark.jpg",
          "https://harshavarthanep.github.io/Nodalis-app/media/shot-canvas.jpg",
          "https://harshavarthanep.github.io/Nodalis-app/media/shot-tasks.jpg",
          "https://harshavarthanep.github.io/Nodalis-app/media/shot-db-board.jpg"
        ],
        captions: ["Linked notes", "Knowledge graph", "Endless canvas", "Tasks", "Folder as a database"]
      }
    },
    {
      id: "beambeam", name: "Beam Beam", ready: true, accent: "#2F45F0",
      logo: "assets/logos/beambeam.png",
      tagline: "Send big files straight to anyone.",
      why: "Share files of any size with a link or a QR code. Nothing is uploaded to a server, there is no sign-up and no size limit. It is encrypted end to end, works on strict networks, and the link expires when you choose.",
      features: [
        "No size limit. Files go directly from your device to theirs.",
        "Share with a link or a QR code, from laptop to phone in seconds.",
        "Encrypted end to end, with an optional password.",
        "Links that expire on your timer, and transfers that resume after drops.",
        "Install it like an app, or download for desktop and Android."
      ],
      platforms: ["Web", "Windows", "macOS", "Linux", "Android", "iPhone"],
      site: "https://harshavarthanep.github.io/BeamBeam/",
      web: "https://harshavarthanep.github.io/BeamBeam/",
      download: "https://harshavarthanep.github.io/BeamBeam/download",
      baseViews: 3317, baseDownloads: 968,
      media: {
        video: "https://harshavarthanep.github.io/BeamBeam/media/BeamBeam-30s-Horizontal.mp4",
        fullVideo: "https://harshavarthanep.github.io/BeamBeam/media/BeamBeam-Demo.mp4",
        poster: "https://harshavarthanep.github.io/BeamBeam/media/demo-poster.jpg",
        shots: [
          "https://harshavarthanep.github.io/BeamBeam/media/home.jpg",
          "https://harshavarthanep.github.io/BeamBeam/media/share.jpg",
          "https://harshavarthanep.github.io/BeamBeam/media/receive.jpg",
          "https://harshavarthanep.github.io/BeamBeam/media/home-dark.jpg"
        ],
        captions: ["Add your files", "Share the link or QR", "They download, directly", "Dark mode"]
      }
    },
    {
      id: "nudgenudge", name: "Nudge Nudge", ready: true, accent: "#22B985",
      logo: "assets/logos/nudgenudge.png",
      tagline: "Never miss what matters.",
      why: "Tell it what to remember in plain words. It reminds you on time, out loud if you like, and keeps nudging until it is done. Then it helps you focus on the one thing that matters today. No account, and your data stays on your device.",
      features: [
        "Type or say it the way you would: \"pay rent on 1 Dec, keep reminding\".",
        "Alarms and reminders that do not give up until the task is done.",
        "Focus blocks that hold reminders and park stray thoughts for later.",
        "Daily rings, routines, a calendar and money in and out.",
        "A companion with expressive eyes, on phone, desktop and browser."
      ],
      platforms: ["Web", "Windows", "macOS", "Linux", "Android", "iPhone"],
      site: "https://harshavarthanep.github.io/NudgeNudge/",
      web: "https://harshavarthanep.github.io/NudgeNudge/app/",
      download: "https://harshavarthanep.github.io/NudgeNudge/#download",
      baseViews: 1482, baseDownloads: 309,
      media: {
        video: "https://harshavarthanep.github.io/NudgeNudge/media/nudge-nudge-30s.mp4",
        fullVideo: "https://harshavarthanep.github.io/NudgeNudge/media/nudge-nudge-demo.mp4",
        poster: "https://harshavarthanep.github.io/NudgeNudge/media/poster-30s.jpg",
        shots: [
          "https://harshavarthanep.github.io/NudgeNudge/media/screens/desktop.jpg",
          "https://harshavarthanep.github.io/NudgeNudge/media/screens/today-typed.jpg",
          "https://harshavarthanep.github.io/NudgeNudge/media/screens/focus.jpg",
          "https://harshavarthanep.github.io/NudgeNudge/media/screens/alarm.jpg",
          "https://harshavarthanep.github.io/NudgeNudge/media/screens/progress.jpg"
        ],
        captions: ["On your desk", "Say it in plain words", "Focus mode", "Alarms that talk", "Daily rings"]
      }
    },
    {
      id: "shelfshelf-app", name: "Shelf Shelf", ready: true, dock: false, accent: "#2F8CFF",
      logo: "assets/logos/shelfshelf.png",
      tagline: "Your home screen for the web, as an app.",
      why: "Not using a browser extension? Shelf Shelf also runs as its own app. Your favourite sites as apps, folders and a Dock, plus to-dos that remind you, in a calm home screen that opens in one click on any device.",
      features: [
        "Favourite sites as apps, folders and a Dock, on any device.",
        "To-dos with reminders, typed in plain words.",
        "Seven themes, Liquid Glass or solid, any accent colour.",
        "Works offline and installs like an app from your browser.",
        "Desktop and mobile apps are on the way. Use it on the web today."
      ],
      platforms: ["Web", "Windows", "macOS", "Linux", "Android", "iPhone"],
      site: "https://harshavarthanep.github.io/Shelf-Shelf/",
      web: "https://harshavarthanep.github.io/Shelf-Shelf/",
      download: "https://harshavarthanep.github.io/Shelf-Shelf/download",
      // downloadReady: false,     // set to true once Shelf-Shelf/download is live
      baseViews: 1174, baseDownloads: 0,
      media: {
        video: "media/shelfshelf/demo-30s.mp4",
        fullVideo: "media/shelfshelf/demo.mp4",
        poster: "media/shelfshelf/poster.jpg",
        shots: ["media/shelfshelf/1.jpg", "media/shelfshelf/4.jpg", "media/shelfshelf/3.jpg", "media/shelfshelf/5.jpg", "media/shelfshelf/6.jpg"],
        captions: ["Your favourite sites, one click away", "A Dock and folders", "To-dos that remind you", "Make it yours", "Synced and private"]
      }
    }
  ]
};
