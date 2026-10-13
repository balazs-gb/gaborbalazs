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
        subtitle: "collaboration with Diversity Advertising",
        images: [
          "Images/projects/vibe/369699223_858150212349155_1000205966917858233_n.jpg",
          "Images/projects/vibe/Fellépők covers1-10.jpg",
          "Images/projects/vibe/MERCH poszt-02.jpg"
        ]
      },
      {
        title: "KMDSZ Diáknapok & TM",
        subtitle: "collaboration with Diversity Advertising",
        images: [
          "Images/projects/kmdsz/DN-2023.webp",
          "Images/projects/kmdsz/DN-2024.webp",
          "Images/projects/kmdsz/DN-2025.webp",
          "Images/projects/kmdsz/TM-2023.webp",
          "Images/projects/kmdsz/TM-2024.webp",
          "Images/projects/kmdsz/TM-2025.webp"
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
      }
    ]
  },
  {
    id: "logo",
    label: "Logo",
    short: "Logo",
    projects: [
      {
        title: "Logo designs",
        images: [
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
        title: "VIBE Festival",
        subtitle: "collaboration with Diversity Advertising",
        images: [
          "Images/projects/vibe/369699223_858150212349155_1000205966917858233_n.jpg",
          "Images/projects/vibe/Fellépők covers1-10.jpg",
          "Images/projects/vibe/MERCH poszt-02.jpg"
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
        title: "Frame-by-frame",
        subtitle: "Logo animations",
        images: [
          "Images/projects/motion/anim5.gif",
          "Images/projects/motion/anim6.gif",
          "Images/projects/motion/anim7.gif"
        ]
      },
      {
        title: "Logo animations",
        images: [
          "Images/projects/motion/anim1.gif",
          "Images/projects/motion/anim2.gif",
          "Images/projects/motion/anim3.gif",
          "Images/projects/motion/anim4.gif"
        ]
      },
      {
        title: "Inktober",
        subtitle: "some parts, 2021",
        images: [
          "Images/projects/inktober/8_gif.gif",
          "Images/projects/inktober/12_gif.gif",
          "Images/projects/inktober/17_gif.gif",
          "Images/projects/inktober/19_gif.gif",
          "Images/projects/inktober/22_gif.gif",
          "Images/projects/inktober/27_gif.gif",
          "Images/projects/inktober/28_gif.gif",
          "Images/projects/inktober/29_gif.gif"
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
        title: "VIBE APP",
        subtitle: "collaboration with Diversity Advertising",
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
        subtitle: "collaboration with Diversity Advertising",
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
        subtitle: "collaboration with Diversity Advertising",
        images: [
          "Images/projects/UI design/div (1).png",
          "Images/projects/UI design/div (2).png",
          "Images/projects/UI design/div (3).png",
          "Images/projects/UI design/div (4).png"
        ]
      },
      {
        title: "RentE WebApp",
        subtitle: "collaboration with Diversity Advertising",
        images: [
          "Images/projects/UI design/rente (1).webp",
          "Images/projects/UI design/rente (2).webp",
          "Images/projects/UI design/rente (3).webp",
          "Images/projects/UI design/rente (4).webp",
          "Images/projects/UI design/rente (5).webp",
          "Images/projects/UI design/rente (6).webp"
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
        subtitle: "collaboration with Diversity Advertising, 2023",
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
        subtitle: "collaboration with Diversity Advertising, 2023",
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
