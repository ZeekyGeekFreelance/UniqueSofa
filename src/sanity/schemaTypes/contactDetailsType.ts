import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactDetails",
  title: "Contact Details",
  type: "document",
  fields: [
    defineField({
      name: "studioName",
      title: "Studio / Business Name",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      description: "Include country code, e.g. +91 99000 00278",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "whatsappRaw",
      title: "WhatsApp Number (Raw)",
      description: "Digits only, no spaces or +. Example: 919900000278. Leave empty to reuse Phone.",
      type: "string",
    }),
    defineField({
      name: "whatsappTemplate",
      title: "WhatsApp Message Template",
      description: "Use {{productName}} where the product name should appear.",
      type: "string",
      initialValue: "Hello, I have an enquiry about {{productName}}.",
    }),
    defineField({
      name: "addressArea",
      title: "Address Area",
      description: "Short location label shown in footer and contact page.",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "businessHoursWeekday",
      title: "Business Hours — Weekday",
      type: "string",
      initialValue: "Monday to Saturday: 9am to 8pm",
    }),
    defineField({
      name: "businessHoursSunday",
      title: "Business Hours — Sunday",
      type: "string",
      initialValue: "Sunday: 10am to 5pm",
    }),
  ],
});
