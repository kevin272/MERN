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
import CampaignSvc from "./campaigns.service";
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'goalAmount') ? parseFloat(value) || 0 : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, image: file || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.image) {
        toast.error("Please upload a campaign image.");
        setLoading(false);
        return; // Exit early
      }

      const submitData = new FormData();
      for (const key in formData) {
        if (key === 'image' && formData.image) {
          submitData.append(key, formData.image);
        } else if (formData[key as keyof typeof formData] !== null && formData[key as keyof typeof formData] !== undefined) {
          submitData.append(key, String(formData[key as keyof typeof formData])); 
        }
      }

      // CRUCIAL LOGGING: Inspect FormData before sending
      console.log("Frontend: FormData contents before sending (Create Campaign):");
      for (let pair of submitData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
      }

      const response = await CampaignSvc.createCampaign(submitData);
      console.log("Frontend: Campaign creation response:", response); 

      toast.success("Campaign created successfully!");
      navigate("/admin/campaign"); 
    } catch (error: any) { // Catch the error to access its properties
      console.error("Frontend: Error creating campaign:", error); // Log the full error object
      const errorMessage = error.response?.data?.message || "Could not create campaign. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Create Campaign</Heading1>
        <br />
        <hr className="border-green-600" /> 
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
          {loading ? (
            <LoadingComponent />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="title" value="Title" className="text-green-800" />  
                <TextInput
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Campaign Title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="focus:border-green-600 focus:ring-green-600 rounded-md"   
                />
              </div>

              <div>
                <Label htmlFor="description" value="Description" className="text-green-800" />  
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Campaign Description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="focus:border-green-600 focus:ring-green-600 rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="goalAmount" value="Goal Amount" className="text-green-800" />
                <TextInput
                  id="goalAmount"
                  name="goalAmount"
                  type="number"
                  placeholder="Goal Amount"
                  required
                  value={formData.goalAmount ? formData.goalAmount.toString() : ""}
                  onChange={handleChange}
                  className="focus:border-green-600 focus:ring-green-600 rounded-md"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1"> 
                  <Label htmlFor="startDate" value="Start Date" className="text-green-800" />
                  <TextInput
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="focus:border-green-600 focus:ring-green-600 rounded-md"
                  />
                </div>

                <div className="flex-1"> {/* Use flex-1 */}
                  <Label htmlFor="endDate" value="End Date" className="text-green-800" />
                  <TextInput
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={handleChange}
                    className="focus:border-green-600 focus:ring-green-600 rounded-md" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" value="Category" className="text-green-800" /> 
                <Select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="focus:border-green-600 focus:ring-green-600 rounded-md" 
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="arts">Arts</option>
                  <option value="music">Music</option>
                  <option value="film">Film</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="image" value="Upload Image" className="text-green-800" />
                <FileInput
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="focus:border-green-600 focus:ring-green-600 rounded-md"
                />
                {formData.image && typeof formData.image !== "string" && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                    {formData.image.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="bg-green-700 hover:bg-green-800 focus:ring-green-600 focus:ring-offset-2 rounded-lg text-white font-semibold py-3 px-6 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Create Campaign
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCampaignPage;