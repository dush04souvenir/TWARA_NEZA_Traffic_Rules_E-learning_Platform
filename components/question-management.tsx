"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { getAdminTopics, createTopic, createQuestion, deleteTopic, deleteQuestion } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, Plus, List } from "lucide-react"

export function QuestionManagement() {
  const router = useRouter()
  const [topics, setTopics] = useState<any[]>([])

  // Topic Form
  const [topicOpen, setTopicOpen] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState("")

  // Question Form
  const [questionOpen, setQuestionOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [qText, setQText] = useState("")
  const [opt1, setOpt1] = useState("")
  const [opt2, setOpt2] = useState("")
  const [opt3, setOpt3] = useState("")
  const [opt4, setOpt4] = useState("")
  const [correctIdx, setCorrectIdx] = useState(0)

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    const data = await getAdminTopics()
    setTopics(data)
  }

  const handleCreateTopic = async () => {
    const res = await createTopic({ title: newTopicTitle })
    if (res.error) toast.error(res.error)
    else {
      toast.success("Topic created")
      setTopicOpen(false)
      setNewTopicTitle("")
      loadTopics()
      router.refresh()
    }
  }

  const handleDeleteTopic = async (id: string) => {
    if (!confirm("Are you sure? This will delete all questions in this topic.")) return
    const res = await deleteTopic(id)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Topic deleted")
      loadTopics()
      router.refresh()
    }
  }

  const handleCreateQuestion = async () => {
    const options = [
      { text: opt1, isCorrect: correctIdx === 0 },
      { text: opt2, isCorrect: correctIdx === 1 },
      { text: opt3, isCorrect: correctIdx === 2 },
      { text: opt4, isCorrect: correctIdx === 3 },
    ]

    const res = await createQuestion({
      topicId: selectedTopicId,
      text: qText,
      points: 1,
      options
    })

    if (res.error) toast.error(res.error)
    else {
      toast.success("Question created")
      setQuestionOpen(false)
      loadTopics()
      // Reset form
      setQText(""); setOpt1(""); setOpt2(""); setOpt3(""); setOpt4("")
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return
    const res = await deleteQuestion(id)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Question deleted")
      loadTopics()
    }
  }

  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Content Management</CardTitle>

        {/* Add Topic Dialog */}
        <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Topic</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Topic</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Topic Title" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} />
              <Button onClick={handleCreateTopic} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No topics found. Start by creating one.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {topics.map((t) => (
              <AccordionItem key={t.id} value={t.id} className="border border-border rounded-lg px-4 bg-card/50">
                <div className="flex items-center justify-between w-full">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <List className="w-4 h-4 text-muted-foreground" />
                      {t.title}
                      <span className="text-xs font-normal text-muted-foreground ml-2">({t.questions?.length || 0} questions)</span>
                    </span>
                  </AccordionTrigger>

                  <div className="flex items-center gap-2 pr-4 z-10" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTopic(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <AccordionContent>
                  <div className="space-y-3 pt-2 pb-4">
                    <div className="flex justify-end">
                      {/* Add Question Dialog */}
                      <Dialog open={questionOpen && selectedTopicId === t.id} onOpenChange={(open) => {
                        setQuestionOpen(open)
                        if (open) setSelectedTopicId(t.id)
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8"><Plus className="w-3 h-3 mr-1" /> Add Question</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                          <DialogHeader><DialogTitle>Add Question to {t.title}</DialogTitle></DialogHeader>
                          <div className="space-y-3 pt-4">
                            <Input placeholder="Question Text" value={qText} onChange={e => setQText(e.target.value)} />
                            <div className="space-y-2">
                              <div className="flex gap-2"><Input placeholder="Option 1" value={opt1} onChange={e => setOpt1(e.target.value)} /> <input type="radio" checked={correctIdx === 0} onChange={() => setCorrectIdx(0)} /></div>
                              <div className="flex gap-2"><Input placeholder="Option 2" value={opt2} onChange={e => setOpt2(e.target.value)} /> <input type="radio" checked={correctIdx === 1} onChange={() => setCorrectIdx(1)} /></div>
                              <div className="flex gap-2"><Input placeholder="Option 3" value={opt3} onChange={e => setOpt3(e.target.value)} /> <input type="radio" checked={correctIdx === 2} onChange={() => setCorrectIdx(2)} /></div>
                              <div className="flex gap-2"><Input placeholder="Option 4" value={opt4} onChange={e => setOpt4(e.target.value)} /> <input type="radio" checked={correctIdx === 3} onChange={() => setCorrectIdx(3)} /></div>
                            </div>
                            <Button onClick={handleCreateQuestion} className="w-full">Save Question</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {t.questions && t.questions.length > 0 ? (
                      <div className="space-y-2">
                        {t.questions.map((q: any) => (
                          <div key={q.id} className="flex flex-col gap-1 p-3 bg-background rounded-md border border-border">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{q.text}</p>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteQuestion(q.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="pl-2 mt-1 border-l-2 border-muted">
                              {q.options.map((o: any) => (
                                <p key={o.id} className={`text-xs ${o.isCorrect ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>• {o.text}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No questions in this topic yet.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
