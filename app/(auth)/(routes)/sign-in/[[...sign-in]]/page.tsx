import { SignIn } from "@clerk/nextjs";
import Image from "next/image"; // Import the Image component

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            alt="Authentication Banner"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            layout="fill" // Ensures the image fills the parent container
            objectFit="cover" // Ensures the image covers the entire area
            quality={80} // Adjust the quality as needed, default is 75
            priority // Loads the image with high priority
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <SignIn />
        </main>
      </div>
    </section>
  );
}

