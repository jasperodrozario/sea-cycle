"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CreateUserForm from "@/components/forms/CreateUserForm";

const useUser = () => ({ role: "Admin" }); // MOCK:To be replaced with real user auth hook

export default function UserManagementPage() {
  const { role } = useUser();
  const [users, setUsers] = useState([]);
  const [key, setKey] = useState(0); // Used to force re-render of user list

  useEffect(() => {
    // Fetch users logic to be implemented here later
  }, [key]);

  // Protected route logic
  if (role !== "Admin") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebf8fe] navbar-offset py-10">
      <main className="container-main">
        <header className="mb-10 mt-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="hover:text-cyan-400">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-cyan-500 hover:text-cyan-400">
                  Admin
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-cyan-500 hover:text-cyan-400">
                  Users
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            User Management
          </h1>
          <p className="text-gray-500">Create new users and assign roles.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CreateUserForm onUserCreated={() => setKey((k) => k + 1)} />
          </div>
          <div>
            {/* List of users will be displayed here later */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Existing Users</h3>
              <p className="text-sm text-gray-500">
                A table of all users would go here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
