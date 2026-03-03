import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import type { FormFieldSchema } from "../types";

interface AutoFormProps {
    schema: FormFieldSchema[];
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function AutoForm({
    schema,
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
    submitLabel = "Save",
}: AutoFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const defaults: Record<string, any> = {};
        schema.forEach((field) => {
            defaults[field.name] = initialData?.[field.name] ?? field.defaultValue ?? "";
        });
        setFormData(defaults);
    }, [schema, initialData]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        schema.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
                {schema.filter(f => !f.showIf || f.showIf(formData)).map((field) => (
                    <Grid key={field.name} size={field.grid || { xs: 12 }}>
                        {field.type === "select" ? (
                            <TextField
                                select
                                fullWidth
                                label={field.label}
                                value={formData[field.name] ?? ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                size="small"
                            >
                                {field.options?.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <TextField
                                fullWidth
                                type={field.type}
                                label={field.label}
                                value={formData[field.name] ?? ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]}
                                size="small"
                                slotProps={{
                                    inputLabel: { shrink: field.type === "date" ? true : undefined }
                                }}
                            />
                        )}
                    </Grid>
                ))}
            </Grid>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
                <Button onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </Button>
            </Stack>
        </Box>
    );
}
