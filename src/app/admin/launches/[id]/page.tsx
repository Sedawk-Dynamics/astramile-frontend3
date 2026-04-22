"use client";
import { use } from "react";
import ResourceForm from "../../components/ResourceForm";
import { launchesConfig } from "../../components/configs";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceForm config={launchesConfig} id={id} />;
}
