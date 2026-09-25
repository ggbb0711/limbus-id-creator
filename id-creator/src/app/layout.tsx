import React from "react";

export default function RootLayout({children}:{children: React.ReactNode}){
    return ( <html lang="en">
  <head>
    <meta name="theme-color" content="#000000" />

    <meta name="description" content="Create custom Limbus Company Identity and E.G.O cards with our fan-made character creator. Design, customize, and share your own characters with the community." />
    <meta name="keywords" content="Limbus Company, ID creator, EGO creator, fan character creator, custom identity card, Project Moon, Limbus Company fan tool" />
    <meta name="author" content="Limbus ID Creator" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://limbus-company-id-creator.com/" />
    <meta property="og:title" content="Limbus Company ID Creator - Custom Card Maker" />
    <meta property="og:description" content="Create custom Limbus Company Identity and E.G.O. Design, customize, and share your own characters with the community." />
    <meta property="og:image" content="https://limbus-company-id-creator.com/Images/SiteLogo.webp" />
    <meta property="og:site_name" content="Limbus ID Creator" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Limbus Company ID Creator - Custom Characacter Maker" />
    <meta name="twitter:description" content="Create custom Limbus Company Identity and E.G.O. Design, customize, and share your own characters with the community." />
    <meta name="twitter:image" content="https://limbus-company-id-creator.com/Images/SiteLogo.webp" />

    {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" /> */}
    <script type="text/javascript" src="//www.turnjs.com/lib/turn.min.js "></script>
    <title>Limbus Company id creator - Custom character creator</title>
  </head>
  <body>
    <div id="root">{children}</div>
  </body>
</html>)
}