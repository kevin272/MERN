import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  InputLabel,
  TextInputComponent,
  StatusSelectComponent,
  SubmitButton,
  CancelButton,
} from "../common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";
import { Breadcrumb } from "flowbite-react";
import { useEffect, useState } from "react";

const BlogsformComponent = ({
  detail = null,
  submitEvent,
  loading,
}: {
  detail?: any;
  submitEvent: any;
  loading: boolean;
}) => {
  const blogsDTO = Yup.object({
    Authorname: Yup.string().min(3).max(100).required(),
    date: Yup.date().required(),
    title: Yup.string().min(3).max(150).required(),
    status: Yup.object({
      label: Yup.string()
        .matches(/^(Publish|Unpublish)$/)
        .required(),
      value: Yup.string()
        .matches(/^(active|inactive)$/)
        .required(),
    }).required(),
    image: Yup.mixed().optional().default(null),
    description: Yup.string().min(10).max(5000).required(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(blogsDTO),
  });

  const [thumbnail, setthumbnail] = useState<string | File>();

  useEffect(() => {
    if (detail) {
      setValue("title", detail?.title);
      setValue("Authorname", detail?.authorname);
      setValue("status", detail?.status);
      setValue("date", detail?.date);
      setValue("image", detail?.image);
      setValue("description", detail?.description);
      setthumbnail(detail?.image);
    }
  }, [detail]);
  return (
    <>
      <Breadcrumb> Blogs </Breadcrumb>
      <form onSubmit={handleSubmit(submitEvent)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <InputLabel htmlFor="Authorname">Author Name:</InputLabel>
            <TextInputComponent
              name="Authorname"
              control={control}
              errMsg={errors?.Authorname?.message}
            />
          </div>

          <div className="sm:col-span-2">
            <InputLabel htmlFor="title">Title:</InputLabel>
            <TextInputComponent
              name="title"
              control={control}
              errMsg={errors?.title?.message}
            />
          </div>

          <div className="w-full">
            <InputLabel htmlFor="date">Date:</InputLabel>
            <TextInputComponent
              name="date"
              type="date"
              control={control}
              errMsg={errors?.date?.message}
            />
          </div>
          <div className="w-full">
            <InputLabel htmlFor="status">Status:</InputLabel>
            <StatusSelectComponent
              name="status"
              control={control}
              errMsg={errors?.status?.message || ""}
            />
          </div>
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
          </div>
        </div>
        <br />
        <div className="sm:col-span-2">
          <InputLabel htmlFor="description">Description:</InputLabel>
          <textarea
            id="description"
            rows={10}
            {...register("description")}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Your description here"
            style={{ whiteSpace: "pre-wrap" }} // Ensures spaces and line breaks are preserved
          />
          {errors?.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <SubmitButton loading={loading}>
          <FaPaperPlane className="me-3" /> Publish Blog
        </SubmitButton>
        <CancelButton loading={loading}>
          <FaUndo className="me-3" /> Cancel
        </CancelButton>
      </form>
    </>
  );
};

export default BlogsformComponent;
