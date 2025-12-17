import { getPresentation } from "./presentations/index.js";
const defaultTransition = {
    type: "fade",
    duration: 500,
    easing: "ease-in-out",
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
class SlideRenderer {
    constructor() {
        this.templates = {
            text: (el, slide, ctx) => {
                const revealConfig = slide.type === "text" && slide.reveal ? slide.reveal : {};
                const revealSpeeds = slide.type === "text" && slide.revealSpeedMs ? slide.revealSpeedMs : undefined;
                const titleMode = revealConfig.title ?? "instant";
                const subtitleMode = revealConfig.subtitle ?? "instant";
                const bodyMode = revealConfig.body ?? "all";
                const title = this.createRevealableText("h1", slide.title || "Title missing", titleMode, `${ctx.baseTestId}-title`, { speedMs: this.getRevealSpeed(revealSpeeds, "title") });
                const subtitle = this.createRevealableText("h2", slide.subtitle || "", subtitleMode, `${ctx.baseTestId}-subtitle`, { speedMs: this.getRevealSpeed(revealSpeeds, "subtitle") });
                const body = this.createRevealableText("p", slide.body, bodyMode, `${ctx.baseTestId}-body`, {
                    asSlideContent: true,
                    classNames: ["slide-body", "slide-content"],
                    speedMs: this.getRevealSpeed(revealSpeeds, "body"),
                });
                el.append(title, subtitle, body);
                this.appendOptionalImage(el, slide, ctx);
            },
            table: (el, slide, ctx) => {
                const heading = document.createElement("h1");
                heading.textContent = slide.title || "Tabelle";
                heading.dataset.testid = `${ctx.baseTestId}-title`;
                const table = document.createElement("table");
                table.classList.add("slide-content", "is-hidden");
                table.setAttribute("aria-hidden", "true");
                table.setAttribute("role", "table");
                table.dataset.testid = `${ctx.baseTestId}-table`;
                const columns = slide.table?.columns || [];
                const rows = slide.table?.rows || [];
                if (columns.length) {
                    const thead = document.createElement("thead");
                    thead.dataset.testid = `${ctx.baseTestId}-table-head`;
                    const headRow = document.createElement("tr");
                    columns.forEach((col) => {
                        const th = document.createElement("th");
                        th.scope = "col";
                        th.textContent = col;
                        headRow.appendChild(th);
                    });
                    thead.appendChild(headRow);
                    table.appendChild(thead);
                }
                const tbody = document.createElement("tbody");
                tbody.dataset.testid = `${ctx.baseTestId}-table-body`;
                rows.forEach((row, rowIdx) => {
                    const tr = document.createElement("tr");
                    tr.dataset.testid = `${ctx.baseTestId}-row-${rowIdx + 1}`;
                    row.forEach((cell, cellIdx) => {
                        const td = document.createElement("td");
                        td.textContent = cell;
                        td.dataset.testid = `${ctx.baseTestId}-cell-${rowIdx + 1}-${cellIdx + 1}`;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                if (!rows.length) {
                    const empty = document.createElement("p");
                    empty.className = "muted slide-content is-hidden";
                    empty.setAttribute("aria-hidden", "true");
                    empty.textContent =
                        "Keine Daten vorhanden. Ergänze 'table.rows' in der Slide-Konfiguration.";
                    el.append(heading, empty);
                    return;
                }
                el.append(heading, table);
                this.appendOptionalImage(el, slide, ctx);
            },
            video: (el, slide, ctx) => {
                const heading = document.createElement("h1");
                heading.textContent = slide.title || "Video";
                heading.dataset.testid = `${ctx.baseTestId}-title`;
                const wrapper = document.createElement("div");
                wrapper.className = "video-wrapper slide-content is-hidden";
                wrapper.setAttribute("aria-hidden", "true");
                wrapper.dataset.testid = `${ctx.baseTestId}-video-wrapper`;
                if (!slide.video?.src) {
                    const fallback = document.createElement("p");
                    fallback.className = "muted";
                    fallback.textContent =
                        "Kein Video-URL hinterlegt. Setze 'video.src' in der Slide-Konfiguration.";
                    fallback.dataset.testid = `${ctx.baseTestId}-video-fallback`;
                    wrapper.appendChild(fallback);
                    el.append(heading, wrapper);
                    return;
                }
                const video = document.createElement("video");
                video.src = slide.video.src;
                video.preload = "metadata";
                video.playsInline = true;
                video.controls = slide.video.controls ?? true;
                video.autoplay = slide.video.autoplay ?? false;
                video.muted = slide.video.muted ?? false;
                video.poster = slide.video.poster ?? "";
                video.dataset.testid = `${ctx.baseTestId}-video`;
                wrapper.appendChild(video);
                el.append(heading, wrapper);
            },
            image: (el, slide, ctx) => {
                const heading = document.createElement("h1");
                heading.textContent = slide.title || "Bild";
                heading.dataset.testid = `${ctx.baseTestId}-title`;
                const subtitle = document.createElement("h2");
                subtitle.textContent = slide.subtitle || "";
                subtitle.dataset.testid = `${ctx.baseTestId}-subtitle`;
                const wrapper = this.createImageWrapper(slide.image ?? {}, ctx.baseTestId, {
                    overlay: false,
                    hidden: false,
                });
                wrapper.dataset.testid = `${ctx.baseTestId}-image-wrapper`;
                el.append(heading, subtitle, wrapper);
            },
            finale: (el, slide, ctx) => {
                el.classList.add("rainbow-finale");
                const heading = document.createElement("h1");
                heading.textContent = slide.title || "Finale";
                heading.dataset.testid = `${ctx.baseTestId}-title`;
                const subtitle = document.createElement("h2");
                subtitle.textContent = slide.subtitle || "";
                subtitle.dataset.testid = `${ctx.baseTestId}-subtitle`;
                el.append(heading, subtitle);
            },
        };
    }
    createSlide(slide, index, total) {
        const el = document.createElement("section");
        const templateKey = (slide.type ?? "text");
        el.className = `slide slide-type-${slide.type || "text"}`;
        el.dataset.slideId = slide.id || `slide-${index}`;
        const ctx = {
            index,
            total,
            baseTestId: this.buildTestId(slide, index),
        };
        el.dataset.testid = `${ctx.baseTestId}-root`;
        el.setAttribute("aria-label", `Slide ${index + 1} von ${total}: ${slide.title ?? slide.type ?? "Slide"}`);
        const template = this.templates[templateKey] || this.templates.text;
        template.call(this, el, slide, ctx);
        return el;
    }
    buildTestId(slide, index) {
        const baseId = slide.id || `slide-${index + 1}`;
        return `slide-${baseId}`;
    }
    createRevealableText(tag, text, mode, testId, options = {}) {
        const { asSlideContent = false, classNames = [], speedMs } = options;
        const el = document.createElement(tag);
        if (classNames.length)
            el.classList.add(...classNames);
        el.dataset.testid = testId;
        const fallbackText = text ??
            (tag === "p"
                ? "This text slide has no body. Add 'body' to the slide object."
                : "");
        if (mode === "instant") {
            el.textContent = fallbackText;
            return el;
        }
        if (mode === "all") {
            el.textContent = fallbackText;
            if (asSlideContent)
                el.classList.add("slide-content");
            el.classList.add("is-hidden");
            el.setAttribute("aria-hidden", "true");
            el.dataset.revealMode = "all";
            if (speedMs)
                el.dataset.revealSpeedMs = String(speedMs);
            return el;
        }
        el.dataset.revealMode = mode;
        if (speedMs)
            el.dataset.revealSpeedMs = String(speedMs);
        if (asSlideContent)
            el.classList.add("slide-content");
        const tokens = mode === "word" ? this.tokenizeWords(fallbackText) : this.tokenizeChars(fallbackText);
        tokens.forEach((token) => {
            if (token === "\n") {
                el.append(document.createTextNode("\n"));
                return;
            }
            if (/^\s+$/.test(token)) {
                el.append(document.createTextNode(token));
                return;
            }
            const span = document.createElement("span");
            span.className = "reveal-token is-hidden";
            span.setAttribute("aria-hidden", "true");
            span.textContent = token;
            el.append(span);
            if (mode === "word") {
                el.append(document.createTextNode(" "));
            }
        });
        return el;
    }
    getRevealSpeed(speeds, key, fallback = 220) {
        return speeds?.[key] ?? fallback;
    }
    tokenizeWords(text) {
        const tokens = [];
        let current = "";
        for (const ch of text) {
            if (/\s/.test(ch)) {
                if (current) {
                    tokens.push(current);
                    current = "";
                }
                tokens.push(ch);
            }
            else {
                current += ch;
            }
        }
        if (current)
            tokens.push(current);
        return tokens;
    }
    tokenizeChars(text) {
        return Array.from(text);
    }
    appendOptionalImage(el, slide, ctx) {
        if (!slide.image?.src)
            return;
        const wrapper = this.createImageWrapper(slide.image, ctx.baseTestId, {
            overlay: true,
            hidden: false,
        });
        wrapper.dataset.testid = `${ctx.baseTestId}-image-wrapper`;
        el.append(wrapper);
    }
    createImageWrapper(imageConfig = {}, baseTestId, { overlay = true, hidden = true } = {}) {
        const wrapper = document.createElement("div");
        wrapper.className = `image-wrapper${overlay ? " image-overlay" : ""} slide-content`;
        if (hidden) {
            wrapper.classList.add("is-hidden");
            wrapper.setAttribute("aria-hidden", "true");
        }
        if (baseTestId) {
            wrapper.dataset.testid = `${baseTestId}-image-wrapper`;
        }
        const src = imageConfig.src;
        if (!src)
            return wrapper;
        const img = document.createElement("img");
        img.src = src;
        img.alt = imageConfig.alt || "Bild";
        img.loading = "lazy";
        img.decoding = "async";
        if (baseTestId) {
            img.dataset.testid = `${baseTestId}-image`;
        }
        wrapper.appendChild(img);
        if (imageConfig.caption && !overlay) {
            const caption = document.createElement("p");
            caption.className = "image-caption";
            caption.textContent = imageConfig.caption;
            if (baseTestId) {
                caption.dataset.testid = `${baseTestId}-image-caption`;
            }
            wrapper.appendChild(caption);
        }
        return wrapper;
    }
}
class TransitionManager {
    constructor(containerEl) {
        this.containerEl = containerEl;
    }
    cleanupDangling(allowed = new Set()) {
        this.containerEl.querySelectorAll(".slide").forEach((slide) => {
            if (allowed.has(slide))
                return;
            if (slide.classList.contains("is-active") ||
                slide.classList.contains("is-entering")) {
                return;
            }
            slide.remove();
        });
    }
    apply(oldEl, newEl, options) {
        this.cleanupDangling(new Set(oldEl ? [oldEl] : []));
        const type = options?.type ?? defaultTransition.type ?? "fade";
        const duration = options?.duration ?? defaultTransition.duration ?? 500;
        const easing = options?.easing ?? defaultTransition.easing ?? "ease-in-out";
        const direction = options?.direction || "forward";
        newEl.style.setProperty("--t-duration", `${duration}ms`);
        newEl.style.setProperty("--t-easing", easing);
        newEl.classList.add(`t-${type}`, `dir-${direction}`, "is-entering");
        this.containerEl.appendChild(newEl);
        if (oldEl) {
            oldEl.style.setProperty("--t-duration", `${duration}ms`);
            oldEl.style.setProperty("--t-easing", easing);
            oldEl.classList.add(`t-${type}`, `dir-${direction}`, "is-leaving");
        }
        const run = () => {
            newEl.classList.add("is-active");
            newEl.classList.remove("is-entering");
            if (oldEl)
                oldEl.classList.add("is-leaving-active");
        };
        requestAnimationFrame(() => {
            requestAnimationFrame(run);
        });
        return new Promise((resolve) => {
            const finish = () => {
                oldEl?.remove();
                resolve();
            };
            const timer = setTimeout(finish, duration + 80);
            const onDone = () => {
                clearTimeout(timer);
                finish();
            };
            newEl.addEventListener("transitionend", onDone, { once: true });
            if (oldEl)
                oldEl.addEventListener("transitionend", onDone, { once: true });
        });
    }
}
class Deck {
    constructor(presentation, { stageEl, slidesRootEl, indicatorEl }, transitioner) {
        this.renderer = new SlideRenderer();
        this.currentIndex = -1;
        this.isRoutingFromHash = false;
        this.isTransitioning = false;
        this.queuedIndex = null;
        this.revealIntervals = new Map();
        this.presentation = presentation;
        this.slides = presentation.slides;
        this.stageEl = stageEl;
        this.slidesRootEl = slidesRootEl;
        this.indicatorEl = indicatorEl;
        this.transitioner = transitioner ?? new TransitionManager(slidesRootEl);
    }
    init() {
        this.bindEvents();
        const initialIndex = this.indexFromHash();
        const hasHash = Boolean(window.location.hash);
        this.goTo(initialIndex, { direction: "forward", fromHash: hasHash });
        this.stageEl.focus();
    }
    bindEvents() {
        document.querySelector(".nav-btn.prev")?.addEventListener("click", () => this.prev());
        document.querySelector(".nav-btn.next")?.addEventListener("click", () => this.next());
        this.stageEl.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement))
                return;
            if (target.closest("button, video, a, input, textarea"))
                return;
            if (this.revealHiddenContent())
                return;
            this.next();
        });
        window.addEventListener("keydown", (event) => {
            const activeTag = document.activeElement?.tagName?.toLowerCase();
            if (["input", "textarea", "select"].includes(activeTag ?? ""))
                return;
            if (["ArrowRight", "PageDown"].includes(event.key)) {
                event.preventDefault();
                this.next();
            }
            if (["ArrowLeft", "PageUp"].includes(event.key)) {
                event.preventDefault();
                this.prev();
            }
            if (event.key === "Home") {
                this.goTo(0);
            }
            if (event.key === "End") {
                this.goTo(this.slides.length - 1);
            }
            if (event.key?.toLowerCase() === "f") {
                this.stageEl.focus();
            }
        });
        window.addEventListener("hashchange", () => {
            const target = this.indexFromHash();
            this.goTo(target, { fromHash: true });
        });
    }
    indexFromHash() {
        const match = window.location.hash.match(/#\/(\d+)/);
        if (!match)
            return 0;
        const parsed = Number.parseInt(match[1], 10) - 1;
        return clamp(parsed, 0, this.slides.length - 1);
    }
    updateHash() {
        this.isRoutingFromHash = true;
        window.location.hash = `#/${this.currentIndex + 1}`;
        setTimeout(() => (this.isRoutingFromHash = false), 0);
    }
    async goTo(targetIndex, { direction, fromHash = false } = {}) {
        this.stopRevealIntervals();
        const clampedIndex = clamp(targetIndex, 0, this.slides.length - 1);
        const isFirstRender = this.currentIndex === -1;
        if (clampedIndex === this.currentIndex && !isFirstRender)
            return;
        if (this.isTransitioning && !isFirstRender) {
            this.queuedIndex = clampedIndex;
            return;
        }
        this.isTransitioning = true;
        const newDirection = direction ||
            (isFirstRender
                ? "forward"
                : clampedIndex > this.currentIndex
                    ? "forward"
                    : "backward");
        const nextSlide = this.slides[clampedIndex];
        const nextEl = this.renderer.createSlide(nextSlide, clampedIndex, this.slides.length);
        const currentEl = this.slidesRootEl.querySelector(".slide.is-active");
        this.pauseMedia(currentEl);
        const transition = {
            ...defaultTransition,
            ...(nextSlide.transition || {}),
            direction: newDirection,
        };
        await this.transitioner.apply(currentEl, nextEl, transition);
        this.currentIndex = clampedIndex;
        this.updateIndicator();
        this.stageEl.setAttribute("aria-label", `Slide ${clampedIndex + 1} von ${this.slides.length}: ${nextSlide.title ?? nextSlide.type ?? ""}`);
        if (!fromHash && !this.isRoutingFromHash && this.currentIndex >= 0) {
            this.updateHash();
        }
        this.isTransitioning = false;
        if (this.queuedIndex !== null && this.queuedIndex !== this.currentIndex) {
            const nextTarget = this.queuedIndex;
            this.queuedIndex = null;
            this.goTo(nextTarget, { direction: nextTarget > this.currentIndex ? "forward" : "backward" });
        }
        else {
            this.queuedIndex = null;
        }
    }
    next() {
        this.goTo(this.currentIndex + 1, { direction: "forward" });
    }
    prev() {
        this.goTo(this.currentIndex - 1, { direction: "backward" });
    }
    revealHiddenContent() {
        const activeSlide = this.slidesRootEl.querySelector(".slide.is-active");
        if (!activeSlide)
            return false;
        const revealables = Array.from(activeSlide.querySelectorAll("[data-reveal-mode]"));
        for (const el of revealables) {
            const mode = el.dataset.revealMode;
            const speed = Number.parseInt(el.dataset.revealSpeedMs || "", 10) || 220;
            if (mode === "all" && el.classList.contains("is-hidden")) {
                el.classList.remove("is-hidden");
                el.removeAttribute("aria-hidden");
                return true;
            }
            if (mode === "word" || mode === "char") {
                if (this.revealIntervals.has(el))
                    continue;
                const token = el.querySelector(".reveal-token.is-hidden");
                if (!token)
                    continue;
                token.classList.remove("is-hidden");
                token.removeAttribute("aria-hidden");
                const intervalId = window.setInterval(() => {
                    const nextToken = el.querySelector(".reveal-token.is-hidden");
                    if (!nextToken) {
                        clearInterval(intervalId);
                        this.revealIntervals.delete(el);
                        return;
                    }
                    nextToken.classList.remove("is-hidden");
                    nextToken.removeAttribute("aria-hidden");
                }, speed);
                this.revealIntervals.set(el, intervalId);
                return true;
            }
        }
        const content = activeSlide.querySelector(".slide-content.is-hidden");
        if (!content)
            return false;
        content.classList.remove("is-hidden");
        content.removeAttribute("aria-hidden");
        return true;
    }
    pauseMedia(el) {
        if (!el)
            return;
        el.querySelectorAll("video").forEach((video) => {
            video.pause();
            video.currentTime = 0;
        });
    }
    updateIndicator() {
        const label = `Slide ${this.currentIndex + 1} / ${this.slides.length}`;
        if (this.indicatorEl)
            this.indicatorEl.textContent = label;
    }
    stopRevealIntervals() {
        this.revealIntervals.forEach((id) => clearInterval(id));
        this.revealIntervals.clear();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const stageEl = document.getElementById("stage");
    const slidesRootEl = document.getElementById("slides-root");
    const indicatorEl = document.getElementById("slide-indicator");
    const baseWidth = 1200;
    const baseHeight = 675;
    const params = new URLSearchParams(window.location.search);
    const presentationId = params.get("deck") || params.get("presentation") || "default";
    const presentation = getPresentation(presentationId);
    if (!(stageEl instanceof HTMLElement) || !(slidesRootEl instanceof HTMLElement)) {
        console.error("Stage oder Slides-Root fehlt in der Seite.");
        return;
    }
    const updateUiScale = () => {
        const scale = Math.min(stageEl.clientWidth / baseWidth, stageEl.clientHeight / baseHeight);
        document.documentElement.style.setProperty("--ui-scale", scale.toFixed(3));
    };
    window.addEventListener("resize", updateUiScale);
    window.addEventListener("orientationchange", updateUiScale);
    applyTheme(presentation.theme);
    const deck = new Deck(presentation, { stageEl, slidesRootEl, indicatorEl });
    deck.init();
    updateUiScale();
});
function applyTheme(theme = {}) {
    const root = document.documentElement;
    const body = document.body;
    // Remove old theme classes to avoid overlaps.
    Array.from(root.classList)
        .filter((cls) => cls.startsWith("theme-"))
        .forEach((cls) => root.classList.remove(cls));
    if (theme.className)
        root.classList.add(theme.className);
    if (theme.bodyClassName)
        body.classList.add(theme.bodyClassName);
    root.dataset.theme = theme.className || "theme-default";
    const stylesheets = Array.isArray(theme.stylesheets) ? theme.stylesheets : [];
    stylesheets.forEach((href) => {
        if (!href)
            return;
        if (document.head.querySelector(`link[data-theme-href="${href}"]`))
            return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.dataset.themeHref = href;
        document.head.appendChild(link);
    });
}
export { applyTheme, clamp, Deck, SlideRenderer, TransitionManager };
