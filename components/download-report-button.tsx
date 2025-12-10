"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export function DownloadReportButton() {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)

        // Give UI a moment
        await new Promise(resolve => setTimeout(resolve, 500))

        // Create safety style override to prevent 'unsupported color function' error
        // html2canvas fails on 'oklch'/'lab', so we force standard Hex colors.
        const style = document.createElement("style")
        style.innerHTML = `
            :root, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, section, article, aside, main, header, footer, nav {
                --background: #ffffff !important;
                --foreground: #020817 !important;
                --card: #ffffff !important;
                --card-foreground: #020817 !important;
                --popover: #ffffff !important;
                --popover-foreground: #020817 !important;
                --primary: #2563eb !important;
                --primary-foreground: #ffffff !important;
                --secondary: #f1f5f9 !important;
                --secondary-foreground: #0f172a !important;
                --muted: #f1f5f9 !important;
                --muted-foreground: #64748b !important;
                --accent: #f1f5f9 !important;
                --accent-foreground: #0f172a !important;
                --destructive: #ef4444 !important;
                --destructive-foreground: #ffffff !important;
                --border: #e2e8f0 !important;
                --input: #e2e8f0 !important;
                --ring: #2563eb !important;
                --chart-1: #2563eb !important;
                --chart-2: #10b981 !important;
                --chart-3: #f59e0b !important;
                --chart-4: #ef4444 !important;
                --chart-5: #8b5cf6 !important;
                --sidebar: #f8fafc !important;
            }
            body { 
                background-color: #ffffff !important; 
                color: #020817 !important;
            }
            /* Hide print-unfriendly elements */
            .no-print, aside { display: none !important; }
        `
        document.head.appendChild(style)

        // Unlock Layout for full capture
        const wrapper = document.getElementById("manager-root")
        const main = document.querySelector("main") as HTMLElement
        const sidebar = document.querySelector("aside") as HTMLElement

        const originalWrapperStyle = wrapper ? wrapper.getAttribute("style") : ""
        const originalMainStyle = main ? main.getAttribute("style") : ""
        const originalSidebarStyle = sidebar ? sidebar.getAttribute("style") : ""

        try {
            if (wrapper) {
                wrapper.style.height = "auto"
                wrapper.style.overflow = "visible"
                wrapper.style.minHeight = "100vh"
            }
            if (main) {
                main.style.height = "auto"
                main.style.overflow = "visible"
                main.style.position = "static"
            }
            if (sidebar) sidebar.style.display = "none"

            window.scrollTo(0, 0)
            await new Promise(resolve => setTimeout(resolve, 200)) // Wait for repaint

            const elementToCapture = document.body
            const canvas = await html2canvas(elementToCapture, {
                scale: 1.0, // Reduced scale for stability
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1440,
                height: elementToCapture.scrollHeight,
                windowHeight: elementToCapture.scrollHeight,
                ignoreElements: (node) => {
                    return node.nodeType === 1 && (node as Element).classList.contains("no-print")
                }
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height]
            })

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save("manager-report.pdf")

        } catch (error) {
            console.error("PDF generation failed:", error)
            const msg = error instanceof Error ? error.message : "Unknown error"

            if (confirm(`Generation failed (${msg}). Use browser print instead?`)) {
                window.print()
            }
        } finally {
            // Restore Layout & Styles
            if (wrapper) wrapper.setAttribute("style", originalWrapperStyle || "")
            if (main) main.setAttribute("style", originalMainStyle || "")
            if (sidebar) sidebar.setAttribute("style", originalSidebarStyle || "")

            if (style.parentNode) {
                style.parentNode.removeChild(style)
            }

            setLoading(false)
        }
    }

    return (
        <Button variant="outline" onClick={handleDownload} disabled={loading} className="no-print">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {loading ? "Generating..." : "Download PDF"}
        </Button>
    )
}
