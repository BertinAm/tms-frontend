import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-full max-w-[410px] rounded-lg bg-white p-6 text-center dark:bg-gray-800">
          <div className="w-full">
            <div className="mb-8 flex justify-center">
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={176}
                height={32}
              />
            </div>
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/illustration/404.svg"
                alt="404"
                width={400}
                height={400}
              />
            </div>
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-[50px] font-bold leading-none text-gray-900 dark:text-white lg:text-[80px]">
                404
              </h1>
              <h4 className="mb-3 text-[22px] font-semibold leading-tight text-gray-900 dark:text-white lg:text-[26px]">
                Oops! That page can't be found
              </h4>
              <p className="text-base text-gray-600 dark:text-gray-400">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary-500 py-4 px-10 text-center font-medium text-white hover:bg-primary-600 lg:px-8 xl:px-10"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 z-[-1] h-auto w-full">
        <svg
          className="w-full"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 32L48 37.3C96 43 192 53 288 90.7C384 128 480 192 576 197.3C672 203 768 149 864 133.3C960 117 1056 139 1152 154.7C1248 171 1344 181 1392 186.7L1440 192V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V32Z"
            fill="#3B82F6"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[-1] h-auto w-full">
        <div className="flex items-center justify-center pb-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} - TMS
          </p>
        </div>
      </div>
    </>
  );
}
