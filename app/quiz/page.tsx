import { QuizContent } from "@/components/quiz-content"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizContent />
    </Suspense>
  )
}
