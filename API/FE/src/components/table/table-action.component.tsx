import { FaPen, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2" 

export const ActionButtons = ({ editUrl, deleteAction, rowId }: { editUrl: string, deleteAction: any, rowId: string }) => {

    const handleDelete = async (e: any) => {
        e.preventDefault();
        try {
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
                // API call to delete the request
                deleteAction(rowId);
            }
        } catch (exception) {
            console.log(exception);
        }
    };

    return (
        <>
            <NavLink
                to={editUrl}
                className="bg-teal-600 font-medium text-white p-2 rounded-full hover:bg-teal-800"
            >
                <FaPen />
            </NavLink>
            <a
                href="#"
                onClick={handleDelete}  
                className="bg-red-600 font-medium text-white p-2 rounded-full hover:bg-red-800 dark:text-cyan-500"
            >
                <FaTrash />
            </a>
        </>
    );
};
