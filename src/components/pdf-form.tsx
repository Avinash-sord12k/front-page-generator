"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { defaultFields, FormData, formSchema } from "@/lib/schema";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  Download,
  GripVertical,
  Loader2,
  Plus,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

function SortableFieldWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function PdfForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meta: {
        title: "LAB MANUAL",
        subtitle: "B. Tech - 7ᵗʰ Semester",
      },
      fields: defaultFields,
    },
  });

  const fields = form.watch("fields");

  const addNewField = () => {
    form.setValue("fields", [
      ...fields,
      {
        id: crypto.randomUUID(),
        label: "New Field",
        value: "",
      },
    ]);
  };

  const removeField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    form.setValue("fields", updatedFields);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const apiData = {
        meta: data.meta,
        data: data.fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.label]: field.value,
          }),
          {},
        ),
      };

      const response = await fetch("/api/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const result = await response.json();
      setPdfUrl(result.url);
      setShowDialog(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${pdfUrl}`;
      navigator.clipboard.writeText(fullUrl);
    }
  };

  const getFullUrl = () => {
    return typeof window !== "undefined"
      ? `${window.location.origin}${pdfUrl}`
      : pdfUrl;
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      const reordered = arrayMove(fields, oldIndex, newIndex);
      form.setValue("fields", reordered);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-100 transition-all hover:shadow-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Document Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meta.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meta.subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold">Lab Details</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewField}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SortableFieldWrapper key={field.id} id={field.id}>
                      <div className="flex items-start gap-4 group">
                        <div className="mt-8 cursor-move opacity-100 transition-opacity">
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field Label</FormLabel>
                                <FormControl>
                                  <>
                                    <Input
                                      {...field}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      list={`label-suggestions-${index}`}
                                    />
                                    <datalist id={`label-suggestions-${index}`}>
                                      <option value="Faculty Name" />
                                      <option value="Subject Name" />
                                      <option value="Paper Code" />
                                      <option value="Student Name" />
                                      <option value="Section" />
                                      <option value="Enrolment No." />
                                    </datalist>
                                  </>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onPointerDown={(e) => e.stopPropagation()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => {
                            removeField(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </SortableFieldWrapper>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                PDF...
              </>
            ) : (
              "Generate PDF"
            )}
          </Button>
        </form>
      </Form>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[90vw] w-[500px]">
          <DialogHeader>
            <DialogTitle>PDF Generated Successfully!</DialogTitle>
            <DialogDescription>
              Your lab manual front page is ready. You can download it now or
              share the link with others.
              <div className="text-xs mt-1 text-muted-foreground">
                The link will be valid for 24 hours.
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 bg-muted p-3 rounded-md max-w-full min-w-0 overflow-hidden">
            <Link
              href={getFullUrl()}
              className="text-xs truncate flex-1 ellipsis text-blue-400 hover:underline"
            >
              {getFullUrl()}
            </Link>
            <Button size="sm" variant="outline" onClick={copyLinkToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                className="flex-1"
                onClick={() => window.open(pdfUrl, "_blank")}
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: "Lab Manual",
                        text: "Download your lab manual PDF",
                        url: getFullUrl(),
                      })
                      .catch(console.error);
                  } else {
                    alert("Sharing not supported on this browser.");
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
