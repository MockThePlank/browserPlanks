const defaultTextTransition = {
    type: "fade",
    duration: 500,
    easing: "ease-in-out",
};
function mergeTransition(base, override) {
    if (!override)
        return base;
    return { ...base, ...override };
}
export function createIntroSlide(overrides = {}) {
    const base = {
        id: "intro",
        type: "text",
        title: "Intro",
        subtitle: "",
        body: "Welcome to the deck.",
        transition: { type: "fade", duration: 550, easing: "ease-out" },
    };
    return {
        ...base,
        ...overrides,
        type: "text",
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
export function createTextSlide(overrides = {}) {
    const base = {
        id: "text",
        type: "text",
        title: "Text Slide",
        subtitle: "",
        body: "Add your content here.",
        transition: defaultTextTransition,
    };
    return {
        ...base,
        ...overrides,
        type: "text",
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
export function createTableSlide(overrides = {}) {
    const base = {
        id: "table",
        type: "table",
        title: "Table Slide",
        table: { columns: [], rows: [] },
        transition: { type: "slide", duration: 450, easing: "cubic-bezier(.25,.8,.25,1)" },
    };
    return {
        ...base,
        ...overrides,
        type: "table",
        table: {
            ...base.table,
            ...(overrides.table || {}),
            columns: overrides.table?.columns ?? base.table?.columns ?? [],
            rows: overrides.table?.rows ?? base.table?.rows ?? [],
        },
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
export function createVideoSlide(overrides = {}) {
    const base = {
        id: "video",
        type: "video",
        title: "Video Slide",
        video: {
            src: "",
            autoplay: false,
            controls: true,
            muted: false,
            poster: "",
        },
        transition: { type: "zoom", duration: 600, easing: "ease-out" },
    };
    return {
        ...base,
        ...overrides,
        type: "video",
        video: { ...base.video, ...(overrides.video || {}) },
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
export function createImageSlide(overrides = {}) {
    const base = {
        id: "image",
        type: "image",
        title: "Image Slide",
        subtitle: "",
        image: { src: "", alt: "" },
        transition: defaultTextTransition,
    };
    return {
        ...base,
        ...overrides,
        type: "image",
        image: { ...base.image, ...(overrides.image || {}) },
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
export function createOutroSlide(overrides = {}) {
    const base = {
        id: "outro",
        type: "text",
        title: "Outro",
        subtitle: "",
        body: "Thank you!",
        transition: { type: "fade", duration: 500, easing: "ease-in" },
    };
    return {
        ...base,
        ...overrides,
        type: "text",
        transition: mergeTransition(base.transition, overrides.transition),
    };
}
