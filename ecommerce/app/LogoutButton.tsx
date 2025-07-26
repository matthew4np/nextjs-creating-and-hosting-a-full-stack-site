"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Call the logout API endpoint we just created.
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      // Redirect to the login page and refresh the page to update the navbar.
      router.push("/login");
      router.refresh();
    } else {
      alert("Failed to logout. Please try again.");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}