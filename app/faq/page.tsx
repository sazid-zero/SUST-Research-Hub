"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: "How do I submit my thesis?",
            answer:
                "After logging in as a student, navigate to the 'Submit Thesis' page from your dashboard. Fill in the required information including title, abstract, department, and upload your thesis file (PDF format recommended). Your supervisor will be notified for review.",
        },
        {
            question: "What file formats are supported?",
            answer:
                "We support PDF, DOCX, PPT, PPTX for documents, MP4 for videos, and MP3 for audio files. PDF is the recommended format for thesis documents to ensure consistent formatting across all devices.",
        },
        {
            question: "How long does the review process take?",
            answer:
                "The review process typically takes 5-7 business days. Your supervisor will review your submission and either approve it, request changes, or reject it with feedback. You'll receive email notifications at each stage.",
        },
        {
            question: "Can I edit my thesis after submission?",
            answer:
                "Once submitted, you cannot directly edit your thesis. If changes are needed, your supervisor can request revisions, which will allow you to resubmit an updated version. Approved theses cannot be edited.",
        },
        {
            question: "Who can view my thesis?",
            answer:
                "Only approved theses are publicly visible in the repository. Draft and pending theses are only visible to you and your assigned supervisor. Once approved, your thesis becomes part of the public repository.",
        },
        {
            question: "How do I search for specific research?",
            answer:
                "Use the Browse page to filter by department, year, or field. You can also use the search bar to find theses by keywords, author names, or titles. Advanced filters help narrow down results.",
        },
        {
            question: "Can I download theses?",
            answer:
                "Yes, all approved theses in the repository can be downloaded by registered users. Click on any thesis to view its details and use the download button to save a copy.",
        },
        {
            question: "What if I forgot my password?",
            answer:
                "Click on 'Forgot Password' on the login page. Enter your registered email address, and you'll receive a password reset link. Follow the instructions in the email to create a new password.",
        },
        {
            question: "How do I become a supervisor?",
            answer:
                "Supervisor accounts are created by administrators. If you're a faculty member at SUST and need supervisor access, please contact the system administrator or the IT department.",
        },
        {
            question: "Can I submit multiple theses?",
            answer:
                "Yes, students can submit multiple theses if they have completed multiple research projects. Each submission will go through the standard review process independently.",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            <div className="px-6 lg:px-12 py-8 max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-muted-foreground">
                        Find answers to common questions about the SUST Thesis Repository.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card
                            key={index}
                            className="border-2 border-border bg-card backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                                <ChevronDown
                                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                                        openIndex === index ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6">
                                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <Card className="mt-12 p-8 border-2 border-border bg-card backdrop-blur-sm text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
                    <p className="text-muted-foreground mb-6">
                        Can't find the answer you're looking for? Please contact our support team.
                    </p>
                    <Link href="/contact">
                        <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-all">
                            Contact Support
                        </button>
                    </Link>
                </Card>
            </div>
        </div>
    )
}
