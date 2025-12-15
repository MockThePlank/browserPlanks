import { createIntroSlide, createOutroSlide, createTextSlide } from "../slides/templates.js";
// 10 Text-Slides auf Basis von slide01, jeweils mit anpassbarem Inhalt.
const textSlideOverrides = [
    {
        title: "What is Terminal AI?",
        subtitle: "Bringing AI to your command line",
        body: "Terminal AI integrates advanced AI capabilities directly into your terminal, enhancing productivity and workflow.",
        image: {
            src: "assets/images/terminalAI01.png",
            alt: "Terminal AI overview",
            caption: "The Terminal AI concept",
        },
    },
    {
        title: "Key Features",
        subtitle: "What Terminal AI offers",
        body: "Terminal AI provides features like code generation, error debugging, and command suggestions to streamline your tasks.",
    },
    {
        title: "Code Generation",
        subtitle: "Automate coding tasks",
        body: "Generate boilerplate code, functions, or entire modules with simple prompts, saving time and effort.",
        image: {
            src: "assets/images/terminalAI02.png",
            alt: "Code generation feature",
            caption: "Generating code with Terminal   AI",
        },
    },
    {
        title: "Error Debugging",
        subtitle: "Identify and fix issues",
        body: "Terminal AI helps you quickly identify errors in your code and suggests possible fixes, reducing debugging time.",
        image: {
            src: "assets/images/terminalAI03.png",
            alt: "Error debugging feature",
            caption: "Debugging with Terminal AI",
        },
    },
    {
        title: "Command Suggestions",
        subtitle: "Enhance your command line experience",
        body: "Get intelligent command suggestions based on your workflow, making it easier to navigate and execute tasks.",
    },
    {
        title: "Customization",
        subtitle: "Tailor Terminal AI to your needs",
        body: "Customize Terminal AI's behavior and responses to fit your specific development style and requirements.",
    },
    {
        title: "Integration",
        subtitle: "Works with your existing tools",
        body: "Seamlessly   integrate Terminal AI with popular development tools and environments for a smooth experience.",
        image: {
            src: "assets/images/terminalAI04.png",
            alt: "Integration feature",
            caption: "Integrating Terminal AI with tools",
        },
    },
    {
        title: "Security",
        subtitle: "Your data is safe",
        body: "Terminal AI prioritizes your privacy and security, ensuring that your data is protected at all times.",
        image: {
            src: "assets/images/terminalAI05.png",
            alt: "Security feature",
            caption: "Security measures in Terminal AI",
        },
    },
    {
        title: "Getting Started",
        subtitle: "How to set up Terminal AI",
        body: "Follow our simple setup guide to get Terminal AI up and running in your terminal environment quickly.",
    },
    {
        title: "Future Developments",
        subtitle: "What's next for Terminal AI",
        body: "Stay tuned for upcoming features and improvements as we continue to enhance Terminal AI based on user feedback.",
        image: {
            src: "assets/images/terminalAI06.png",
            alt: "Future developments",
            caption: "The future of Terminal AI",
        },
    },
];
const intro = createIntroSlide({
    id: "terminalAI-intro",
    title: "Terminal AI",
    subtitle: "Bringing AI to your command line",
    body: "Terminal AI integrates advanced capabilities directly into your terminal, enhancing productivity and workflow.",
    image: {
        src: "assets/images/terminalAI01.png",
        alt: "Terminal AI overview",
        caption: "The Terminal AI concept",
    },
    reveal: { body: "char" },
    revealSpeedMs: { body: 75 },
});
const textSlides = textSlideOverrides.map((slideConfig, index) => createTextSlide({
    ...slideConfig,
    id: slideConfig.id || `terminalAI-text-${index + 1}`,
    reveal: { body: "char" },
    revealSpeedMs: { body: 75 },
}));
const outro = createOutroSlide({
    id: "terminalAI-outro",
    title: "Thanks for trying Terminal AI",
    subtitle: "Ship faster from your shell",
    body: "Stay tuned for more features and integrations. Happy coding!",
    image: {
        src: "assets/images/terminalAI06.png",
        alt: "Terminal AI future",
        caption: "The future of Terminal AI",
    },
    reveal: { body: "char" },
    revealSpeedMs: { body: 75 },
});
export const terminalAIPresentation = {
    id: "terminalAI",
    name: "Terminal AI",
    slides: [intro, ...textSlides, outro],
    theme: {
        className: "theme-terminalAI", // optional: eigene Styles per CSS
    },
};
