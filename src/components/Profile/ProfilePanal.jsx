import React from "react";
import { FiEdit2 } from "react-icons/fi";
import Card from "./Card";
import SectionTitle from "./SectionTitle";
import Field from "./Field";

export default function ProfilePanel({ tab, setTab }) {
  return (
    <Card>
      <SectionTitle
        action={
          <button onClick={() => setTab("edit")} className="inline-flex items-center gap-2 rounded-full bg-primary p-2 hover:bg-primary/70">
            <FiEdit2 className="h-4 w-4 text-white" />
          </button>
        }
      >
        Personal Info
      </SectionTitle>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Name :">
          <input disabled className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethan sage" />
        </Field>
        <Field label="Email :">
          <input disabled className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethansage123@gmail.com" />
        </Field>
        <Field label="Password :">
          <input disabled type="password" className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="Ethansage123@gmail.com" />
        </Field>
        <Field label="Username :">
          <input disabled className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="ethansage444" />
        </Field>
        <Field label="Date Of Birth :">
          <input disabled className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="27-08-2025" />
        </Field>
        <Field label="Phone Number :">
          <input disabled className="Input border-[1px] bg-[#fff] rounded-[10px] w-full border-primary/20 px-4 py-3" defaultValue="+974 2345 456" />
        </Field>
      </div>
    </Card>
  );
}
