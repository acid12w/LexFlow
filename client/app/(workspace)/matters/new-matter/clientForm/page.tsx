"use client";

import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetAllClients } from "@/hooks/useClientHook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { getInitials } from "@/lib/utils-helper";
import { Check } from "lucide-react";
import NewClientForm from "@/app/(workspace)/clients/newClientForm";

export interface Client {
  _id: string;
  firstName: string;
  lastName?: string;
  refrenceNumber: string;
}

export interface ActiveClientState {
  id: string;
  firstName: string;
  lastName: string;
  refrenceNumber: string;
  selectedClientId: string;
}

interface ClientFormProps {
  handleSelect: Dispatch<SetStateAction<ActiveClientState>>;
  selectedClientId?: string;
}

export default function ClientForm({
  handleSelect,
  selectedClientId,
}: ClientFormProps) {
  const {
    data: clientResponse,
    isLoading,
    isError,
    error,
  } = useGetAllClients();
  const [activeClientId, setActiveClientId] = useState<string | null>(
    selectedClientId ?? null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Extract client list safely
  const clients: Client[] = useMemo(() => {
    return clientResponse?.data?.data ?? clientResponse?.data ?? [];
  }, [clientResponse]);

  // Client-side search filtering
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(query) ||
        client.lastName?.toLowerCase().includes(query) ||
        client.refrenceNumber.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const onSelectClient = (id: string, firstName: string, lastName?: string) => {
    setActiveClientId(id);
    handleSelect((prev) => ({
      ...prev,
      selectedClientId: id,
      firstName,
      lastName: lastName ?? "", // ensure lastName is a string
    }));
  };

  // Helper for Avatar Fallback Initials

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error fetching clients</AlertTitle>
        <AlertDescription>
          {error?.message ?? "Failed to load client list."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold tracking-tight">Select a client</h3>
      <div className="border border-border rounded-2xl p-4 bg-card">
        <Field orientation="horizontal" className="mb-4">
          <Input
            type="search"
            placeholder="Search by name or reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Field>

        <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
          {filteredClients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No clients found.
            </p>
          ) : (
            filteredClients.map((client) => {
              const isSelected = activeClientId === client._id;

              return (
                <button
                  type="button"
                  key={client._id}
                  onClick={() =>
                    onSelectClient(
                      client._id,
                      client.firstName,
                      client.lastName
                    )
                  }
                  className={cn(
                    "w-full text-left flex justify-between items-center p-3 rounded-xl transition-all duration-150 border border-transparent hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected && "bg-primary/10 border-primary font-medium"
                  )}
                >
                  <div className="flex justify-center">
                    <Avatar className="mr-4 h-10 w-10 shrink-0">
                      {/* {client.avatarUrl && (
                        <AvatarImage
                          src={client.avatarUrl}
                          alt={client.firstName}
                        />
                      )} */}
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                        {getInitials(client.firstName, client.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {client.firstName} {client.lastName ?? ""}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Ref: {client.refrenceNumber}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="bg-[#0088FF] p-1 text-white rounded-full" />
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="border-t py-2">
          <NewClientForm />
        </div>
      </div>
    </div>
  );
}
