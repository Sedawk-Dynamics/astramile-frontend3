"use client";
import { use } from "react";
import ResourceForm from "../../components/ResourceForm";
import { teamConfig } from "../../components/configs";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceForm config={teamConfig} id={id} />;
}
