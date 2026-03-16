import { useAdminVendors } from "@/hooks/useAdmin";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminVendors = () => {
  const { data: vendors, isLoading } = useAdminVendors();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Vendors</h1>
      <div className="rounded-lg border border-border bg-card shadow-ink">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : vendors?.length ? vendors.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={v.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {(v.display_name || "V")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{v.display_name || "Unnamed"}</span>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{v.product_count}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No vendors yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminVendors;
