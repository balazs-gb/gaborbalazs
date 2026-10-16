/* =====================================================================
   SKILLS DATABASE  (used by the home page, index.html)
   ---------------------------------------------------------------------
   HOW TO ADD A NEW SOFTWARE:
     Copy one line from "software" and paste it where you want it to
     appear (the list is shown in this order). Change the values.

       label   the short text inside the circle   (e.g. "Ai")
       name    the full name shown when you hover / tap the circle
       score   how much you know it, from 1 to 100

   HOW TO ADD A NEW ABILITY:
     Same thing in the "abilities" list:

       name    the text above the bar
       score   from 1 to 100

   Don't forget the comma at the end of every line except the last one.
   ===================================================================== */

const skillsData = {

  software: [
    { label: "Ai",         name: "Adobe Illustrator",  score: 99 },
    { label: "Ps",         name: "Adobe Photoshop",    score: 90 },
    { label: "Ae",         name: "Adobe After Effects", score: 85 },
    { label: "Id",         name: "Adobe Indesign",     score: 80 },
    { label: "Au",         name: "Adobe Audition",     score: 75 },
    { label: "Lr",         name: "Adobe Lightroom",    score: 80 },
    { label: "An",         name: "Adobe Animate",      score: 70 },
    { label: "Fr",         name: "Adobe Fresco",       score: 80 },
    { label: "Figma",      name: "Figma",              score: 80 },
    { label: "Affinity",   name: "Affinity",           score: 65 },
    { label: "Davinci",    name: "Davinci Resolve",    score: 75 },
    { label: "Blender",    name: "Blender",            score: 40 },
    { label: "Font Forge", name: "Font Forge",         score: 55 },
    { label: "VS Code",    name: "Visual Studio Code", score: 15 },
    { label: "TV Paint",   name: "TV Paint",           score: 40 },
    { label: "MS Office",  name: "Microsoft Office",   score: 90 }
  ],

  abilities: [
    { name: "Brand and Logo Design",                 score: 100 },
    { name: "UI Design",                             score: 100 },
    { name: "Motion Graphics and Video Editing",     score: 90 },
    { name: "Website (HTML, CSS, JS)",               score: 85 },
    { name: "Editorial works and Typeface Design",   score: 80 },
    { name: "3D modeling",                           score: 40 }
  ]
};
