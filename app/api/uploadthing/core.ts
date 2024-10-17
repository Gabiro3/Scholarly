import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

const f = createUploadthing();

const handle = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { user_id: userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handle())
    .onUploadComplete(() => {
      // Trigger success toast when upload completes
      toast.success('Image uploaded successfully!');
    }),

  messageFile: f(["image", "pdf"])
    .middleware(() => handle())
    .onUploadComplete(() => {
      // Trigger success toast when upload completes
      toast.success('File uploaded successfully!');
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
