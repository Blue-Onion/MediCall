import React from "react";
import VideoCall from "./_components/videoCall";

const page = async ({ searchParams }) => {
  const { token, sessionId } = await searchParams;
  return (
    <div>
      <VideoCall token={token} sessionId={sessionId} />
    </div>
  );
};

export default page;
