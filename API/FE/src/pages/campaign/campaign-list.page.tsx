import { Badge, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title";
import { useCallback, useEffect, useState } from "react";
import RowSkeleton from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CampaignSvc from "./campaigns.service"; // Ensure this path is correct
import { SearchParams } from "../../config/constants"; // Ensure SearchParams type is defined
import { ActionButtons } from "../../components/table/table-action.component";
import LoadingComponent from "../../components/common/loading/loading.component"; // Ensure this is imported

const Campaignlistingpage = () => {
  // State for pagination details
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalpages: 1, // Start with 1 to avoid division by zero or empty pagination
  });

  // State for campaign data
  const [campaigns, setCampaigns] = useState<any[]>([]); // Renamed for consistency
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for search input
  const [search, setSearch] = useState<string>(''); // Renamed for consistency, initialized to empty string

  // getallCampaign is responsible for fetching data from the API
  // It should be stable, so its dependencies should only be external triggers.
  const getallCampaign = useCallback(async ({ page = 1, limit = 5, search = '' }: SearchParams) => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      console.log("Frontend: Fetching campaigns with params:", { page, limit, search });
      
      // Use CampaignSvc.getCampaigns, which now calls "/campaigns" (as per service fix above)
      const response: any = await CampaignSvc.getCampaigns({ page, limit, search }); 
      
      console.log("Frontend: API Response received:", response);

      // Assuming response.result contains the array of campaigns
      setCampaigns(response.result || []); 
      console.log("Frontend: Campaigns state updated to:", response.result);

      // Update pagination state based on backend meta data
      if (response.meta) {
        setPagination({
          currentPage: response.meta.page, 
          totalpages: Math.ceil(response.meta.total / response.meta.limit) // Calculate totalPages
        });
        console.log("Frontend: Pagination state updated to:", {
          currentPage: response.meta.page,
          totalpages: Math.ceil(response.meta.total / response.meta.limit)
        });
      } else {
        console.warn("Frontend: Response meta data is missing or empty. Using fallback pagination.");
        setPagination({ currentPage: page, totalpages: 1 }); // Fallback
      }

    } catch (exception) {
      console.error("Frontend: Error fetching Campaign lists:", exception);
      toast.error("Error while fetching Campaign lists");
    } finally {
      setLoading(false); // Set loading to false when fetching completes (success or error)
      console.log("Frontend: Loading state set to false.");
    }
  }, []); // KEY FIX: Empty dependency array ensures this function is created only once.
           // It no longer depends on `pagination`, preventing the infinite loop.

  // Initial data fetch when the component mounts
  useEffect(() => {
    // This effect runs once on mount. It calls getallCampaign with initial params.
    getallCampaign({
      page: 1, // Start on page 1
      limit: 5,
      search: '' // Initial empty search
    });
  }, [getallCampaign]); // getallCampaign is stable due to useCallback([])

  // Debounce effect for search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Only fetch if search value has changed (and is not the initial empty string on first render)
      // or if you want to trigger on initial empty search too, remove the `search !== ''` check
      if (search !== '') { // This condition prevents fetching on initial empty search from this effect
        getallCampaign({
          page: 1, // Always reset to first page on search
          limit: 5,
          search: search // Use the current search value
        });
      }
    }, 500); // Debounce time: 500ms
    return () => {
      clearTimeout(timeout); // Clear previous timeout if search changes quickly
    };
  }, [search, getallCampaign]); // Depend on search and the stable getallCampaign

  // Callback for pagination page changes
  const onPageChange = useCallback(async(page: number) => {
    // We don't need to update `pagination` state here before calling `getallCampaign`
    // because `getallCampaign` will update it based on the API response.
    // Just call getallCampaign with the new page number.
    await getallCampaign({
      page: page, // Use the actual page number passed
      limit: 5, // Use the current limit
      search: search // Use the current search value
    });
  },[getallCampaign, search]); // Depend on getallCampaign and search

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
          await CampaignSvc.deleteRequest("/campaigns/"+id, {auth:true}); // Use /campaigns endpoint
          toast.success("Campaign deleted successfully");
          // Re-fetch data after deletion, staying on the current page if possible
          getallCampaign({
           page: pagination.currentPage, // Fetch current page
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
    <>
      <div className="overflow-x-auto mt-5 mb-5 ml-2 mr-2">
        <HeadingWithLink
          title="Campaign Management"
          link="/admin/campaign/create"
          btntxt="Add Campaign"
        />
        <br />
        <hr />
      </div>

      <div className="flex items-end justify-end mb-3">
        <TextInput
          className="w-1/4"
          type="search"
          placeholder="Search campaigns..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value); // Update search state
          }}
          value={search} // Controlled component
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-red-800 text-white">Campaign Name</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Author Name</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Image</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Status</Table.HeadCell>
            <Table.HeadCell className="bg-red-800 text-white">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              // Display RowSkeleton while loading
              <RowSkeleton rows={5} cols={5} />
            ) : (
              // Display campaigns or "No Data Found" message
              <>
                {campaigns && campaigns.length > 0 ? ( // Use 'campaigns' state
                  campaigns.map((row: any, index: number) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={row._id || index}> 
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.title}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.createdBy?.name || "N/A"} {/* Access createdBy.name */}
                      </Table.Cell>
                      <Table.Cell>
                        <img src={row.image} alt={row.title} className="w-24 object-cover rounded-md"/>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={row.status === "active" ? "green" : "red"}>
                          {row.status === "active" ? "Publish" : "Unpublish"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="flex gap-3">
                        <ActionButtons
                          editUrl={`/admin/campaign/edit/${row._id}`}
                          deleteAction={deleteData}
                          rowId={row._id}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell
                      colSpan={5}
                      className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-center"
                    >
                      No Data Found
                    </Table.Cell>
                  </Table.Row>
                )}
              </>
            )}
          </Table.Body>
        </Table>

        {/* Pagination component */}
        <div className="flex overflow-x-auto sm:justify-end mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalpages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      </div>
    </>
  );
};

export default Campaignlistingpage;