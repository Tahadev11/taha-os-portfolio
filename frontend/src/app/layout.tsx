
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = "Taha Siddique | Software Engineer";

const defaultDescription =
  "Taha Siddique's developer portfolio. Explore projects, skills, experience, education, and certificates.";

async function getCachedSettings() {
  "use cache";

  cacheLife("minutes");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api/v1";

  const response = await fetch(`${apiUrl}/settings/public`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch public website settings");
  }

  return response.json();
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getCachedSettings();

    const title =
      settings.seoTitle || settings.siteTitle || defaultTitle;

    const description =
      settings.seoDescription ||
      settings.siteDescription ||
      defaultDescription;

    return {
      title,
      description,

      icons: settings.faviconUrl
        ? {
            icon: settings.faviconUrl,
          }
        : undefined,

      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Failed to load website metadata:", error);

    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }
}

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
