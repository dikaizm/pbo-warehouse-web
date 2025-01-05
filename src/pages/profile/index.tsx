import { useEffect, useState } from "react";
import { Label, TextInput, Button, Card } from "flowbite-react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axios from "axios";
import { CONFIG } from "../../config";
import { useAuth } from "../../providers/auth-provider";

const ProfilePage = () => {
  const { token } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleProfileChange = (e: any) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileData(response.data.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/profile/update`,
        {
          name: profileData.name,
          newEmail: profileData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Profil berhasil diperbarui");
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    try {
      const response = await axios.put(
        `${CONFIG.API_URL}/profile/update`,
        { ...profileData, ...passwordData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Password berhasil diperbarui");
        setPasswordData({ password: "", confirmPassword: "" });
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex space-x-8">
          {/* Update Name and Email */}
          <Card className="w-96">
            <h1 className="mb-4 text-center text-2xl font-bold">
              Update Profil
            </h1>
            <form onSubmit={handleProfileSubmit}>
              {/* Name */}
              <div className="mb-4">
                <Label htmlFor="name" value="Nama" />
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 text-sm text-red-500">{error}</div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" color="primary">
                Update Profil
              </Button>
            </form>
          </Card>

          {/* Update Password */}
          <Card className="w-96">
            <h1 className="mb-4 text-center text-2xl font-bold">
              Update Password
            </h1>
            <form onSubmit={handlePasswordSubmit}>
              {/* Password */}
              <div className="mb-4">
                <Label htmlFor="password" value="Password Baru" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password baru"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <Label htmlFor="confirmPassword" value="Konfirmasi Password" />
                <TextInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Konfirmasi password baru"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 text-sm text-red-500">{error}</div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" color="primary">
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default ProfilePage;
