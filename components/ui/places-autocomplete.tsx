"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

// import { cn } from "@/lib/utils"
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

interface PlacesAutocompleteProps {
  selected: Record<"value" | "label", string>
  onChange: React.Dispatch<
    React.SetStateAction<Record<"value" | "label", string>>
  >
  className?: string
  placeholder?: string
}

const PlacesAutocomplete = React.forwardRef<HTMLButtonElement, PlacesAutocompleteProps>(
  ({ selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const {
      ready,
      value,
      suggestions: { status, data: places },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      // callbackName: "YOUR_CALLBACK_NAME",
      requestOptions: {
        types: [
          "administrative_area_level_1",
          "administrative_area_level_2",
          "administrative_area_level_3",
          "colloquial_area",
          "locality",
        ]
      },
      debounce: 300,
    });

    const handleOpenChange = (open: boolean) => {
      if (!open) clearSuggestions();
      setOpen(open);
    }

    const handleSelect = React.useCallback(
      ({ description }: { description: string }) => () => {
        setValue(description, false);
        clearSuggestions();
        // TODO: use getLatLng here, and use as value instead
        getGeocode({ address: description }).then((results) => {
          const { lat, lng } = getLatLng(results[0]);
          console.log("📍 Coordinates: ", { lat, lng });
          onChange({ label: description, value: [lat, lng].join(',') });
        });
        setOpen(false);
      },
      [setValue, clearSuggestions, onChange],
    )

    const placesOptions = React.useMemo(() => {
      switch (status) {
        case "UNKNOWN_ERROR":
          return <CommandItem disabled>Server error</CommandItem>;
        case "ZERO_RESULTS":
          return <CommandItem disabled>No results found.</CommandItem>;
        case "OK":
          return (
            <CommandGroup>
              {places.map((place) => (
                  <CommandItem
                    key={place.place_id}
                    value={place.description}
                    className="flex-col items-start"
                    onSelect={handleSelect(place)}
                  >
                    <p className="text-bold">{place.structured_formatting.main_text}</p>
                    <br/>
                    <p className="opacity-50">{place.structured_formatting.secondary_text}</p>
                  </CommandItem>
              ))}
            </CommandGroup>
          );
        default:
          break;
      }
    }, [status, places, handleSelect])

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            ref={ref}
          >
            <span>{selected?.label ?? props.placeholder ?? "Select ..."}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput disabled={!ready} placeholder="Search..." onValueChange={setValue} />
            <CommandEmpty>Type to search...</CommandEmpty>
            {placesOptions}
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

PlacesAutocomplete.displayName = "PlacesAutocomplete"

export { PlacesAutocomplete }