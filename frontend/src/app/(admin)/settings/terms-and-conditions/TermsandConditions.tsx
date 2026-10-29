"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Controller, Control, UseFormRegister, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetTermsConditionsQuery,
  useCreateOrUpdateTermsConditionsMutation,
} from "../../../../store/services/settings/terms-and-conditions/termsConditionsApi";
import TermsRichTextEditor from "./TermsRichTextEditor";
import {
  TERMS_SECTIONS,
  TermsFormValues,
  TermsSectionKey,
  getEmptyTermsFormValues,
  mapApiDataToFormValues,
} from "./termsSections";
import "./TermsandConditions.scss";

type TermsEditorSectionProps = {
  sectionKey: TermsSectionKey;
  label: string;
  eager?: boolean;
  control: Control<TermsFormValues>;
  register: UseFormRegister<TermsFormValues>;
};

const TermsEditorSection = ({
  sectionKey,
  label,
  eager = false,
  control,
  register,
}: TermsEditorSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(eager);

  useEffect(() => {
    if (isVisible) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div className="tnc-section" ref={sectionRef}>
      <div className="tnc-section-header">
        <h6 className="tnc-section-title">{label}</h6>
        <label className="tnc-default-selected">
          <span>Default Selected:</span>
          <input
            type="checkbox"
            className="form-check-input"
            {...register(`defaultSelected.${sectionKey}`)}
          />
        </label>
      </div>
      {isVisible ? (
        <Controller
          name={sectionKey}
          control={control}
          render={({ field }) => (
            <TermsRichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
            />
          )}
        />
      ) : (
        <div className="tnc-editor-placeholder" />
      )}
    </div>
  );
};

const TermsandConditions = () => {
  const { data, isLoading } = useGetTermsConditionsQuery(null);
  const [createOrUpdateTermsConditions, { isLoading: isSaving }] =
    useCreateOrUpdateTermsConditionsMutation();

  const { control, handleSubmit, reset, register } = useForm<TermsFormValues>({
    defaultValues: getEmptyTermsFormValues(),
  });

  useEffect(() => {
    if (data?.data) {
      reset(mapApiDataToFormValues(data.data));
    }
  }, [data, reset]);

  const onSubmit = async (formData: TermsFormValues) => {
    try {
      const result = await createOrUpdateTermsConditions(formData).unwrap();
      if (result?.success === false) {
        toast.error("Failed to save. Please check the form and try again.");
        return;
      }
      toast.success("Terms & Conditions saved successfully");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  };

  const handleReset = () => {
    reset(mapApiDataToFormValues(data?.data));
  };

  if (isLoading) return <p style={{ fontSize: "12px" }}>Loading...</p>;

  return (
    <div className="tnc-page">
      <Card className="p-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          {TERMS_SECTIONS.map((section, index) => (
            <TermsEditorSection
              key={section.key}
              sectionKey={section.key}
              label={section.label}
              eager={index < 4}
              control={control}
              register={register}
            />
          ))}

          <div className="tnc-actions">
            <Button
              variant="outline-primary"
              size="sm"
              type="button"
              style={{ fontSize: "12px" }}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              style={{ fontSize: "12px" }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TermsandConditions;
