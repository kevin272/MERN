import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  TextInput,
  Textarea,
  Button,
  Label,
  FileInput,
  Select,
} from "flowbite-react";
import Heading1 from "../../components/common/title";
import LoadingComponent from "../../components/common/loading/loading.component";
import CampaignSvc from "./campaigns.service"; // Import your Campaign Service

const EditCampaignPage = () => {
  const [loading, setLoading] = useState(true); // Keep loading true initially
  const { id } = useParams(); // Get the campaign ID from the URL
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number; // Keep in state for display, but filter out for submission
    startDate: string;
    endDate: string;
    category: string;
    image: File | string | null; // Image can be a File object or a string URL
    status: string;
  }>({
    title: "",
    description: "",
    goalAmount: 0,
    currentAmount: 0,
    startDate: "",
    endDate: "",
    category: "",
    image: null,
    status: "pending", // Or whatever your default status is
  });
  const [error, setError] = useState<string | null>(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      try {
        if (!id) {
          setError("Campaign ID is missing from the URL.");
          setLoading(false);
          return;
        }

        console.log("Frontend (EditPage): Attempting to fetch campaign with ID:", id);
        
        const response: any = await CampaignSvc.getCampaign(id);
        
        console.log("Frontend (EditPage): RAW API Response for campaign details:", response);

        const campaignData = response.result; 

        if (campaignData) {
          setFormData({
            title: campaignData.title,
            description: campaignData.description,
            goalAmount: campaignData.goalAmount,
            currentAmount: campaignData.currentAmount,
            startDate: campaignData.startDate ? new Date(campaignData.startDate).toISOString().split('T')[0] : "",
            endDate: campaignData.endDate ? new Date(campaignData.endDate).toISOString().split('T')[0] : "",
            category: campaignData.category,
            image: campaignData.image, 
            status: campaignData.status,
          });
          console.log("Frontend (EditPage): FormData updated with campaign data:", campaignData);
        } else {
          setError("Campaign data not found in response. Response.result was null/undefined.");
          toast.error("Campaign data not found.");
        }
      } catch (exception: any) {
        console.error("Frontend (EditPage): Error fetching campaign details:", exception);
        const backendErrorMessage = exception.response?.data?.message;
        setError(backendErrorMessage || exception.message || "Could not get campaign details. Please try again.");
        toast.error(backendErrorMessage || "Could not get campaign details.");
      } finally {
        setLoading(false); // Stop loading
        console.log("Frontend (EditPage): Loading set to false.");
      }
    };

    fetchCampaign();
  }, [id, navigate]); // Re-run effect if ID changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Ensure value is always a string for status, and convert goalAmount to number
    setFormData(prev => ({ 
        ...prev, 
        [name]: (name === 'goalAmount' || name === 'currentAmount') ? parseFloat(value) || 0 : value 
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
      const submitData = new FormData();
      type FormDataKey = keyof typeof formData;
      (Object.keys(formData) as FormDataKey[]).forEach((key) => {
        // *** CRITICAL FIX 1: Filter out 'currentAmount' ***
        // *** CRITICAL FIX 2: Ensure 'status' is appended as a string ***
        if (key === 'currentAmount') {
            // Do not append currentAmount as backend does not allow it
            return; 
        } else if (key === 'image' && formData.image instanceof File) {
            submitData.append(key, formData.image);
        } else if (key === 'status') {
            submitData.append(key, String(formData[key])); // Ensure status is always a string
        }
        else if (formData[key] !== null && formData[key] !== undefined) {
            // Convert numbers to strings for FormData
            submitData.append(key, String(formData[key])); 
        }
      });
      
      console.log("Frontend (EditPage): Submitting updated campaign data:");
      for (let pair of submitData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]); 
      }

      const response = await CampaignSvc.updateCampaign(id!, submitData); 
      console.log("Frontend (EditPage): Campaign update response:", response);

      toast.success("Campaign updated successfully!");
      navigate("/admin/campaign"); 
    } catch (error: any) {
      console.error("Frontend (EditPage): Error updating campaign:", error);
      const errorMessage = error.response?.data?.message || "Could not update campaign. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <p>Please check the URL or try again.</p>
      </div>
    );
  }

  if (!formData.title && !loading) { 
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 p-8">
        Campaign not found or data is incomplete.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <Heading1>Edit Campaign</Heading1>
        <br />
        <hr />
      </div>

      <div>
        <div className="py-3 px-4 lg:py-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"></h2>
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
              </Select>
            </div>

            {/* Status Field */}
            <div>
              <Label htmlFor="status" value="Status" />
              <Select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="successful">Successful</option>
                <option value="failed">Failed</option>
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
              {/* Display current image if it's a string (URL) */}
              {formData.image && typeof formData.image === "string" && (
                <img src={formData.image} alt="Current Campaign Image" className="mt-2 max-h-48 object-cover rounded-md" />
              )}
              {/* Display selected new image name if it's a File object */}
              {formData.image && typeof formData.image !== "string" && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  New image selected: {formData.image.name}
                </p>
              )}
            </div>

            <Button type="submit">Update Campaign</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCampaignPage;