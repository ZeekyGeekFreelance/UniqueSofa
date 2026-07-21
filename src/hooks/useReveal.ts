import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const observed = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    // Also observe stagger containers — auto-delay their [data-reveal] children
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const container = entry.target as HTMLElement;
            const children = container.querySelectorAll<HTMLElement>("[data-reveal]");
            children.forEach((child, i) => {
              const base = Number(container.dataset.revealStagger ?? 80);
              child.style.transitionDelay = `${i * base}ms`;
              child.classList.add("is-visible");
            });
            staggerObserver.unobserve(container);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -32px 0px" },
    );

    const observeElement = (element: HTMLElement) => {
      if (observed.has(element) || element.classList.contains("is-visible")) return;
      observed.add(element);
      observer.observe(element);
    };

    const collectRevealNodes = (root: ParentNode) => {
      if (root instanceof HTMLElement) {
        if (root.matches("[data-reveal]")) observeElement(root);
        if (root.matches("[data-reveal-stagger]")) staggerObserver.observe(root);
      }
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observeElement);
      root.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((el) => {
        staggerObserver.observe(el);
      });
    };

    collectRevealNodes(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) collectRevealNodes(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      staggerObserver.disconnect();
    };
  }, []);
}
