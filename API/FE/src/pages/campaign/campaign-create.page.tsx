import React, { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Label,
  FileInput,
  Select,
} from "flowbite-react";
import Heading1 from "../../components/common/title";
import { toast } from "react-toastify";
import CampaignSvc from "./campaigns.service"; // Assuming you'll create this
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/common/loading/loading.component";

const CreateCampaignPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    goalAmount: number;
    startDate: string;
    endDate: string;
    category: string;
    image: File | null;
  }>({
    title: "",
    description: "",
    goalAmount: 0,
    startDate: "",
    endDate: "",
    category: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, image: file || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      //   if (!formData.image) {
      //     toast.error("Please upload an image");
      //     return;
      //   }

      const submitData = new FormData();
      for (const key in formData) {
        //  @ts-ignore
        submitData.append(key, formData[key]);
      }

      await CampaignSvc.createCampaign(submitData);
      toast.success("Campaign created successfully!");
      navigate("/admin/campaigns"); //  Redirect to campaign list page
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Could not create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Create Campaign</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <LoadingComponent />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" value="Title" />
                <TextInput
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Campaign Title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="description" value="Description" />
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Campaign Description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="goalAmount" value="Goal Amount" />
                <TextInput
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  placeholder="Goal Amount"
                  required
                  value={formData.goalAmount ? formData.goalAmount.toString() : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <Label htmlFor="startDate" value="Start Date" />
                  <TextInput
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" value="End Date" />
                  <TextInput
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" value="Category" />
                <Select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="arts">Arts</option>
                  <option value="music">Music</option>
                  <option value="film">Film</option>
                  {/* Add more categories as needed */}
                </Select>
              </div>

              <div>
                <Label htmlFor="image" value="Upload Image" />
                <FileInput
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && typeof formData.image !== "string" && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    {formData.image.name}
                  </p>
                )}
              </div>

              <Button type="submit">Create Campaign</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCampaignPage;