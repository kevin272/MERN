import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler} from "react-hook-form";
import { useEffect } from "react";
import {
  InputLabel,
  TextInputComponent,
  RoleSelectComponent,
  SubmitButton,
  CancelButton,
} from "../common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";

interface UserFormData {
  fullname: string;
  email: string;
  password?: string; 
  confirmPassword?: string;
  expertise: string;
  title: string;
  phone: string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  role: { label: string; value: string };
  image?: File | string | null;
  description: string;
}

interface TeamFormComponentProps {
  submitEvent: SubmitHandler<UserFormData>;
  loading: boolean;
  initialData?: Partial<UserFormData>; // Optional initial data for editing
}

const TeamFormComponent = ({
  submitEvent,
  loading,
  initialData,
}: TeamFormComponentProps) => {
  const teamDTO = Yup.object().shape({
    fullname: Yup.string().min(3).max(100).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).max(100).optional(), // Optional for editing
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .optional(), // Optional for editing
    expertise: Yup.string().required(),
    title: Yup.string().required(),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required(),
    facebook: Yup.string().url().nullable(),
    twitter: Yup.string().url().nullable(),
    linkedin: Yup.string().url().nullable(),
    role: Yup.object().shape({
      label: Yup.string()
        .matches(/^(admin|member)$/)
        .required(),
      value: Yup.string()
        .matches(/^(admin|member)$/)
        .required(),
    }).required(),
    image: Yup.mixed<File | string>()
      .optional()
      .nullable(),
    description: Yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(teamDTO),
    defaultValues: initialData, // Set default values from initialData
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <InputLabel htmlFor="fullname">Full Name:</InputLabel>
          <TextInputComponent
            name="fullname"
            control={control}
            errMsg={errors?.fullname?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="email">Email:</InputLabel>
          <TextInputComponent
            name="email"
            control={control}
            type="email"
            errMsg={errors?.email?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="password">Password:</InputLabel>
          <TextInputComponent
            name="password"
            control={control}
            type="password"
            errMsg={errors?.password?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="confirmPassword">Confirm Password:</InputLabel>
          <TextInputComponent
            name="confirmPassword"
            control={control}
            type="password"
            errMsg={errors?.confirmPassword?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="title">Title:</InputLabel>
          <TextInputComponent
            name="title"
            control={control}
            type="text"
            errMsg={errors?.title?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="expertise">Expertise:</InputLabel>
          <TextInputComponent
            name="expertise"
            control={control}
            type="text"
            errMsg={errors?.expertise?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="phone">Phone Number:</InputLabel>
          <TextInputComponent
            name="phone"
            control={control}
            errMsg={errors?.phone?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="facebook">Facebook URL:</InputLabel>
          <TextInputComponent
            name="facebook"
            control={control}
            type="url"
            errMsg={errors?.facebook?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="twitter">Twitter URL:</InputLabel>
          <TextInputComponent
            name="twitter"
            control={control}
            type="url"
            errMsg={errors?.twitter?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="linkedin">LinkedIn URL:</InputLabel>
          <TextInputComponent
            name="linkedin"
            control={control}
            type="url"
            errMsg={errors?.linkedin?.message}
          />
        </div>
        <div className="w-full sm:col-span-2">
          <InputLabel htmlFor="role">Role:</InputLabel>
          <RoleSelectComponent
            name="role"
            control={control}
            errMsg={errors?.role?.message || ""}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="image">Profile Image:</InputLabel>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            type="file"
            onChange={(e: any) => {
              const image = e.target.files[0];
              setValue("image", image);
            }}
          />
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="description">Description:</InputLabel>
          <textarea
            id="description"
            rows={10}
            {...register("description")}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Your description here"
            style={{ whiteSpace: "pre-wrap" }}
          />
          {errors?.description && (
            <p className="text-red-500 text-xs">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
      <br />

      <SubmitButton loading={loading}>
        <FaPaperPlane className="me-3" />{" "}
        {initialData ? "Update Member" : "Add Member"}
      </SubmitButton>

      <CancelButton loading={loading}>
        <FaUndo className="me-3" /> Cancel
      </CancelButton>
    </form>
  );
};

export default TeamFormComponent;