/**
 * Metadata for the Arejeng Recipe App.
 * This object contains application metadata used for SEO, social sharing, and theming.
 * @type {Object}
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the application for SEO and social sharing.
 * @property {Object} icons - Contains information about the app's icons.
 * @property {Array<Object>} icons.icon - List of icon files with metadata.
 * @property {string} icons.icon[].rel - The relationship type of the icon.
 * @property {string} icons.icon[].url - The URL or path of the icon file.
 * @property {string} [icons.icon[].sizes] - The size of the icon (e.g., "48x48").
 * @property {string} [icons.icon[].type] - The MIME type of the icon (e.g., "image/svg+xml").
 * @property {string} icons.apple - Path to the Apple touch icon.
 * @property {string} manifest - Path to the app's web manifest file.
 * @property {string} applicationName - The name of the application.
 * @property {Object} openGraph - Metadata for Open Graph (used for social sharing).
 * @property {string} openGraph.title - The Open Graph title.
 * @property {string} openGraph.description - The Open Graph description.
 * @property {string} openGraph.type - The Open Graph object type (e.g., "website").
 * @property {Array<Object>} openGraph.images - List of Open Graph image objects.
 * @property {string} openGraph.images[].url - The URL of the Open Graph image.
 * @property {number} openGraph.images[].width - The width of the Open Graph image in pixels.
 * @property {number} openGraph.images[].height - The height of the Open Graph image in pixels.
 * @property {string} openGraph.images[].alt - Alternative text for the Open Graph image.
 * @property {Array<string>} keywords - A list of keywords related to the application for SEO.
 * @property {string} author - The name of the app's author or developer team.
 * @property {string} robots - Directives for search engine crawlers (e.g., "index, follow").
 */
export const metadata = {
        title: "Arejeng Recipes",
        description: "Arejeng Recipe App is your ultimate culinary companion, offering an extensive collection of easy-to-follow recipes that cater to every taste and occasion.",
        icons: {
          icon: [
            { rel: "icon", url: "/favicon-48x48.png", sizes: "48x48" },
            { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
            { rel: "shortcut icon", url: "/favicon.ico" },
          ],
          apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
        applicationName: "Arejeng Recipe App",
        openGraph: {
          title: "Arejeng Recipe App",
          description: "Discover a variety of recipes with Arejeng Recipe App",
          type: "website",
          images: [
            {
              url: "/ArejengLogo.png",
              width: 800,
              height: 600,
              alt: "Arejeng Recipe App",
            },
          ],
        },
        keywords: ["recipes", "cooking", "food", "ArejengRecipeApp"],
        author: "Group_B",
        robots: "index, follow",
      };
      
      /**
       * Viewport settings for the app.
       * Includes theming and display configuration.
       * @type {Object}
       * @property {string} themeColor - The theme color for the app, used in the browser UI.
       */
      export const viewport = {
        themeColor: "#ffffff",
      };
      