import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { SiteContentProvider } from "./cms/SiteContentProvider";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ui } from "./lib/ui";
import { Analytics } from "@vercel/analytics/react";

function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found | Unique Sofa World Furniture";
  }, []);

  return (
    <div className={ui.pageTop}>
      <div className={`${ui.containerPage} ${ui.sectionGap}`}>
        <div className={`${ui.surfaceCard} p-8 text-center md:p-12`}>
          <p className="mx-auto inline-flex items-center justify-center gap-3 text-[0.72rem] font-extrabold tracking-[0.2em] text-[color:var(--accent)] uppercase before:h-px before:w-[1.85rem] before:bg-current before:content-['']">
            404
          </p>
          <h1 className="text-balance font-display text-4xl md:text-6xl">
            This page does not exist.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[color:var(--text-soft)]">
            The link may be outdated, or the page may have moved.
          </p>
          <a className={`${ui.buttonBase} ${ui.buttonPrimary} mt-8`} href="/">
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

function ScrollManager() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

export default function App() {
  return (
    <SiteContentProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollManager />
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
        <Footer />
        <Analytics />
      </div>
    </SiteContentProvider>
  );
}
