"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
            <div className="px-6 lg:px-12 py-8 max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: January 2025</p>
                </div>

                <Card className="p-8 border-2 border-border bg-card backdrop-blur-sm space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using the SUST Thesis Repository, you agree to be bound by these Terms of Service and all
                            applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
                            using this platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">User Accounts</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                When you create an account with us, you must provide accurate and complete information. You are
                                responsible for:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                                <li>Ensuring your account information remains current and accurate</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Acceptable Use</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                            <li>Submit plagiarized or fraudulent content</li>
                            <li>Upload malicious files or code</li>
                            <li>Violate any intellectual property rights</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Attempt to gain unauthorized access to the system</li>
                            <li>Use the platform for any illegal purposes</li>
                            <li>Impersonate another person or entity</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Your Content</h3>
                                <p>
                                    You retain all rights to the theses and content you submit. By submitting content, you grant SUST a
                                    non-exclusive, worldwide license to store, display, and distribute your content as part of the
                                    repository.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">Platform Content</h3>
                                <p>
                                    The platform itself, including its design, features, and functionality, is owned by SUST and protected
                                    by copyright and other intellectual property laws.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Content Review and Removal</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All submitted theses undergo review by assigned supervisors. We reserve the right to remove any content
                            that violates these terms, university policies, or applicable laws. Approved theses become part of the
                            permanent academic record.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The platform is provided "as is" without warranties of any kind. We do not guarantee that the platform
                            will be error-free, secure, or continuously available. Use of the platform is at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            SUST shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                            resulting from your use of or inability to use the platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes. Your
                            continued use of the platform after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may terminate or suspend your account immediately, without prior notice, for conduct that we believe
                            violates these Terms of Service or is harmful to other users, us, or third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            For questions about these Terms of Service, please contact us at{" "}
                            <a href="mailto:legal@sust.edu" className="text-primary hover:underline">
                                legal@sust.edu
                            </a>
                        </p>
                    </section>
                </Card>
            </div>
        </div>
    )
}
