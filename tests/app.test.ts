/// <reference types="vitest" />
import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, clamp, Deck, SlideRenderer, TransitionManager } from "../app.js";
import type { Presentation, Slide } from "../types.js";

describe("helpers", () => {
  it("clamps numeric values", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe("SlideRenderer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    document.documentElement.className = "";
    window.location.hash = "";
  });

  it("creates revealable text slides with hidden tokens and overlay images", () => {
    const renderer = new SlideRenderer();
    const slide: Slide = {
      id: "demo",
      type: "text",
      title: "Hello",
      body: "Alpha Beta",
      reveal: { body: "word" },
      revealSpeedMs: { body: 75 },
      image: { src: "assets/images/foo.png", alt: "Foo" },
    };

    const el = renderer.createSlide(slide, 0, 2);
    const body = el.querySelector<HTMLElement>('[data-testid="slide-demo-body"]');
    expect(body?.dataset.revealMode).toBe("word");
    expect(body?.dataset.revealSpeedMs).toBe("75");

    const tokens = body?.querySelectorAll(".reveal-token") ?? [];
    expect(tokens.length).toBe(2);
    tokens.forEach((token) => {
      expect(token.classList.contains("is-hidden")).toBe(true);
      expect(token.getAttribute("aria-hidden")).toBe("true");
    });

    const wrapper = el.querySelector<HTMLElement>('[data-testid="slide-demo-image-wrapper"]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.classList.contains("image-overlay")).toBe(true);
  });
});

describe("Deck navigation and reveal flow", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    document.documentElement.className = "";
    window.location.hash = "";
  });

  const buildDeck = () => {
    const slides: Slide[] = [
      { id: "one", type: "text", title: "Slide 1", body: "First body" },
      { id: "two", type: "text", title: "Slide 2", body: "Second body" },
    ];
    const presentation: Presentation = { id: "test", name: "Test Deck", slides };
    const stageEl = document.createElement("div");
    const slidesRootEl = document.createElement("div");
    const indicatorEl = document.createElement("div");

    const transitioner = new TransitionManager(slidesRootEl);
    transitioner.apply = vi.fn(async (oldEl: HTMLElement | null, newEl: HTMLElement) => {
      oldEl?.remove();
      slidesRootEl.appendChild(newEl);
      newEl.classList.add("is-active");
    });

    const deck = new Deck(presentation, { stageEl, slidesRootEl, indicatorEl }, transitioner);
    return { deck, slidesRootEl, indicatorEl };
  };

  it("updates hash, indicator and active slide on navigation", async () => {
    const { deck, slidesRootEl, indicatorEl } = buildDeck();

    await deck.goTo(0, { direction: "forward" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(indicatorEl.textContent).toBe("Slide 1 / 2");
    expect(window.location.hash).toBe("#/1");
    expect(slidesRootEl.querySelector('[data-testid="slide-one-root"]')).toBeTruthy();

    await deck.goTo(1, { direction: "forward" });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(indicatorEl.textContent).toBe("Slide 2 / 2");
    expect(window.location.hash).toBe("#/2");
    expect(slidesRootEl.querySelector('[data-testid="slide-two-root"]')).toBeTruthy();
  });

  it("reveals staged content in the active slide", async () => {
    const { deck, slidesRootEl } = buildDeck();
    await deck.goTo(0, { direction: "forward" });

    const revealed = deck.revealHiddenContent();
    expect(revealed).toBe(true);

    const body = slidesRootEl.querySelector<HTMLElement>('[data-testid="slide-one-body"]');
    expect(body?.classList.contains("is-hidden")).toBe(false);
    expect(body?.getAttribute("aria-hidden")).toBeNull();
  });
});

describe("applyTheme", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
    document.documentElement.className = "";
    document.body.className = "";
    window.location.hash = "";
  });

  it("updates theme classes and appends stylesheets without duplicates", () => {
    document.documentElement.className = "theme-old keep";
    document.body.className = "body-old";

    const existing = document.createElement("link");
    existing.rel = "stylesheet";
    existing.href = "/old.css";
    existing.dataset.themeHref = "/old.css";
    document.head.appendChild(existing);

    applyTheme({
      className: "theme-new",
      bodyClassName: "body-new",
      stylesheets: ["/old.css", "/fresh.css"],
    });

    expect(document.documentElement.classList.contains("theme-old")).toBe(false);
    expect(document.documentElement.classList.contains("theme-new")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("theme-new");
    expect(document.body.classList.contains("body-new")).toBe(true);
    expect(document.body.classList.contains("body-old")).toBe(true);

    const themeHrefs = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>("link[data-theme-href]")
    ).map((link) => link.href);
    const expectedBase = `${window.location.origin}/`;
    expect(themeHrefs).toEqual([`${expectedBase}old.css`, `${expectedBase}fresh.css`]);
  });
});
