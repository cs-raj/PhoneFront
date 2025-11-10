import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User } from "lucide-react"
import type { Author } from "@/lib/data/home"

interface AuthorCardProps {
  author: Author
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="flex items-start gap-4">
        {/* Author Avatar */}
        <div className="relative">
          {author.avatar?.url ? (
            <Image
              src={author.avatar.url}
              alt={author.avatar.title || author.name}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{author.name}</h3>
            <p className="text-sm text-muted-foreground">{author.title}</p>
          </div>

          {author.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {author.bio}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{author.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Author
            </Badge>
            <Badge variant="outline" className="text-xs">
              Tech Reviewer
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}



















