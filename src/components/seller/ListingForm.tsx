"use client";

import { useState }              from "react";
import { useForm }               from "react-hook-form";
import { zodResolver }           from "@hookform/resolvers/zod";
import { z }                     from "zod";
import { motion }                from "framer-motion";
import { MultiImageUpload }      from "@/components/common/ImageUpload";
import { CATEGORIES, CONDITIONS } from "@/config/constants";
import { cn }                    from "@/lib/utils";

const listingSchema = z.object({
  title:         z.string().min(5, "At least 5 characters"),
  description:   z.string().min(20, "At least 20 characters"),
  category:      z.string().min(1),
  condition:     z.string().min(1),
  brand:         z.string().optional(),
  location:      z.string().min(1, "Required"),
  shippingCost:  z.number().min(0),
  startingPrice: z.number().min(100, "Min ৳100"),
  bidIncrement:  z.number().min(100, "Min ৳100"),
  startTime:     z.string().min(1, "Required"),
  endTime:       z.string().min(1, "Required"),
  videoUrl:      z.string().url().optional().or(z.literal("")),
});

export type ListingFormData = z.infer<typeof listingSchema> & { photos: string[] };

interface ListingFormProps {
  defaultValues?: Partial<ListingFormData>;
  onSubmit:       (data: ListingFormData) => Promise<void>;
  isLoading?:     boolean;
  submitLabel?:   string;
}

export function ListingForm({
  defaultValues, onSubmit, isLoading, submitLabel = "Create Listing",
}: ListingFormProps) {
  const [photos, setPhotos] = useState<string[]>(defaultValues?.photos || []);
  const [photoError, setPhotoError] = useState("");

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver:      zodResolver(listingSchema),
    defaultValues: {
      category:     "electronics",
      condition:    "new",
      shippingCost: 0,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: z.infer<typeof listingSchema>) => {
    if (photos.length < 2) {
      setPhotoError("At least 2 photos required");
      return;
    }
    setPhotoError("");
    await onSubmit({ ...data, photos });
  };

  const Field = ({
    name, label, type = "text", placeholder, required = false, children,
  }: {
    name: keyof z.infer<typeof listingSchema>;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          {...form.register(name, type === "number" ? { valueAsNumber: true } : {})}
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500 focus:border-transparent transition-all"
        />
      )}
      {form.formState.errors[name] && (
        <p className="text-xs text-destructive">{form.formState.errors[name]?.message as string}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

      {/* Basic Info */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Basic Info</h3>

        <Field name="title" label="Title" placeholder="What are you selling?" required />

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
          <textarea
            {...form.register("description")}
            rows={4}
            placeholder="Describe the item in detail..."
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500 transition-all resize-none"
          />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="category" label="Category" required>
            <select {...form.register("category")}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.labelEn}</option>)}
            </select>
          </Field>
          <Field name="condition" label="Condition" required>
            <select {...form.register("condition")}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500">
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.labelEn}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field name="brand"    label="Brand"    placeholder="Optional" />
          <Field name="location" label="Location" placeholder="City / Area" required />
        </div>
      </div>

      {/* Photos */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Photos</h3>
        <MultiImageUpload
          values={photos}
          onChange={setPhotos}
          max={10}
        />
        {photoError && <p className="text-xs text-destructive">{photoError}</p>}
      </div>

      {/* Pricing */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Pricing</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field name="startingPrice" label="Starting Price (৳)" type="number" placeholder="1000" required />
          <Field name="bidIncrement"  label="Bid Increment (৳)"  type="number" placeholder="500"  required />
        </div>
        <Field name="shippingCost" label="Shipping Cost (৳)" type="number" placeholder="0 = Free" />
      </div>

      {/* Schedule */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Schedule</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field name="startTime" label="Start Time" type="datetime-local" required />
          <Field name="endTime"   label="End Time"   type="datetime-local" required />
        </div>
      </div>

      {/* Video (optional) */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Video (Optional)</h3>
        <Field name="videoUrl" label="Video URL" placeholder="https://res.cloudinary.com/..." />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 bg-bid-500 hover:bg-bid-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </span>
        ) : submitLabel}
      </motion.button>
    </form>
  );
}
