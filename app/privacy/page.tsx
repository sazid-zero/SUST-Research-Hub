"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="px-6 lg:px-12 py-8 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        <Card className="p-8 border-2 border-border bg-card backdrop-blur-sm space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the SUST Thesis Repository. We are committed to protecting your personal information and your
              right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                <p>
                  We collect personal information that you provide to us such as name, email address, student ID,
                  department, and contact information when you register for an account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Academic Content</h3>
                <p>
                  When you submit a thesis, we collect the thesis document, abstract, keywords, and related metadata.
                  This information becomes part of the public repository once approved.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Usage Data</h3>
                <p>
                  We automatically collect certain information when you visit, use, or navigate the platform. This
                  includes IP address, browser type, pages viewed, and time spent on pages.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>To facilitate account creation and authentication</li>
              <li>To manage thesis submissions and reviews</li>
              <li>To send administrative information and notifications</li>
              <li>To maintain and improve our platform</li>
              <li>To monitor and analyze usage patterns</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties. We may share your information in the
              following situations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>With your supervisor for thesis review purposes</li>
              <li>With university administrators for academic purposes</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent for any other purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal
              information. However, no electronic transmission over the internet can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (subject to academic record requirements)</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or concerns about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@sust.edu" className="text-primary hover:underline">
                privacy@sust.edu
              </a>
            </p>
          </section>
        </Card>
      </div>
    </div>
  )
}
