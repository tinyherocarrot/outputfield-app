"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { addNomineeRow } from "@/actions/addNomineeRow"

const GENRE_OPTIONS = [
    {
      value: "genre1",
      label: "Genre 1",
    }, {
      value: "genre2",
      label: "Genre 2",
    },
    {
      value: "genre3",
      label: "Genre 3",
    },
    {
      value: "genre4",
      label: "Genre 4",
    }
  ]

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(50),
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

export function NominateForm() {
    // 1. Define form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        website: "",
        genre: [],
      },
    })
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    //  TODO: await addNomineeRow()
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="www.youre-legit.com" {...field} />
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
                  render={({ field: { ...field } }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Genre(s)</FormLabel>
                      <MultiSelect
                        selected={field.value}
                        options={GENRE_OPTIONS}
                        {...field} />
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field: { ...field } }) => (
                    <FormItem className="mb-5">
                      <FormLabel>Location</FormLabel>
                      <PlacesAutocomplete
                        selected={field.value}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
    )
  }