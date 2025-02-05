import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[url('/images/bkground_1.png')] bg-cover bg-center">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать!</h1>
      <p className="text-lg mb-6">Выберите действие:</p>

      <div className="space-y-4">
        <Link
          href="/auth/signin"
          className="w-full
            lg:w-[293px]
            lg:h-auto
            text-center
            font-semibold
            uppercase
            mb-8
            p-4
            text-[20px]
            text-[#fffffe]
            bg-[#42484D] hover:bg-[#3742a3]
            duration-300
            block
            no-underline"
        >
          Войти
        </Link>
        <Link
          href="/auth/register"
          className="w-full
            lg:w-[293px]
            lg:h-auto
            text-center
            font-semibold
            uppercase
            mb-[57px]
            p-4
            text-[20px]
            text-[#fffffe]
           bg-[#42484D] hover:bg-[#3742a3]
            duration-300
            block
            no-underline"
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}
