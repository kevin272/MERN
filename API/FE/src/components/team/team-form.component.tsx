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
  name: string; // Changed from fullname to name
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
  bio: string; // Changed from description to bio
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
    name: Yup.string().min(3).max(100).required(), // Changed from fullname to name
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
    bio: Yup.string().required(), // Changed from description to bio
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch, // To watch for current image value
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(teamDTO),
    defaultValues: initialData, // Set default values from initialData
  });

  const currentImage = watch("image"); // Watch the image field value

  useEffect(() => {
    if (initialData) {
      // Ensure the image field is correctly set if it's a string URL
      reset({
        ...initialData,
        image: initialData.image || null, // Ensure 'image' is either a URL or null
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <InputLabel htmlFor="name">Full Name:</InputLabel>
          <TextInputComponent
            name="name" // Changed from fullname to name
            control={control}
            errMsg={errors?.name?.message}
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
        {/* Conditional rendering for password fields */}
        {!initialData && ( // Only show if initialData is NOT provided (i.e., for new user creation)
          <>
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
          </>
        )}
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
          {/* Display existing image if available and it's a string (URL) */}
          {typeof currentImage === 'string' && currentImage && (
            <div className="mb-4">
              <img
                src={currentImage}
                alt="Current Profile"
                className="w-24 h-24 object-cover rounded-full mx-auto shadow-md"
                onError={(e) => { // Fallback for broken images
                  e.currentTarget.src = "https://placehold.co/100x100/CCCCCC/FFFFFF?text=No+Image";
                  e.currentTarget.onerror = null; // Prevent infinite loop
                }}
              />
              <p className="text-center text-gray-500 text-xs mt-1">Current Image</p>
            </div>
          )}
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            type="file"
            onChange={(e: any) => {
              const file = e.target.files[0];
              if (file) {
                setValue("image", file);
              } else {
                // If user clears selection, reset image value (e.g., if they want to remove it)
                setValue("image", null);
              }
            }}
          />
          {errors?.image && (
            <p className="text-red-500 text-xs">
              {errors.image.message}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <InputLabel htmlFor="bio">Description:</InputLabel>
          <textarea
            id="bio" 
            rows={10}
            {...register("bio")} 
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Your description here"
            style={{ whiteSpace: "pre-wrap" }}
          />
          {errors?.bio && (
            <p className="text-red-500 text-xs">
              {errors.bio.message}
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
