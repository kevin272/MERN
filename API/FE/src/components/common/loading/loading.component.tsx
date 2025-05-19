import { Spinner } from "flowbite-react";

const LoadingComponent = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Spinner aria-label="Loading..." className="fill-red-800" size="xl" />
        </div>
    );
};

export default LoadingComponent;
