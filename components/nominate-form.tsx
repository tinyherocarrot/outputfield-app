"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multiselect"
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Nominee } from "@/ts/interfaces/nominee.interfaces"

const GENRE_OPTIONS = [
  {value: "new_media", label: "New Media"},
  {value: "moving_image", label: "Moving Image"},
  {value: "photography", label: "Photography"},
  {value: "fashion_&_costume", label: "Fashion & Costume"},
  {value: "sculpture", label: "Sculpture"},
  {value: "generative", label: "Generative"},
  {value: "movement_&_dance", label: "Movement & Dance"},
  {value: "sound", label: "Sound"},
  {value: "painting_&_drawing", label: "Painting & Drawing"},
  {value: "prose_&_poetry", label: "Prose & Poetry"},
  {value: "performance", label: "Performance"},
  {value: "installation", label: "Installation"},
  {value: "graphic_design", label: "Graphic Design"},
  {value: "research", label: "Research"},
  {value: "archival", label: "Archival"},
  {value: "organizing_&_Education", label: "Organizing & Education"},
]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),
  email: z.string().email(),
  website: z.string().trim().url({
    message: 'Invalid URL'
  }),
  genre: z.array(
    z.record(
      z.string().trim()
    )
  ).min(1, {
    message: "Select at least 1 genre."
  }),
  location: z.record(
    z.string().trim()
  ),
})

type NominateFormProps = {
  handleAddNominee: (n: Nominee) => Promise<void>
}

const NominateForm: React.FC<NominateFormProps> = (
  { handleAddNominee }
) => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        website: "",
        genre: [],
      },
    })
   
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setLoading(true)
        const nominee: Nominee = {
          name: values.name,
          email: values.email,
          website_url: values.website,
          genre: values.genre.map(({ label }) => label),
          location: {
            description: values.location.label,
            coordinates: {
              latitude: values.location.value.split(',')[0],
              longitude: values.location.value.split(',')[1],
            }
          },
          status: "Pending",
          date_created: new Date(),
        }
        await handleAddNominee(nominee)
        toast({
          description: "Your nomination has been successfully submitted!"
        })
        setTimeout(() => {
          router.push("/")
        }, 500);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    return (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-black"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="thom.yorke@yahoo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.youre-legit.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a valid URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Genre(s)</FormLabel>
                      <FormControl>
                        <MultiSelect
                          aria-label="Genre(s)"
                          selected={field.value}
                          options={GENRE_OPTIONS}
                          {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <PlacesAutocomplete
                          aria-label="Location"
                          selected={field.value}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            
            <Button type="submit" disabled={loading}>
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </form>
        </Form>
    )
  }

  export default NominateForm