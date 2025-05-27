import { z } from "zod";

export const formSchema = z.object({
  meta: z.object({
    title: z.string().min(1, { message: "Title is required" }),
    subtitle: z.string().min(1, { message: "Subtitle is required" }),
  }),
  fields: z.array(z.object({
    id: z.string(),
    label: z.string().min(1, { message: "Field label is required" }),
    value: z.string().min(1, { message: "Field value is required" }),
  })),
});

export type FormData = z.infer<typeof formSchema>;

export const defaultFields = [
  { id: "faculty", label: "Faculty Name", value: "" },
  { id: "subject", label: "Subject Name", value: "" },
  { id: "paper", label: "Paper Code", value: "" },
  { id: "student", label: "Student Name", value: "" },
  { id: "enrollment", label: "Enrolment No.", value: "" },
  { id: "section", label: "Section", value: "" },
];