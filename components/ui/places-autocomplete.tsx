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
import Script from "next/script"

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
      init,
      ready,
      value,
      suggestions: { status, data: places },
      setValue,
      clearNominateions,
    } = usePlacesAutocomplete({
      initOnMount: false,
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
      if (!open) clearNominateions();
      setOpen(open);
    }

    const handleSelect = React.useCallback(
      ({ description }: { description: string }) => () => {
        setValue(description, false);
        clearNominateions();
        getGeocode({ address: description }).then((results) => {
          const { lat, lng } = getLatLng(results[0]);
          console.log("📍 Coordinates: ", { lat, lng });
          onChange({ label: description, value: [lat, lng].join(',') }); // TODO: also capture place description here?
        });
        setOpen(false);
      },
      [setValue, clearNominateions, onChange],
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
            {...props}
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
        <Script
          id="googlemaps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&callback=Function.prototype`}
          type="text/javascript"
          onReady={() => init()}
        />
      </Popover>
    )
  }
)

PlacesAutocomplete.displayName = "PlacesAutocomplete"

export { PlacesAutocomplete }