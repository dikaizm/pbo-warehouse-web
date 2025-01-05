/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../providers/auth-provider";
import { CONFIG } from "../../config";
import axios from "axios";
import { ROUTES } from "../../const";

const SignUpPage: FC = function () {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registerKey, setRegisterKey] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${CONFIG.API_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
        registerKey,
      });

      // Save token to local storage
      login(response.data.data.token);

      // Redirect to dashboard
      navigate(ROUTES.HOME);
    } catch (error: any) {
      console.error(error.response.data);
      setError(error.response.data.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-12"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          GudangKu
        </span>
      </div>
      <Card
        horizontal
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Buat Akun Admin Gudang
        </h1>
        <form>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="name">Nama</Label>
            <TextInput
              id="name"
              name="name"
              placeholder="Budi"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Kata Sandi</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="confirmPassword">Ulangi Kata Sandi</Label>
            <TextInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="registerKey">Register Key</Label>
            <TextInput
              id="registerKey"
              name="registerKey"
              placeholder="••••••••"
              type="password"
              value={registerKey}
              onChange={(e) => setRegisterKey(e.target.value)}
            />
          </div>

          <div className="mb-7">
            <Button
              type="submit"
              className="w-full lg:w-auto"
              onClick={handleSubmit}
              color="primary"
            >
              Buat akun
            </Button>
            {error && (
              <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Sudah punya akun?&nbsp;
            <a
              href={ROUTES.AUTH.LOGIN}
              className="text-primary-600 dark:text-primary-200"
            >
              Masuk
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;
