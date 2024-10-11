import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./index.css"

// WARNING: why functional components in app?
// Because these are downloaded shadcn/ui components

// ADDITIONALLY DONE:
// 1. App is optimized for large data (for example by using debounce)
// 2. App is optimized for all screen sizes
// 3. Synchronization with Local Storage
// 4. Written using TypeScript

createRoot(document.getElementById("root")!).render(<App />)
