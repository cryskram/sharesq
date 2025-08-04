"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { CgClose } from "react-icons/cg";
import { GoPlusCircle } from "react-icons/go";
import { useSession } from "next-auth/react";

const GET_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      email
    }
  }
`;

const CREATE_GROUP = gql`
  mutation CreateGroupWithMembers($name: String!, $userIds: [ID!]!) {
    createGroupWithMembers(name: $name, userIds: $userIds) {
      id
      name
    }
  }
`;

export default function CreateGroupModal() {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const { data, loading } = useQuery(GET_USERS);
  const [createGroup] = useMutation(CREATE_GROUP);

  const { data: session } = useSession();

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: any) =>
      user.id !== session?.user?.id &&
      !selectedUsers.find((u) => u.id === user.id) &&
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddUser = (user: any) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery("");
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) return;
    const userIds = selectedUsers.map((u) => u.id);

    await createGroup({ variables: { name: groupName, userIds } });

    setGroupName("");
    setSelectedUsers([]);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-3xl flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <GoPlusCircle />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-card w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
            >
              <CgClose />
            </button>

            <h2 className="text-xl font-semibold text-white">Create Group</h2>

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none"
            />

            <input
              type="text"
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none"
            />

            <ul className="max-h-32 overflow-y-auto space-y-2">
              {filteredUsers.map((user: any) => (
                <li
                  key={user.id}
                  onClick={() => handleAddUser(user)}
                  className="cursor-pointer bg-white/5 px-3 py-2 rounded-md hover:bg-white/10 text-white"
                >
                  {user.name} ({user.username || user.email})
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm"
                >
                  {user.name}
                </span>
              ))}
            </div>

            <button
              onClick={handleCreateGroup}
              className="w-full mt-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </>
  );
}
