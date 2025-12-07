import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Search, Mail, Phone, MessageSquare } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I submit my thesis?",
      answer:
        "To submit your thesis, log in to your student account, navigate to the submission page, fill in the required information, upload your thesis files, and click 'Submit for Review'. Your supervisor will then review your submission.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support PDF for thesis documents, MP3/WAV for audio files, MP4/AVI for video files, and PPT/PDF for presentation slides. Maximum file size is 50MB per file.",
    },
    {
      question: "How long does the review process take?",
      answer:
        "The review process typically takes 5-10 business days. You will receive notifications about the status of your submission throughout the review process.",
    },
    {
      question: "Can I edit my thesis after submission?",
      answer:
        "You can edit your thesis if it's in 'Draft' status. Once submitted for review, you cannot edit it directly. If changes are requested, you can resubmit with the updated version.",
    },
    {
      question: "How do I search for theses?",
      answer:
        "Use the Browse page to search for theses. You can filter by department, year, keywords, and sort by various criteria. Use the search bar to find specific topics or authors.",
    },
    {
      question: "What should I do if I encounter an error?",
      answer:
        "If you encounter an error, please try refreshing the page. If the problem persists, contact our support team with details about the error and your actions leading up to it.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password.",
    },
    {
      question: "Can supervisors see all student submissions?",
      answer:
        "Supervisors can only see submissions from students they are assigned to. They have access to review, approve, or request changes on these submissions.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Find answers to common questions and get support</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              className="pl-10 border-border bg-background text-foreground"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card p-6 text-center hover:shadow-md transition-shadow">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">support@sust-thesis.edu.bd</p>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Send Email
            </Button>
          </Card>

          <Card className="border-border bg-card p-6 text-center hover:shadow-md transition-shadow">
            <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">+880-1234-567890</p>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Call Us
            </Button>
          </Card>

          <Card className="border-border bg-card p-6 text-center hover:shadow-md transition-shadow">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Available 9 AM - 5 PM</p>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Start Chat
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
