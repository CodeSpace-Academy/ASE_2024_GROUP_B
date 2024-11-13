import './global.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Head from 'next/head';

/**
 * Metadata for the Arejeng Recipe App.
 * @typedef {Object} Metadata
 * @property {string} title - The title of the application.
 * @property {string} description - Description of the app for SEO and social sharing.
 * @property {Object} icons - Icon details for favicon and apple touch icons.
 * @property {string} icons.icon[].rel - Type of icon.
 * @property {string} icons.icon[].url - Path to the icon image.
 * @property {string} icons.icon[].sizes - Icon dimensions.
 * @property {string} icons.apple - Path to the apple touch icon.
 * @property {string} manifest - Path to the web manifest file.
 * @property {string} applicationName - Name of the application.
 * @property {Object} openGraph - Open Graph meta properties.
 * @property {string} openGraph.title - Open Graph title.
 * @property {string} openGraph.description - Open Graph description.
 * @property {string} openGraph.type - Type of content (e.g., website).
 * @property {Object[]} openGraph.images - Images used in Open Graph.
 * @property {string} openGraph.images[].url - Image URL.
 * @property {number} openGraph.images[].width - Image width in pixels.
 * @property {number} openGraph.images[].height - Image height in pixels.
 * @property {string} openGraph.images[].alt - Alt text for the image.
 * @property {string[]} keywords - SEO keywords for the application.
 * @property {string} author - Author of the application.
 * @property {string} robots - SEO robots directive.
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
 * @typedef {Object} Viewport
 * @property {string} themeColor - Theme color for the viewport.
 */
export const viewport = {
  themeColor: "#ffffff",
};

/**
 * Root layout component of the application, providing the main structure
 * with the header, main content area, and footer.
 * @function RootLayout
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements to be rendered in the main section.
 * @returns {JSX.Element} The HTML layout for the page.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="author" content={metadata.author} />
        <link rel="manifest" href={metadata.manifest} />
        
      </Head >
      <body className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}