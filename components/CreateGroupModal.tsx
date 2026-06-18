"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CgClose } from "react-icons/cg";
import { GoPlusCircle } from "react-icons/go";
import { useSession } from "next-auth/react";

import { CREATE_GROUP_WITH_MEMBERS, USERS_QUERY } from "@/lib/queries";

export default function CreateGroupModal() {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const { data } = useQuery(USERS_QUERY);
  const [createGroup, { loading: creatingGroup }] = useMutation(
    CREATE_GROUP_WITH_MEMBERS,
  );
  const { data: session } = useSession();

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: any) =>
      user.id !== session?.user?.id &&
      !selectedUsers.find((u) => u.id === user.id) &&
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleAddUser = (user: any) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0 || creatingGroup) {
      return;
    }

    try {
      const userIds = selectedUsers.map((u) => u.id);

      await createGroup({
        variables: {
          name: groupName,
          userIds,
        },
      });

      setGroupName("");
      setSearchQuery("");
      setSelectedUsers([]);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed right-8 bottom-8 z-50 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-[0_0_20px_rgba(167,139,250,0.4)] transition-all hover:scale-105"
      >
        <GoPlusCircle size={28} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="glass-card relative w-full max-w-xl p-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03] transition-all hover:border-white/[0.12]"
            >
              <CgClose />
            </button>

            <div className="mb-6">
              <p className="text-xs tracking-widest text-zinc-500 uppercase">
                ShareSq
              </p>

              <h2 className="mt-2 text-3xl font-bold">Create Group</h2>

              <p className="mt-2 text-zinc-500">
                Add friends and start splitting expenses.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input-dark"
              />

              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark"
              />

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleRemoveUser(user.id)}
                      className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-violet-300 transition-all hover:bg-violet-500/20"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-xs font-semibold">
                        {user.name?.[0]}
                      </div>

                      <span>{user.name}</span>

                      <span>×</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredUsers.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddUser(user)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] font-semibold">
                        {user.name?.[0]}
                      </div>

                      <div className="text-left">
                        <p className="font-medium">{user.name}</p>

                        <p className="text-xs text-zinc-500">
                          {user.username || user.email}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-violet-400">Add</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={
                  creatingGroup ||
                  !groupName.trim() ||
                  selectedUsers.length === 0
                }
                className="w-full rounded-2xl bg-violet-500 py-3 font-medium text-white transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingGroup ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Group...
                  </span>
                ) : (
                  "Create Group"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
