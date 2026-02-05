"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const languages = [
    {
        value: "en",
        label: "English",
        flag: "🇺🇸"
    },
    {
        value: "am",
        label: "አማርኛ (Amharic)",
        flag: "🇪🇹"
    }
]

export function LanguageSwitcher() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("en")

    const handleSelect = (currentValue: string) => {
        setValue(currentValue)
        setOpen(false)

        // Store in localStorage
        localStorage.setItem('preferred-language', currentValue)

        // Reload page to apply new language
        window.location.reload()
    }

    React.useEffect(() => {
        // Load saved language preference
        const saved = localStorage.getItem('preferred-language')
        if (saved) {
            setValue(saved)
        }
    }, [])

    const selectedLanguage = languages.find((lang) => lang.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <span className="flex items-center gap-2">
                        <span>{selectedLanguage?.flag}</span>
                        <span>{selectedLanguage?.label}</span>
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                        {languages.map((language) => (
                            <CommandItem
                                key={language.value}
                                value={language.value}
                                onSelect={handleSelect}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === language.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span className="mr-2">{language.flag}</span>
                                {language.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
