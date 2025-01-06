import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#202124] text-white">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
            <Link href="/">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Homepage
                </button>
            </Link>
        </div>
    );
}