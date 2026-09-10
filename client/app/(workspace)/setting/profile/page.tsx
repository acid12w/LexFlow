"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input"; // Replaced raw inputs with Shadcn Inputs
import { Label } from "@/components/ui/label";

import image1 from "@/public/Avatar-bg.png";
import avatarPic from "@/public/avatar-pic.jpg";
import Image from "next/image";
import { Pencil, X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { InputTags } from "@/features/inputTag/tagInput";
import { useUserCredentials } from "@/app/store/user-store";
import { useUpdateFirmMember } from "@/hooks/useAuthHook";

// import { useUpdateUser } from "@/hooks/useAuthHook";

const Profile = () => {
  const userData = useUserCredentials((state) => state?.user);

  const { mutateAsync } = useUpdateFirmMember();

  // 1. Core Visibility Toggles
  const [isEditToggle, setIsEditToggle] = useState({
    personal: false,
    practice: false,
    billing: false,
  });

  const handleIsEditToggle = (section: "personal" | "practice" | "billing") => {
    setIsEditToggle((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [personalData, setPersonalData] = useState({
    userName: "",
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (!userData || !userData.profile) return;

    setPersonalData({
      userName: userData.userName ?? "",
      role: userData.role ?? "",
      firstName: userData.profile.firstName ?? "",
      lastName: userData.profile.lastName ?? "",
      email: userData.profile.email ?? "",
      phone: userData.profile.phone ?? "",
    });

    setValues(userData?.profile?.practiceAreas);
  }, [userData]);

  const [billingData, setBillingData] = useState({
    defaultHourlyRate: "",
  });

  // 3. Isolated Form Submission Handlers
  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Payload contains strictly personal data keys
    const payload = {
      userName: personalData.userName,
      profile: {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone,
      },
    };

    const hasChanged =
      payload.userName !== userData.userName ||
      payload.profile.firstName !== userData?.profile?.firstName ||
      payload.profile.lastName !== userData?.profile?.lastName ||
      payload.profile.email !== userData?.profile?.email ||
      payload.profile.phone !== userData?.profile?.phone;

    if (!hasChanged) {
      handleIsEditToggle("personal");
      return;
    }

    mutateAsync(payload);
    // await fetch('/api/users/profile', { method: 'PATCH', body: JSON.stringify(payload) })

    handleIsEditToggle("personal"); // Lock fields back up on success
  };

  const handleUpdatePractice = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...userData,
      profile: {
        practiceAreas: values,
      },
    };

    try {
      await mutateAsync(payload);
      handleIsEditToggle("practice");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      billing: { defaultHourlyRate: Number(billingData.defaultHourlyRate) },
    };
    mutateAsync(payload);
    handleIsEditToggle("billing");
  };

  return (
    <div className="w-2/3 p-4 flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Portfolio Page</h1>
      </div>

      {/* Header Banner Block */}
      <div
        className="w-full h-32 p-5 rounded-2xl flex items-center justify-center bg-cover bg-center bg-no-repeat border-gray-200 border relative"
        style={{ backgroundImage: `url(${image1.src})` }}
      >
        <div className="absolute -bottom-8 left-6">
          {/* <Image
            src={avatarPic}
            alt="Profile picture"
            className="rounded-full aspect-square object-cover border-4 border-white shadow-sm"
            width={80}
            height={80}
          /> */}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-y-6">
        {/* ==================== FORM 1: PERSONAL INFORMATION ==================== */}
        <form
          onSubmit={handleUpdatePersonal}
          className="w-full h-max p-5 rounded-2xl flex flex-col gap-y-4 bg-white border-gray-200 border shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl text-slate-800">
              Personal Information
            </h4>
            {isEditToggle.personal ? (
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleIsEditToggle("personal")}
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="bg-[#0088FF] hover:bg-[#0088FF]/90"
                >
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleIsEditToggle("personal")}
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-400">Username</Label>
              {isEditToggle.personal ? (
                <Input
                  value={personalData.userName}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="font-medium text-slate-900 px-1">
                  {typeof userData.userName === "string" ||
                  typeof userData.userName === "number"
                    ? userData.userName
                    : "No data available"}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">Role</Label>
              {/* Role is locked/disabled even in edit mode unless actor is an Admin */}
              <Input
                value={personalData.role}
                disabled
                className="bg-slate-50 text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">First Name</Label>
              {isEditToggle.personal ? (
                <Input
                  value={personalData.firstName}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="font-medium text-slate-900 px-1">
                  {typeof userData?.profile?.firstName === "string" ||
                  typeof userData?.profile?.firstName === "number"
                    ? userData?.profile?.firstName
                    : "No data available"}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">Last Name</Label>
              {isEditToggle.personal ? (
                <Input
                  value={personalData.lastName}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="font-medium text-slate-900 px-1">
                  {userData.profile?.lastName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">Email</Label>
              {isEditToggle.personal ? (
                <Input
                  type="email"
                  value={personalData.email}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="font-medium text-slate-900 px-1">
                  {userData.profile?.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-gray-400">Phone Number</Label>
              {isEditToggle.personal ? (
                <Input
                  value={personalData.phone}
                  onChange={(e) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="font-medium text-slate-900 px-1">
                  {userData.profile?.phone}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* ==================== FORM 2: PRACTICE DETAILS ==================== */}
        <form
          onSubmit={handleUpdatePractice}
          className="w-full h-max p-5 rounded-2xl flex flex-col gap-y-4 bg-slate-50 border-gray-200 border shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl text-slate-800">
              Practice Details
            </h4>
            {isEditToggle.practice ? (
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleIsEditToggle("practice")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#0088FF] hover:bg-[#0088FF]/90"
                >
                  Save Scope
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleIsEditToggle("practice")}
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit Scope
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="text-gray-400">
              Assigned Practice Focus Areas
            </Label>
            <InputTags
              value={values}
              onChange={setValues}
              placeholder="Enter values, comma separated..."
              className="max-w-[500px] bg-white"
              // Pass a custom disabled prop to your tag input if it supports it
            />
          </div>
        </form>

        {/* ==================== FORM 3: BILLING CONFIGURATIONS ==================== */}
        <form
          onSubmit={handleUpdateBilling}
          className="w-full h-max p-5 rounded-2xl flex flex-col gap-y-4 bg-white border-gray-200 border shadow-sm"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-xl text-slate-800">
              Billing parameters
            </h4>
            {isEditToggle.billing ? (
              <div className="flex gap-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleIsEditToggle("billing")}
                >
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="bg-[#0088FF] hover:bg-[#0088FF]/90"
                >
                  <Save className="w-4 h-4 mr-1" /> Save Rates
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleIsEditToggle("billing")}
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit Rates
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-400">Default Hourly Rate (USD)</Label>
              {isEditToggle.billing ? (
                <div className="relative max-w-[200px]">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7"
                    value={billingData.defaultHourlyRate}
                    onChange={(e) =>
                      setBillingData({ defaultHourlyRate: e.target.value })
                    }
                  />
                </div>
              ) : (
                <p className="font-semibold px-1">
                  ${userData.billing?.defaultHourlyRate}/hr
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
