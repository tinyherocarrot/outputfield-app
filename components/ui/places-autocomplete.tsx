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
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function PlacesAutocomplete() {
  const [open, setOpen] = React.useState(false)
//   const [value, setValue] = React.useState("")
  const {
    ready,
    value,
    suggestions: { status, data: places },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  console.log(status, places)

  const handleOpenChange = (open: boolean) => {
    if (!open) clearSuggestions();
    setOpen(open)
  }

  const handleSelect = ({ description }) =>
  () => {
    // When the user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      console.log("📍 Coordinates: ", { lat, lng });
    });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput disabled={!ready} placeholder="Search..." onValueChange={setValue} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {places.map((place) => (
                <CommandItem key={place.place_id} className="flex-col items-start">
                    <p className="text-bold">{place.structured_formatting.main_text}</p>
                    <br/>
                    <p className="opacity-50">{place.structured_formatting.secondary_text}</p>
                </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
