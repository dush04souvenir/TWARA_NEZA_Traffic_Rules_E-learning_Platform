"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { submitContactMessage } from "@/lib/actions/contact-actions"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function ContactSection() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const result = await submitContactMessage(formData)
        setIsSubmitting(false)

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Message Sent!",
                description: "We'll get back to you as soon as possible.",
            })
            // Optional: Reset form here if using a ref, or just let it be
        }
    }

    return (
        <section id="contact" className="container mx-auto px-4 py-20 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-muted-foreground">Have questions about the platform or need help with your account? We're here to help.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Email Us</h4>
                                <p className="text-sm text-muted-foreground">support@twaraneza.rw</p>
                                <p className="text-sm text-muted-foreground">partners@twaraneza.rw</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Call Us</h4>
                                <p className="text-sm text-muted-foreground">+250 788 000 000</p>
                                <p className="text-sm text-muted-foreground">Mon-Fri from 8am to 5pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Visit Us</h4>
                                <p className="text-sm text-muted-foreground">Kigali Heights, 4th Floor</p>
                                <p className="text-sm text-muted-foreground">Kigali, Rwanda</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <form className="space-y-4" action={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input name="name" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" placeholder="john@gmail.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea name="message" placeholder="How can we help you?" className="min-h-[120px]" required />
                            </div>
                            <Button className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
