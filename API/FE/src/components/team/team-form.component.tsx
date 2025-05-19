import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  InputLabel,
  TextInputComponent,
  RoleSelectComponent,
  SubmitButton,
  CancelButton,
} from "../common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";

const TeamFormComponent = ({
  submitEvent,
  loading,
}: {
  submitEvent: any;
  loading: boolean;
}) => {
  const teamDTO = Yup.object({
    fullname: Yup.string().min(3).max(100).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).max(100).required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required(),
    expertise: Yup.string().required(),
    title: Yup.string().required(),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required(),
    facebook: Yup.string().url().nullable(),
    twitter: Yup.string().url().nullable(),
    linkedin: Yup.string().url().nullable(),
    role: Yup.object({
      label: Yup.string()
        .matches(/^(admin|member)$/)
        .required(),
      value: Yup.string()
        .matches(/^(admin|member)$/)
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
    resolver: yupResolver(teamDTO),
  });

  return (
    <>
      <form onSubmit={handleSubmit(submitEvent)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="fullname">Full Name:</InputLabel>
            <TextInputComponent
              name="fullname"
              control={control}
              errMsg={errors?.fullname?.message}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="email">Email:</InputLabel>
            <TextInputComponent
              name="email"
              control={control}
              type="email"
              errMsg={errors?.email?.message}
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="password">Password:</InputLabel>
            <TextInputComponent
              name="password"
              type="password"
              control={control}
              errMsg={errors?.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="confirmPassword">Confirm Password:</InputLabel>
            <TextInputComponent
              name="confirmPassword"
              type="password"
              control={control}
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

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="phone">Phone Number:</InputLabel>
            <TextInputComponent
              name="phone"
              control={control}
              errMsg={errors?.phone?.message}
            />
          </div>

          {/* Facebook */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="facebook">Facebook:</InputLabel>
            <input
              {...register("facebook")}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {errors?.facebook && (
              <p className="text-red-500">{errors.facebook.message}</p>
            )}
          </div>

          {/* Twitter */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="twitter">Twitter:</InputLabel>
            <input
              {...register("twitter")}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {errors?.twitter && (
              <p className="text-red-500">{errors.twitter.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="linkedin">LinkedIn:</InputLabel>
            <input
              {...register("linkedin")}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
            {errors?.linkedin && (
              <p className="text-red-500">{errors.linkedin.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="w-full">
            <InputLabel htmlFor="role">Role:</InputLabel>
            <RoleSelectComponent
              name="role"
              control={control}
              errMsg={errors?.role?.message || ""}
            />
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <InputLabel htmlFor="image">Image:</InputLabel>
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
          <FaPaperPlane className="me-3" /> Add Member
        </SubmitButton>

        <CancelButton loading={loading}>
          <FaUndo className="me-3" /> Cancel
        </CancelButton>
      </form>
    </>
  );
};

export default TeamFormComponent;
