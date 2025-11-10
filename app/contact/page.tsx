"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle } from "lucide-react"
import { ContactPage } from "@/lib/types"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    message: "",
    feedback_type: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [pageData, setPageData] = useState<ContactPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/contact_page')
        if (response.ok) {
          const data = await response.json()
          setPageData(data)
        } else {
          console.error('Failed to fetch contact page data')
        }
      } catch (error) {
        console.error('Error fetching contact page data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContactData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, feedback_type: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      const result = await response.json()
      console.log("Feedback submitted successfully:", result)
      
      setSubmitStatus("success")
      setFormData({ title: "", email: "", message: "", feedback_type: "" })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = pageData?.feedback_types || [
    { value: "specification_error", label: "Specification Error", description: "Incorrect phone specifications" },
    { value: "content_issue", label: "Content Issue", description: "Problem with content or information" },
    { value: "ux", label: "User Experience", description: "Website usability or design feedback" },
    { value: "feature_request", label: "Feature Request", description: "Suggest a new feature or improvement" },
  ]

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto max-w-2xl"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {pageData?.hero_section?.title || "Contact Us"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {pageData?.hero_section?.description || "We'd love to hear from you! Share your feedback about our site, report issues, or suggest improvements."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground">
                  Send us an email at{" "}
                  <a href={`mailto:${pageData?.contact_info?.email || "feedback@phonefront.com"}`} className="text-primary hover:underline">
                    {pageData?.contact_info?.email || "feedback@phonefront.com"}
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  {pageData?.contact_info?.response_time || "We typically respond within 24-48 hours during business days."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedbackTypes.map((type) => (
                  <div key={type.value} className="flex items-start gap-3">
                    <Badge variant="outline" className="shrink-0">
                      {type.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Brief description of your feedback"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback_type" className="text-sm font-medium">
                  Feedback Type
                </Label>
                <Select value={formData.feedback_type} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please provide detailed information about your feedback..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full resize-none"
                />
              </div>

              {/* Submit Status */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">Thank you! Your feedback has been submitted successfully.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-800">Sorry, there was an error submitting your feedback. Please try again.</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
