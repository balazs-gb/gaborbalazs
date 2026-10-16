/* =====================================================================
   GRAPHIC DESIGN DATABASE  (used by all 6 pages in graphic-design-pages/)
   ---------------------------------------------------------------------
   Structure:   category  ->  projects  ->  images

   ADD A NEW PROJECT:
     Copy one project block { title, subtitle, images } and paste it at
     the TOP of the "projects" list of the right category. The first
     project in the list is shown first on the page.

   ADD / REMOVE IMAGES:
     Just add or delete a line in the "images" list. List every image
     ONCE - the script repeats them automatically to make the endless
     loop. Any number of images works, the speed stays the same.
     GIFs work the same way as normal images.

   PATHS: write them from the site's root folder, e.g.
     "Images/projects/vibe/poster.jpg"   (no "../" needed)

   PROJECT FIELDS:
     title     name of the project (required)
     subtitle  small grey text next to the title - optional, delete the
               line if not needed. The brackets are added automatically.
     images    list of image paths (required)

   CATEGORY FIELDS:
     id     must be the same as the html file name (branding -> branding.html)
     label  name in the menu
     short  shorter name for the menu on phones (optional)
   ===================================================================== */

const graphicDesign = [
  {
    id: "branding",
    label: "Branding",
    short: "Branding",
    projects: [
      {
        title: "VIBE Festival",
        subtitle: "with Diversity Advertising, 2021-2026",
        images: [
          "Images/projects/vibe/vibee (1).webp",
          "Images/projects/vibe/vibee (5).webp",
          "Images/projects/vibe/vibee (11).webp",
          "Images/projects/vibe/vibee (6).webp",
          "Images/projects/vibe/vibee (12).webp",
          "Images/projects/vibe/vibee (9).webp",
          "Images/projects/vibe/vibee (3).webp",
          "Images/projects/vibe/vibee (8).webp",
          "Images/projects/vibe/vibee (2).webp",
          "Images/projects/vibe/vibee (7).webp",
          "Images/projects/vibe/vibee (4).webp"
        ]
      },
      {
        title: "TABAKÓ Festival",
        subtitle: "with Diversity Advertising, 2022-2023",
        images: [
          "Images/projects/branding/tbk (2).webp",
          "Images/projects/branding/tbk (3).webp",
          "Images/projects/branding/tbk (8).webp",
          "Images/projects/branding/tbk (10).webp",
          "Images/projects/branding/tbk (5).webp",
          "Images/projects/branding/tbk (6).webp",
          "Images/projects/branding/tbk (7).webp",
          "Images/projects/branding/tbk (11).webp",
          "Images/projects/branding/tbk (9).webp",
          "Images/projects/branding/tbk (4).webp",
          "Images/projects/branding/tbk (1).webp"
        ]
      },
      {
        title: "KMDSZ Diáknapok & TM",
        subtitle: "with Diversity Advertising, 2023-2026",
        images: [
          "Images/projects/kmdsz/DN-2023.webp",
          "Images/projects/kmdsz/DN-2024.webp",
          "Images/projects/kmdsz/DN-2025.webp",
          "Images/projects/kmdsz/TM-2023.webp",
          "Images/projects/kmdsz/TM-2024.webp",
          "Images/projects/kmdsz/TM-2025.webp",
          "Images/projects/kmdsz/2026kmdsz.webp",
          "Images/projects/kmdsz/2026tm.webp"
        ]
      },
      {
        title: "BBU - International Case Competition",
        subtitle: "with Diversity, 2024",
        images: [
          "Images/projects/branding/bbuicc (1).webp",
          "Images/projects/branding/bbuicc (2).webp",
          "Images/projects/branding/bbuicc (3).webp",
          "Images/projects/branding/bbuicc (4).webp",
          "Images/projects/branding/bbuicc (5).webp",
          "Images/projects/branding/bbuicc (6).webp",
          "Images/projects/branding/bbuicc (7).webp",
          "Images/projects/branding/bbuicc (8).webp",
          "Images/projects/branding/bbuicc (9).webp"
        ]
      },
      {
        title: "Bimada",
        subtitle: "with Diversity Advertising, 2024",
        images: [
          "Images/projects/branding/bimada (1).webp",
          "Images/projects/branding/bimada (2).webp",
          "Images/projects/branding/bimada (3).webp",
          "Images/projects/branding/bimada (4).webp",
          "Images/projects/branding/bimada (5).webp",
          "Images/projects/branding/bimada (6).webp",
          "Images/projects/branding/bimada (7).webp",
          "Images/projects/branding/bimada (8).webp",
          "Images/projects/branding/bimada (9).webp"
        ]
      },
            {
        title: "Film & Média Napok",
        subtitle: "2021",
        images: [
          "Images/projects/fmn-1.webp",
          "Images/projects/fmn-2.webp",
          "Images/projects/fmn-3.webp"
        ]
      },
      {
        title: "EMD",
        subtitle: "with Diversity Advertising, 2025",
        images: [
          "Images/projects/branding/emd (1).webp",
          "Images/projects/branding/emd (2).webp",
          "Images/projects/branding/emd (3).webp",
          "Images/projects/branding/emd (4).webp",
          "Images/projects/branding/emd (5).webp",
          "Images/projects/branding/emd (6).webp",
          "Images/projects/branding/emd (7).webp",
          "Images/projects/branding/emd (8).webp",
          "Images/projects/branding/emd (9).webp",
          "Images/projects/branding/emd (10).webp"
        ]
      },
      {
        title: "Erdélyi Egyetemi Börze",
        subtitle: "with Diversity Advertising, 2025",
        images: [
          "Images/projects/branding/eeb (1).webp",
          "Images/projects/branding/eeb (2).webp",
          "Images/projects/branding/eeb (3).webp",
          "Images/projects/branding/eeb (4).webp",
          "Images/projects/branding/eeb (5).webp",
          "Images/projects/branding/eeb (6).webp",
          "Images/projects/branding/eeb (7).webp",
          "Images/projects/branding/eeb (8).webp",
          "Images/projects/branding/eeb (9).webp"
        ]
      }
    ]
  },
  {
    id: "logo",
    label: "Logo",
    short: "Logo",
    projects: [
      {
        title: "La Cluj logo concept",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/logo/lacluj1.webp",
          "Images/projects/logo/lacluj2.gif",
          "Images/projects/logo/lacluj3.webp",
          "Images/projects/logo/lacluj4.webp"
        ]
      },
      {
        title: "Logo designs",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/logo/div.webp",
          "Images/projects/logo/bimada.webp",
          "Images/projects/logo/nolinalogo.webp",
          "Images/projects/logo/kerek.webp",
          "Images/projects/logo/emd.webp",
          "Images/projects/logo/eeb.webp",
          "Images/projects/logo/nolina.webp",
          "Images/projects/logo/bbuicc.webp"
        ]
      },
      {
        title: "Logo designs",
        images: [
          "Images/projects/logo/respond.webp",
          "Images/projects/logo/logo1.webp",
          "Images/projects/logo/logo2.webp",
          "Images/projects/logo/logo3.webp"
        ]
      }
      
    ]
  },
  {
    id: "social",
    label: "Social Media",
    short: "Social",
    projects: [
      {
        title: "Diversity Advertising",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/social/div (1).webp",
          "Images/projects/social/div (2).webp",
          "Images/projects/social/div (3).webp",
          "Images/projects/social/div (4).webp",
          "Images/projects/social/div (5).webp",
          "Images/projects/social/div (6).webp",
          "Images/projects/social/div (7).webp"
        ]
        
      },
      {
        title: "VIBE Festival",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/social/vibe (1).webp",
          "Images/projects/social/vibe (2).webp",
          "Images/projects/social/vibe (3).webp",
          "Images/projects/social/vibe (4).webp",
          "Images/projects/social/vibe (5).webp"
        ]
        
      },
      {
        title: "Tabakó Festival",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/social/tabako (1).webp",
          "Images/projects/social/tabako (2).webp",
          "Images/projects/social/tabako (3).webp"
        ]
        
      },
      {
        title: "BBTE Közgáz",
        subtitle: " [UBB Economics] with Diversity Advertising",
        images: [
          "Images/projects/social/bbte (1).webp",
          "Images/projects/social/bbte (2).webp",
          "Images/projects/social/bbte (3).webp"
        ]
        
      },
      {
        title: "Harmonya",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/social/harmonya (1).webp",
          "Images/projects/social/harmonya (2).webp",
          "Images/projects/social/harmonya (3).webp",
          "Images/projects/social/harmonya (4).webp"
        ]
        
      }
    ]
  },
  {
    id: "motion",
    label: "Motion Graphics",
    short: "Motion",
    projects: [
      {
        title: "Social media animations",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/motion/tabako.mp4",
          "Images/projects/motion/divposzt.mp4",
          "Images/projects/motion/DEVOPS (1).mp4",
          "Images/projects/motion/DEVOPS (2).mp4"
        ]
      },
      {
        title: "Infographics",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/motion/fomco.mp4",
          "Images/projects/motion/mendola.mp4",
          "Images/projects/motion/rente.mp4"
        ]
      },
      {
        title: "Logo animations",
        images: [
          "Images/projects/motion/008.mp4",
          "Images/projects/motion/012.mp4",
          "Images/projects/motion/014.mp4",
          "Images/projects/motion/038.mp4",
          "Images/projects/motion/039.mp4",
          "Images/projects/motion/023.mp4",
          "Images/projects/motion/021.mp4",
          "Images/projects/motion/019.mp4",
          "Images/projects/motion/020.mp4"
        ]
      },
      {
        title: "3D animations",
        subtitle: "with Diversity Advertising",
        images: [
          "Images/projects/motion/stage.mp4",
          "Images/projects/motion/fpv.mp4"
        ]
      },
      {
        title: "Frame-by-frame",
        subtitle: "Logo animations",
        images: [
          "Images/projects/motion/fbf (1).mp4",
          "Images/projects/motion/fbf (2).mp4",
          "Images/projects/motion/fbf (3).mp4"
        ]
      },
      {
        title: "Inktober (frame-by-frame)",
        subtitle: "some parts, 2022",
        images: [
          "Images/projects/motion/Inkt12.mp4",
          "Images/projects/motion/Inkt17.mp4",
          "Images/projects/motion/Inkt19.mp4",
          "Images/projects/motion/Inkt22.mp4",
          "Images/projects/motion/Inkt27.mp4",
          "Images/projects/motion/Inkt28.mp4",
          "Images/projects/motion/Inkt29.mp4"
        ]
      }
    ]
  },
  {
    id: "uidesign",
    label: "UI Design",
    short: "UI Design",
    projects: [
      {
        title: "VIBE Festival APP",
        subtitle: "with Diversity Advertising, 2025",
        images: [
          "Images/projects/UI design/vibeapp (1).webp",
          "Images/projects/UI design/vibeapp (2).webp",
          "Images/projects/UI design/vibeapp (3).webp",
          "Images/projects/UI design/vibeapp (4).webp",
          "Images/projects/UI design/vibeapp (5).webp"
        ]
      },
      {
        title: "TABAKÓ Festival APP",
        subtitle: "with Diversity Advertising, 2024",
        images: [
          "Images/projects/UI design/tabako (1).webp",
          "Images/projects/UI design/tabako (2).webp",
          "Images/projects/UI design/tabako (3).webp",
          "Images/projects/UI design/tabako (4).webp",
          "Images/projects/UI design/tabako (5).webp"
        ]
      },
      {
        title: "Diversity Website",
        subtitle: "with Diversity Advertising, 2023",
        images: [
          "Images/projects/UI design/div (0).webp",
          "Images/projects/UI design/div (1).webp",
          "Images/projects/UI design/div (2).webp",
          "Images/projects/UI design/div (3).webp",
          "Images/projects/UI design/div (4).webp"
        ]
      },
      {
        title: "RentE WebApp",
        subtitle: "with Diversity Advertising, 2024",
        images: [
          "Images/projects/UI design/rente (1).webp",
          "Images/projects/UI design/rente (2).webp",
          "Images/projects/UI design/rente (3).webp",
          "Images/projects/UI design/rente (4).webp",
          "Images/projects/UI design/rente (5).webp",
          "Images/projects/UI design/rente (6).webp"
        ]
      },
      {
        title: "The Közgáz (Re)Union Website",
        subtitle: "with Diversity Advertising, 2026",
        images: [
          "Images/projects/UI design/bbte (1).webp",
          "Images/projects/UI design/bbte (2).webp",
          "Images/projects/UI design/bbte (3).webp"
        ]
      }
    ]
  },
  {
    id: "editorial",
    label: "Editorial works",
    short: "Editorial",
    projects: [
      {
        title: "Tabakó",
        subtitle: "with Diversity Advertising, 2023",
        images: [
          "Images/projects/editorial/tabakofuzet (1).webp",
          "Images/projects/editorial/tabakofuzet (2).webp",
          "Images/projects/editorial/tabakofuzet (3).webp",
          "Images/projects/editorial/tabakofuzet (4).webp",
          "Images/projects/editorial/tabakofuzet (5).webp"
        ]
      },
      {
        title: "Vibe",
        subtitle: "with Diversity Advertising, 2023",
        images: [
          "Images/projects/editorial/vibefuzet (5).webp",
          "Images/projects/editorial/vibefuzet (4).webp",
          "Images/projects/editorial/vibefuzet (1).webp",
          "Images/projects/editorial/vibefuzet (2).webp",
          "Images/projects/editorial/vibefuzet (3).webp"
        ]
      },
      {
        title: "50 éves rajztagozat",
        subtitle: "2022",
        images: [
          "Images/projects/editorial/rajztagozat (1).webp",
          "Images/projects/editorial/rajztagozat (2).webp",
          "Images/projects/editorial/rajztagozat (3).webp",
          "Images/projects/editorial/rajztagozat (4).webp",
          "Images/projects/editorial/rajztagozat (5).webp"
        ]
      },
      {
        title: "Typeface design",
        subtitle: "2020",
        images: [
          "Images/projects/font/font-os (1).webp",
          "Images/projects/font/font-os (2).webp",
          "Images/projects/font/font-os (3).webp",
          "Images/projects/font/font-os (4).webp",
          "Images/projects/font/font-os (5).webp",
          "Images/projects/font/font-os (6).webp",
          "Images/projects/font/font-os (7).webp",
          "Images/projects/font/font-os (8).webp",
          "Images/projects/font/font-os (9).webp"
        ]
      }
    ]
  }
];
