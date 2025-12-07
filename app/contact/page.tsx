"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Contact form submitted:", formData)
        alert("Thank you for contacting us! We'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            <div className="px-6 lg:px-12 py-8 max-w-6xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                    <p className="text-lg text-muted-foreground">
                        Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3 mb-12">
                    <Card className="p-6 border-2 border-border bg-card backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Email</h3>
                                <p className="text-sm text-muted-foreground">thesis@sust.edu</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Send us an email anytime</p>
                    </Card>

                    <Card className="p-6 border-2 border-border bg-card backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Phone</h3>
                                <p className="text-sm text-muted-foreground">+880-821-713491</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm</p>
                    </Card>

                    <Card className="p-6 border-2 border-border bg-card backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Location</h3>
                                <p className="text-sm text-muted-foreground">SUST, Sylhet</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Visit us on campus</p>
                    </Card>
                </div>

                <Card className="p-8 border-2 border-border bg-card backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                Subject
                            </label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                placeholder="What is this about?"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                Message
                            </label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us more..."
                                rows={6}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0"
                        >
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}
