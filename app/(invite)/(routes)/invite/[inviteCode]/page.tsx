import { currentProf } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast"

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCode = async ({ params }: InviteCodeProps) => {
  const profile = await currentProf();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    toast.error("Could not find invite code!")
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (server) {
    toast.success("Hooray! You joined this server. Happy Learning!")
    return redirect("/servers/" + server.id);
  }

  return null;
};

export default InviteCode;
