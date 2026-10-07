export const SITE_LINKS = {
    kofi: "https://ko-fi.com/johnlimbusidmaker",
    contactEmail: "johnidmaker@gmail.com",
    discordHandle: "_johnlimbusmaker",
    fanContentPolicy: "https://x.com/ProjMoonStudio/status/1629085462236397573?lang=en",
    limbusCompany: "https://limbuscompany.com/",
} as const

export const mailtoLink = (email: string = SITE_LINKS.contactEmail) => `mailto:${email}`
