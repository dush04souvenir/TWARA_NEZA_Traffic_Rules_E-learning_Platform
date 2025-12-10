import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function LandingFeatures() {
  const features = [
    {
      title: "Interactive Quizzes",
      description: "Master traffic rules with engaging, exam-style questions and instant feedback",
      image: "/car-dashboard-interior.jpg",
    },
    {
      title: "Flashcard Learning",
      description: "Reinforce key concepts with spaced repetition and bite-sized learning modules",
      image: "/motorcycle-rider-training.png",
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and performance insights",
      image: "/rwanda_traffic_police_1765297067145.png",
    },
    {
      title: "Targeted Practice",
      description: "Identify your weak areas and focus your study time on specific topics to improve faster",
      image: "/kigali_driving_school_1765297130506.png",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16" id="features">
      <div className="text-center mb-12 animate-slide-in-up">
        <h2 className="text-4xl font-bold text-foreground mb-4">Master Rwanda Traffic Rules</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Prepare confidently for your driving license exam with our comprehensive, interactive learning platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <Card
            key={feature.title}
            className="border-border bg-card hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
            style={{
              animation: `slideInUp 0.6s ease-out ${idx * 0.1}s backwards`,
            }}
          >
            <div className="h-40 overflow-hidden bg-muted">
              <img
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
