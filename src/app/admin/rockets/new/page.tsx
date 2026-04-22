"use client";
import ResourceForm from "../../components/ResourceForm";
import { rocketsConfig } from "../../components/configs";

export default function Page() {
  return <ResourceForm config={rocketsConfig} />;
}
