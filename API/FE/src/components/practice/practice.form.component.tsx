import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  InputLabel,
  TextInputComponent,
  SubmitButton,
  CancelButton,
  StatusSelectComponent,
} from "../common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";
import { useEffect, useState } from "react";

const PracticeFormComponent = ({
  detail = null,
  submitEvent,
  loading,
}: {
  detail?: any;
  submitEvent: any;
  loading: boolean;
}) => {
  const practiceDTO = Yup.object({
    title: Yup.string().min(3).max(150).required(),
    image: Yup.mixed().optional().default(null),
    status: Yup.object({
      label: Yup.string()
        .matches(/^(Publish|Unpublish)$/)
        .required(),
      value: Yup.string()
        .matches(/^(active|inactive)$/)
        .required(),
    }).required(),
    description: Yup.string().min(10).max(5000).required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(practiceDTO),
    defaultValues: {
      title: '',
      status: { label: '', value: '' },
      description: '',
    },
  });
  
  const [thumbnail, setthumbnail] = useState<string | File>();

  useEffect(() => {
    if (detail) {
      setValue("title", detail?.title || '');
      setValue("status", detail?.status || { label: '', value: '' });
      setValue("image", detail?.image || null);
      setValue("description", detail?.description || '');
      setthumbnail(detail?.image || null);
    }
  }, [detail]);
  

  return (
    <>
      <form onSubmit={handleSubmit(submitEvent)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Title */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="title">Title:</InputLabel>
            <TextInputComponent
              name="title"
              control={control}
              errMsg={errors?.title?.message}
            />
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="image">Image</InputLabel>
            <div className="flex gap-2">
              <div className="w-3/4">
                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white dark:bg-gray-800"
                  type="file"
                  onChange={(e: any) => {
                    const image = e.target.files[0];
                    setValue("image", image);
                    setthumbnail(image);
                  }}
                />
              </div>

              <div className="w-1/4">
                <img
                  src={
                    thumbnail
                      ? typeof thumbnail === "string"
                        ? thumbnail
                        : URL.createObjectURL(thumbnail)
                      : "https://placehold.co/600x400?text=No+Image+Found"
                  }
                  alt="Image"
                  className="max-w-full"
                />
              </div>
            </div>

            <div className="w-full">
              <InputLabel htmlFor="status">Status:</InputLabel>
              <StatusSelectComponent
                name="status"
                control={control}
                errMsg={errors?.status?.message || ""}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <InputLabel htmlFor="description">Description:</InputLabel>
              <textarea
                id="description"
                rows={10}
                {...register("description")}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Your description here"
              />
              {errors?.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <br />

        {/* Submit and Cancel Buttons */}
        <SubmitButton loading={loading}>
          <FaPaperPlane className="me-3" /> Add Practice
        </SubmitButton>

        <CancelButton loading={loading}>
          <FaUndo className="me-3" /> Cancel
        </CancelButton>
      </form>
    </>
  );
};

export default PracticeFormComponent;
