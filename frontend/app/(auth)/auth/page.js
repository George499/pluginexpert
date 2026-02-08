import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[url('/images/bkground_1.png')] bg-cover bg-fixed bg-center px-4">
      <div className="w-[51px] h-[12px] mb-6 bg-white"></div>
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white uppercase tracking-wide">
        Добро пожаловать
      </h1>
      <p className="text-lg mb-10 text-gray-300">Выберите действие:</p>

      <div className="space-y-4 w-full max-w-xs">
        <Link
          href="/auth/signin"
          className="block w-full text-center font-semibold uppercase p-4 text-[18px] text-white bg-[#42484D] hover:bg-[#3742a3] duration-300 tracking-wider"
        >
          Войти
        </Link>
        <Link
          href="/auth/register"
          className="block w-full text-center font-semibold uppercase p-4 text-[18px] text-white bg-[#42484D] hover:bg-[#3742a3] duration-300 tracking-wider"
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}
