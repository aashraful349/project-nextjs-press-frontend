import React from "react";

const NewsPageById =async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const {id} = await params;
  return <div>NewsPage {id}</div>;
};

export default NewsPageById;
