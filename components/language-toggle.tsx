"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePersonalize } from "@/components/context/PersonalizeContext"

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const personalizeSdk = usePersonalize()

  useEffect(() => {
    const storedLang = localStorage.getItem("user-language") as "en" | "hi"
    if (storedLang) {
      setLanguage(storedLang)
      console.log(`🌐 [LANGUAGE TOGGLE] Loaded stored language: ${storedLang}`)
      
      // Set in Personalize SDK if available
      if (personalizeSdk) {
        console.log(`🌐 [LANGUAGE TOGGLE] Setting language in Personalize SDK: ${storedLang}`)
        personalizeSdk.set({ language: storedLang }).then(() => {
          console.log(`✅ [LANGUAGE TOGGLE] Language attribute set successfully: ${storedLang}`)
          console.log(`🍪 [LANGUAGE TOGGLE] Cookie should now contain language preference`)
        }).catch(err => {
          console.error(`❌ [LANGUAGE TOGGLE] Failed to set language:`, err)
        })
      } else {
        console.log(`⚠️ [LANGUAGE TOGGLE] Personalize SDK not yet available`)
      }
    }
  }, [personalizeSdk])

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "en" | "hi"
    console.log(`🌐 [LANGUAGE TOGGLE] ==========================================`)
    console.log(`🌐 [LANGUAGE TOGGLE] Language changed to: ${newLang}`)
    console.log(`🌐 [LANGUAGE TOGGLE] ==========================================`)
    
    setLanguage(newLang)
    localStorage.setItem("user-language", newLang)
    
    // Set in Personalize SDK
    if (personalizeSdk) {
      console.log(`🌐 [LANGUAGE TOGGLE] Setting language in Personalize SDK...`)
      try {
        await personalizeSdk.set({ language: newLang })
        console.log(`✅ [LANGUAGE TOGGLE] Language attribute set successfully!`)
        console.log(`🍪 [LANGUAGE TOGGLE] Cookie updated with language: ${newLang}`)
        console.log(`🔄 [LANGUAGE TOGGLE] Reloading page to apply personalization...`)
        
        // Reload to get new personalized content
        window.location.reload()
      } catch (err) {
        console.error(`❌ [LANGUAGE TOGGLE] Failed to set language:`, err)
      }
    } else {
      console.error(`❌ [LANGUAGE TOGGLE] Personalize SDK not available!`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus:border-primary focus:ring-primary text-foreground" // Updated colors
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
    </div>
  )
}
