import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./index.css"

// WARNING: functional components are used only in:
// - shadcn/ui downloaded components

// ADDITIONALLY DONE:
// 1. Special behavior of "delete" button on mobile devices
// 2. Synchronization with Local Storage
// 3. Written using TypeScript

createRoot(document.getElementById("root")!).render(<App />)
