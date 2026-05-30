"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  actionLabel?: string
  actionHref?: string
}

export function SectionCard({
  title,
  description,
  children,
  actionLabel,
  actionHref,
}: SectionCardProps) { 
    return (
    <Card className="rounded-3xl border-0 shadow-sm transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            {title}
          </CardTitle>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actionHref && actionLabel && (
          <Button variant="outline" size="sm" asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
      </CardHeader>
       <CardContent>{children}</CardContent>
    </Card>
  )
}
