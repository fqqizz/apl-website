/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://apexpremiereleague.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/api/*"],
  robotsTxtOptions: {
    additionalSitemaps: [
      "https://apexpremiereleague.in/sitemap.xml"
    ]
  }
};
