import {
  Building2,
  Check,
  KeyRound,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FacilityRetrieve } from "@/types/facility";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SASTUserRetrieve } from "@/types/sast_user";
import { User } from "@/types/user";
import Autocomplete from "@/components/ui/autocomplete";
import { apis } from "@/apis";
import { cn, toast } from "@/lib/utils";
import { useMemo, useState } from "react";

interface ManageSastHospitalProps {
  facility: FacilityRetrieve;
  className?: string;
}

export default function ManageSastHospital({
  facility,
  className,
}: ManageSastHospitalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: hospital, isLoading: isHospitalLoading } = useQuery({
    queryKey: ["sast-hospital", facility.id],
    queryFn: () => apis.sastHospital.get(facility.id),
    enabled: !!facility.id,
    retry: false,
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "cursor-pointer font-semibold border border-gray-400",
            className
          )}
          loading={isHospitalLoading}
        >
          {hospital ? (
            <Settings className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {hospital ? "Manage SAST Hospital" : "Create SAST Hospital"}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-xl p-0 gap-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary-600" />
            SAST Hospital Management
          </SheetTitle>
          <SheetDescription>
            Map this facility to a SAST hospital and manage its gateway users.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isHospitalLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500" />
              <span className="ml-2 text-sm">
                Loading SAST hospital information...
              </span>
            </div>
          ) : hospital ? (
            <div className="space-y-8">
              <HospitalCodeSection
                facilityId={facility.id}
                hospitalId={hospital.id}
                currentCode={hospital.code}
              />
              <ManageSastUsers facility={facility} hospitalId={hospital.id} />
            </div>
          ) : (
            <CreateHospitalSection facilityId={facility.id} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface CreateHospitalSectionProps {
  facilityId: string;
}

function CreateHospitalSection({ facilityId }: CreateHospitalSectionProps) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");

  const createHospitalMutation = useMutation({
    mutationFn: () => apis.sastHospital.create({ code, facility: facilityId }),
    onSuccess: () => {
      toast.success("SAST hospital created successfully");
      setCode("");
      queryClient.invalidateQueries({
        queryKey: ["sast-hospital", facilityId],
      });
    },
  });

  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
        <Building2 className="h-6 w-6 text-primary-600" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900">No SAST Hospital Mapped</h3>
        <p className="text-sm text-gray-500">
          Map this facility to a SAST hospital code to start configuring users.
        </p>
      </div>
      <div className="space-y-2 text-left">
        <Label htmlFor="new-hospital-code">Hospital Code</Label>
        <Input
          id="new-hospital-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter hospital code"
        />
      </div>
      <Button
        onClick={() => createHospitalMutation.mutate()}
        disabled={createHospitalMutation.isPending || !code}
        loading={createHospitalMutation.isPending}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create SAST Hospital
      </Button>
    </div>
  );
}

interface HospitalCodeSectionProps {
  facilityId: string;
  hospitalId: string;
  currentCode: string;
}

function HospitalCodeSection({
  facilityId,
  hospitalId,
  currentCode,
}: HospitalCodeSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(currentCode);

  const updateHospitalMutation = useMutation({
    mutationFn: () => apis.sastHospital.update(hospitalId, { code }),
    onSuccess: () => {
      toast.success("SAST hospital updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["sast-hospital", facilityId],
      });
    },
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          Hospital
        </h3>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Mapped
        </Badge>
      </div>

      <div className="rounded-lg border bg-gray-50 p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="hospital-code">Hospital Code</Label>
              <Input
                id="hospital-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter hospital code"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => updateHospitalMutation.mutate()}
                disabled={updateHospitalMutation.isPending || !code}
                loading={updateHospitalMutation.isPending}
                size="sm"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCode(currentCode);
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Hospital Code</p>
              <p className="font-medium text-gray-900">{currentCode}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

interface ManageSastUsersProps {
  facility: FacilityRetrieve;
  hospitalId: string;
}

function ManageSastUsers({ facility, hospitalId }: ManageSastUsersProps) {
  const [isAdding, setIsAdding] = useState(false);

  const { data: sastUsers, isLoading: isSastUsersLoading } = useQuery({
    queryKey: ["sast-users", hospitalId],
    queryFn: () => apis.sastUser.list({ hospital: hospitalId }),
    enabled: !!hospitalId,
  });

  const { data: facilityUsers } = useQuery({
    queryKey: ["facility-users", facility.id],
    queryFn: () => apis.user.facilityUsers(facility.id),
    enabled: !!facility.id,
  });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-gray-500" />
          SAST Users
          {!!sastUsers?.count && (
            <Badge variant="secondary">{sastUsers.count}</Badge>
          )}
        </h3>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add User
          </Button>
        )}
      </div>

      {isAdding && (
        <AddSastUserForm
          hospitalId={hospitalId}
          facilityId={facility.id}
          onDone={() => setIsAdding(false)}
        />
      )}

      {isSastUsersLoading ? (
        <div className="text-sm text-gray-500 py-4">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {sastUsers?.count === 0 && !isAdding && (
            <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
              No SAST users configured for this hospital yet.
            </div>
          )}

          {sastUsers?.results?.map((sastUser: SASTUserRetrieve) => (
            <SastUserCard
              key={sastUser.id}
              sastUser={sastUser}
              hospitalId={hospitalId}
              careUser={facilityUsers?.results?.find(
                (user) => user.id === sastUser.user
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface AddSastUserFormProps {
  hospitalId: string;
  facilityId: string;
  onDone: () => void;
}

function formatCareUserLabel(user: User) {
  const name = `${user.first_name} ${user.last_name}`.trim();
  return name ? `${name} (@${user.username})` : `@${user.username}`;
}

function AddSastUserForm({
  hospitalId,
  facilityId,
  onDone,
}: AddSastUserFormProps) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const { data: facilityUsers } = useQuery({
    queryKey: ["facility-users", facilityId, userSearch],
    queryFn: () =>
      apis.user.facilityUsers(facilityId, {
        search_text: userSearch || undefined,
      }),
    enabled: !!facilityId,
  });

  const careUserOptions = useMemo(
    () =>
      facilityUsers?.results?.map((user) => ({
        value: user.id,
        label: formatCareUserLabel(user),
      })) ?? [],
    [facilityUsers]
  );

  const createUserMutation = useMutation({
    mutationFn: () =>
      apis.sastUser.create({
        hospital: hospitalId,
        user: selectedUser,
        user_id: userId,
        password,
      }),
    onSuccess: () => {
      toast.success("SAST user created successfully");
      queryClient.invalidateQueries({ queryKey: ["sast-users", hospitalId] });
      onDone();
    },
  });

  return (
    <div className="rounded-lg border bg-primary-50/40 p-4 space-y-4">
      <p className="text-sm font-medium text-gray-900">Add SAST User</p>

      <div className="space-y-1.5">
        <Label htmlFor="sast-user">CARE User</Label>
        <Autocomplete
          options={careUserOptions}
          value={selectedUser}
          onChange={setSelectedUser}
          onSearch={setUserSearch}
          placeholder="Select a user"
          noOptionsMessage="No users found"
          popoverClassName="bg-white"
          data-cy="sast-user-select"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sast-user-id">User ID</Label>
          <Input
            id="sast-user-id"
            className="bg-white"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Gateway login id"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sast-password">Password</Label>
          <Input
            id="sast-password"
            type="password"
            className="bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Gateway password"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => createUserMutation.mutate()}
          disabled={
            createUserMutation.isPending ||
            !selectedUser ||
            !userId ||
            !password
          }
          loading={createUserMutation.isPending}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add User
        </Button>
        <Button variant="ghost" size="sm" onClick={onDone}>
          <X className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface SastUserCardProps {
  sastUser: SASTUserRetrieve;
  hospitalId: string;
  careUser?: User;
}

function SastUserCard({ sastUser, hospitalId, careUser }: SastUserCardProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userId, setUserId] = useState(sastUser.user_id);
  const [password, setPassword] = useState("");

  const updateUserMutation = useMutation({
    mutationFn: () =>
      apis.sastUser.update(sastUser.id, { user_id: userId, password }),
    onSuccess: () => {
      toast.success("SAST user updated successfully");
      setPassword("");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["sast-users", hospitalId] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => apis.sastUser.delete(sastUser.id),
    onSuccess: () => {
      toast.success("SAST user removed successfully");
      setIsDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sast-users", hospitalId] });
    },
  });

  const displayName = careUser
    ? `${careUser.first_name} ${careUser.last_name}`.trim()
    : "CARE user";

  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <UserIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {careUser ? `@${careUser.username}` : sastUser.user}
              {careUser && (
                <span className="ml-1.5 capitalize">
                  · {careUser.user_type}
                </span>
              )}
            </p>
          </div>
        </div>
        {!isEditing && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setIsDeleteOpen(true)}
              aria-label="Remove SAST user"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 border-t pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`user-id-${sastUser.id}`}>User ID</Label>
              <Input
                id={`user-id-${sastUser.id}`}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Gateway login id"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`password-${sastUser.id}`}>Password</Label>
              <Input
                id={`password-${sastUser.id}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New gateway password"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => updateUserMutation.mutate()}
              disabled={updateUserMutation.isPending || !userId || !password}
              loading={updateUserMutation.isPending}
              size="sm"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserId(sastUser.user_id);
                setPassword("");
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t pt-3 text-xs text-gray-500">
          <KeyRound className="h-3.5 w-3.5" />
          <span>
            Gateway ID:{" "}
            <span className="text-gray-700">{sastUser.user_id}</span>
          </span>
        </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove SAST User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the SAST user for{" "}
              <span className="font-medium text-gray-900">{displayName}</span>?
              This will revoke their gateway login for this hospital. You can
              re-create it later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate()}
              loading={deleteUserMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
