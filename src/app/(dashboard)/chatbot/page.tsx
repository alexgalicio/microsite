import FileUpload from "@/components/chatbot/file-upload";
import { columns } from "@/components/chatbot/table/columns";
import { DataTable } from "@/components/chatbot/table/data-table";
import { getTableData } from "@/lib/actions/chatbot";

export default async function Page() {
  const { data, error } = await getTableData();

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Chatbot Table</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Chatbot</h2>
      
      <FileUpload />

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12 mt-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
