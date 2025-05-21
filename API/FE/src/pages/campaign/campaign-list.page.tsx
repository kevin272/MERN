import { Pagination, TextInput, Badge } from "flowbite-react"; // Keep necessary Flowbite components
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import LoadingComponent from "../../components/common/loading/loading.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CampaignSvc from "./campaigns.service";
import { SearchParams } from "../../config/constants"; // Assuming SearchParams type is defined
import { ActionButtons } from "../../components/table/table-action.component"; // Re-use ActionButtons

const Campaignlistingpage = () => {
  // State for pagination details
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalpages: 1,
  });

  // State for campaign data
  const [campaigns, setCampaigns] = useState<any[]>([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for search input
  const [search, setSearch] = useState<string>('');

  // Function to fetch campaign data from the API
  const getallCampaign = useCallback(async ({ page = 1, limit = 5, search = '' }: SearchParams) => {
    setLoading(true);
    try {
      console.log("Frontend: Fetching campaigns with params:", { page, limit, search });
      const response: any = await CampaignSvc.getCampaigns({ page, limit, search }); 
      
      console.log("Frontend: API Response received:", response);

      setCampaigns(response.result || []); 
      console.log("Frontend: Campaigns state updated to:", response.result);

      if (response.meta) {
        setPagination({
          currentPage: response.meta.page, 
          totalpages: Math.ceil(response.meta.total / response.meta.limit)
        });
        console.log("Frontend: Pagination state updated to:", {
          currentPage: response.meta.page,
          totalpages: Math.ceil(response.meta.total / response.meta.limit)
        });
      } else {
        console.warn("Frontend: Response meta data is missing or empty. Using fallback pagination.");
        setPagination({ currentPage: page, totalpages: 1 });
      }

    } catch (exception) {
      console.error("Frontend: Error fetching Campaign lists:", exception);
      toast.error("Error while fetching Campaign lists");
    } finally {
      setLoading(false);
      console.log("Frontend: Loading state set to false.");
    }
  }, []);

  // Initial data fetch when the component mounts
  useEffect(() => {
    getallCampaign({
      page: 1,
      limit: 5,
      search: ''
    });
  }, [getallCampaign]);

  // Debounce effect for search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      getallCampaign({
        page: 1,
        limit: 5,
        search: search
      });
    }, 500); // 500ms debounce
    return () => {
      clearTimeout(timeout);
    };
  }, [search, getallCampaign]);

  // Callback for pagination page changes
  const onPageChange = useCallback(async(page: number) => {
    await getallCampaign({
      page: page,
      limit: 5,
      search: search
    });
  },[getallCampaign, search]);

  // Delete data function
  const deleteData = async (id:string)=>{
      try{
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        });
    
        if (result.isConfirmed) {
          await CampaignSvc.deleteCampaign(id); 
          toast.success("Campaign deleted successfully");
          getallCampaign({
           page: pagination.currentPage,
           limit: 5,
           search: search
          });
        }
      }catch(exception){
          console.error("Campaign deletion error:", exception);
          toast.error("Campaign cannot be deleted at this moment");
      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <HeadingWithLink
            title="Campaign Management"
            link="/admin/campaign/create"
            btntxt="Add Campaign"
            // Assuming HeadingWithLink can accept custom button classes or styles
            // If not, you might need to modify HeadingWithLink or create a custom button here.
            // For now, I'll apply styles to the button it generates if it's a simple link.
            // If HeadingWithLink is a simple text and link, we'll rely on global styles or its internal structure.
          />
          <TextInput
            className="w-full sm:w-64 lg:w-80"
            type="search"
            placeholder="Search campaigns..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
            }}
            value={search}
            theme={{
              field: {
                input: {
                  base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
                  sizes: { sm: "p-2 sm:text-xs", md: "p-2.5 text-sm", lg: "p-4 sm:text-base" },
                  colors: {
                    gray: "bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-emerald-500 dark:focus:ring-emerald-500"
                  },
                  withAddon: { on: "rounded-l-lg", off: "rounded-lg" },
                  withIcon: { on: "pl-10", off: "" },
                },
              },
            }}
          />
        </div>
        <hr className="my-6 border-emerald-300 dark:border-emerald-700" /> {/* Green divider */}

        {/* Campaign Cards Grid */}
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            {campaigns && campaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {campaigns.map((row: any) => (
                  <div
                    key={row._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                               transform transition-all duration-300 hover:scale-103 hover:shadow-xl
                               border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={row.image}
                      alt={row.title}
                      className="w-full h-48 object-cover object-center rounded-t-xl"
                      onError={(e:any) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555555?text=No+Image" }}
                    />
                    <div className="p-5 flex flex-col justify-between h-[calc(100%-12rem)]"> {/* Adjust height based on image height */}
                      <div>
                        <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2 line-clamp-2">
                          {row.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                          {row.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>By: {row.createdBy?.name || "N/A"}</span>
                        <Badge 
                          color={row.status === "active" ? "success" : "failure"} // Use Flowbite's success/failure colors
                          className="px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {row.status === "active" ? "Published" : "Unpublished"}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <ActionButtons
                          editUrl={`/admin/campaign/edit/${row._id}`}
                          deleteAction={deleteData}
                          rowId={row._id}
                          // You might need to adjust ActionButtons component to accept custom styling for its buttons
                          // For example, if it uses Flowbite buttons, you can pass theme props.
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <p className="text-lg font-medium">No Campaigns Found</p>
                <p className="text-sm mt-2">Try adjusting your search or add a new campaign.</p>
              </div>
            )}
          </>
        )}

        {/* Pagination component */}
        {campaigns.length > 0 && ( // Only show pagination if there are campaigns
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalpages}
              onPageChange={onPageChange}
              showIcons
              // Customizing Flowbite Pagination for green theme might require a custom theme setup
              // or overriding CSS. For simplicity, we'll rely on its default appearance
              // which usually has blue accents, or you can try to target classes with custom CSS.
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaignlistingpage;