import { currentProf } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile"; // Import initialProfile util

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}

const InviteCode = async ({ params }: InviteCodeProps) => {
  // Ensure the profile exists or create it if not
  let profile = await currentProf();

  if (!profile) {
    profile = await initialProfile();  // Create the profile if it doesn't exist
  }

  if (!profile) {
    return redirect("/"); // If profile creation still failed, redirect to home
  }

  if (!params.inviteCode) {
    return redirect("/"); // If invite code is missing, redirect to home
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
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCode;

