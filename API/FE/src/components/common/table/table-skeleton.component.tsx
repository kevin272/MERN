import {Table} from "flowbite-react";

export const Cellskeleton = () =>
{
return(
    <>
    <Table.Cell>
        <div role="status" className="max-w-sm animate-pulse" >
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4"></div>
        </div>
    </Table.Cell>
    </>
)

}

const RowSkeleton = ({ rows, cols }: { rows: number, cols: number }) => {
    return (
      <>
        {[...Array(rows)].map((_, i: number) => {
          return (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i}>
              {
                [...Array(cols)].map((_, j: number) => {
                  return (
                    <Cellskeleton key={j} />
                  );
                })
              }
            </Table.Row>
          );
        })}
      </>
    );
  };

  export default RowSkeleton;
  

