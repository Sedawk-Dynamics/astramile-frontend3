"use client";
import { use } from "react";
import ResourceForm from "../../components/ResourceForm";
import { rocketsConfig } from "../../components/configs";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ResourceForm config={rocketsConfig} id={id} />;
}
