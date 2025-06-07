import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
    InputLabel,
    TextInputComponent,
    TextAreaInputComponent,
    SelectComponent,
    SubmitButton,
    CancelButton,
} from "../common/form/input.component";
import { FileInput } from "flowbite-react";
import { FaPaperPlane, FaUndo } from "react-icons/fa";
import { Breadcrumb } from "flowbite-react";

interface CampaignFormProps {
  detail?: CampaignFormData;
  submitEvent: (data: CampaignFormData) => void;
  loading: boolean;
}


// Schema for validation
const campaignSchema = Yup.object({
    title: Yup.string().min(3).max(150).required("Title is required"),
    description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .max(5000, "Description cannot exceed 5000 characters")
        .required("Description is required"),
    goalAmount: Yup.number()
        .min(1, "Goal amount must be at least 1")
        .required("Goal amount is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    category: Yup.string().required("Category is required"),
    image: Yup.mixed().optional().nullable(),
});

type CampaignFormData = Yup.InferType<typeof campaignSchema>;

const categoryOptions = [
    { label: "Technology", value: "technology" },
    { label: "Arts", value: "arts" },
    { label: "Music", value: "music" },
    { label: "Film", value: "film" },
];

const CampaignFormComponent = ({
    detail,
    submitEvent,
    loading,
}: CampaignFormProps) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(campaignSchema),
        defaultValues: detail,
    });

    const [thumbnail, setThumbnail] = useState<string | File | null>(
        typeof detail?.image === "string" || detail?.image instanceof File
            ? detail.image
            : null
    );

    const handleImageChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setValue("image", file as any);
            setThumbnail(file || null);
        },
        [setValue]
    );

    useEffect(() => {
        if (detail) {
            reset(detail);
            setThumbnail(
                typeof detail.image === "string" || detail.image instanceof File
                    ? detail.image
                    : null
            );
        }
    }, [detail, reset]);

    const handleCancel = () => {
        reset();
        setThumbnail(
            typeof detail?.image === "string" || detail?.image instanceof File
                ? detail.image
                : null
        );
    };

    return (
        <>
            <Breadcrumb>Campaign</Breadcrumb>
            <form onSubmit={handleSubmit(submitEvent)}>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="title">Title:</InputLabel>
                        <TextInputComponent
                            name="title"
                            control={control}
                            errMsg={errors?.title?.message}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="description">Description:</InputLabel>
                        <TextAreaInputComponent
                            name="description"
                            control={control}
                            row={10}
                            errMsg={errors?.description?.message}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="goalAmount">Goal Amount:</InputLabel>
                        <TextInputComponent
                            name="goalAmount"
                            type="number"
                            control={control}
                            errMsg={errors?.goalAmount?.message}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="category">Category:</InputLabel>
                        <SelectComponent
                            name="category"
                            control={control}
                            errMsg={errors?.category?.message || ""}
                            options={categoryOptions}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="startDate">Start Date:</InputLabel>
                        <TextInputComponent
                            name="startDate"
                            type="date"
                            control={control}
                            errMsg={errors?.startDate?.message}
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="endDate">End Date:</InputLabel>
                        <TextInputComponent
                            name="endDate"
                            type="date"
                            control={control}
                            errMsg={errors?.endDate?.message}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="image">Image</InputLabel>
                        <div className="flex gap-2">
                            <div className="w-3/4">
                                <FileInput
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="w-1/4">
                                {thumbnail ? (
                                    <img
                                        src={
                                            typeof thumbnail === "string"
                                                ? thumbnail
                                                : URL.createObjectURL(thumbnail)
                                        }
                                        alt="Campaign Thumbnail"
                                        className="max-w-full"
                                    />
                                ) : (
                                    <img
                                        src="https://placehold.co/600x400?text=No+Image"
                                        alt="Placeholder"
                                        className="max-w-full"
                                    />
                                )}
                            </div>
                        </div>
                        {errors?.image && (
                            <p className="text-red-500 text-xs">{errors.image.message}</p>
                        )}
                    </div>
                </div>

                <SubmitButton loading={loading}>
                    <FaPaperPlane className="me-3" />
                    {detail ? "Update Campaign" : "Create Campaign"}
                </SubmitButton>
                <span onClick={handleCancel}>
                    <CancelButton loading={loading}>
                        <FaUndo className="me-3" />
                        Cancel
                    </CancelButton>
                </span>
            </form>
        </>
    );
};

export default CampaignFormComponent;
