"use client";
import { use } from "react";
import ResourceForm from "../../components/ResourceForm";
import { statsConfig } from "../../components/configs";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceForm config={statsConfig} id={id} />;
}
