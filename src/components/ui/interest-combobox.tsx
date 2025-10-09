"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import techInterests from "@/data/tech-interests.json"

interface InterestComboboxProps {
  selectedInterests: string[]
  onInterestsChange: (interests: string[]) => void
  placeholder?: string
  className?: string
  maxInterests?: number
}

export function InterestCombobox({
  selectedInterests,
  onInterestsChange,
  placeholder = "Select interests...",
  className,
  maxInterests = 5
}: InterestComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Filter interests based on search
  const filteredInterests = React.useMemo(() => {
    if (!searchValue) return techInterests
    return techInterests.filter(interest =>
      interest.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue])

  const handleInterestSelect = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      // Remove interest if already selected
      onInterestsChange(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < maxInterests) {
      // Add interest if not selected and under max limit
      onInterestsChange([...selectedInterests, interest])
    }
    setSearchValue("")
  }

  const removeInterest = (interestToRemove: string) => {
    onInterestsChange(selectedInterests.filter(interest => interest !== interestToRemove))
  }

  const displayText = selectedInterests.length > 0 
    ? `${selectedInterests.length} interest${selectedInterests.length === 1 ? '' : 's'} selected`
    : placeholder

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {displayText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search interests..." 
              className="h-9"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No interests found.</CommandEmpty>
              <CommandGroup>
                {filteredInterests.map((interest) => (
                  <CommandItem
                    key={interest}
                    value={interest}
                    onSelect={() => handleInterestSelect(interest)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedInterests.includes(interest) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {interest}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Interests Display */}
      {selectedInterests.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Selected Interests ({selectedInterests.length})
            </span>
            <span className={cn(
              "text-xs",
              selectedInterests.length > 0 
                ? "text-green-600" 
                : "text-gray-500"
            )}>
              {selectedInterests.length > 0 
                ? `${selectedInterests.length}/${maxInterests} selected` 
                : `Select up to ${maxInterests} interests`
              }
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 hover:text-primary/70 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
