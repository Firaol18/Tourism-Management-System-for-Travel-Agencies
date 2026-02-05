"use client"

import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from "react-share"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ShareButtonsProps {
    url: string
    title: string
    description?: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
    const shareUrl = typeof window !== "undefined" ? window.location.origin + url : url

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Share this package</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <FacebookShareButton url={shareUrl} quote={title}>
                        <FacebookIcon size={40} round />
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} title={title}>
                        <TwitterIcon size={40} round />
                    </TwitterShareButton>

                    <WhatsappShareButton url={shareUrl} title={title}>
                        <WhatsappIcon size={40} round />
                    </WhatsappShareButton>

                    <EmailShareButton url={shareUrl} subject={title} body={description}>
                        <EmailIcon size={40} round />
                    </EmailShareButton>
                </div>
            </CardContent>
        </Card>
    )
}
