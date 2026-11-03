import { Toaster } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SessionProvider } from "../components/Session";
import "./globals.css";

export const metadata = {
  title: { default: "StudioSpace — The Studio Index", template: "%s | StudioSpace" },
  description: "Discover independent production spaces in Bangladesh and reserve studio hours.",
};
const themeScript =
  "try{document.documentElement.dataset.theme=localStorage.getItem('studio-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SessionProvider>
          <Header />
          <main id="content">{children}</main>
          <Footer />
        </SessionProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
