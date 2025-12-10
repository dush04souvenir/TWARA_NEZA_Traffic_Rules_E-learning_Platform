"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Testimonials() {
    const reviews = [
        {
            name: "Jean Paul M.",
            role: "Logistics Driver",
            content: "I failed my provisional exam twice before finding TWARA NEZA. The 'Weakness Detector' showed me exactly what I was getting wrong about road signs. Passed with 95%!",
            rating: 5,
            avatar: "/placeholder-user.jpg"
        },
        {
            name: "Sarah K.",
            role: "Student",
            content: "The targeted practice mode is a game changer. Instead of reviewing everything, I just focused on the parking rules I struggled with. Saved me hours of study time.",
            rating: 5,
            avatar: "/placeholder-user.jpg"
        },
        {
            name: "David R.",
            role: "Taxi Moto",
            content: "Simple, fast, and works on my phone perfectly. I practiced while waiting for customers. Best investment I made for my license.",
            rating: 5,
            avatar: "/placeholder-user.jpg"
        }
    ]

    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Trusted by 10,000+ Rwandans</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, idx) => (
                    <Card key={idx} className="bg-card border-border hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar>
                                <AvatarImage src={review.avatar} alt={review.name} />
                                <AvatarFallback>{review.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <p className="text-xs text-muted-foreground">{review.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex mb-3">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">"{review.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
