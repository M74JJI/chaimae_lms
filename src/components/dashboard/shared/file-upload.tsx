"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import PlaceholderImg from "@/public/assets/images/img-placeholder.jpg";
import { detectCloudinaryAssetType } from "@/lib/common.utils";

interface Props {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
  error?: boolean;
  title?: string;
  description?: string;
}

const MediaUpload: FC<Props> = ({
  disabled,
  onChange,
  onRemove,
  value,
  title,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [resourceType, setResourceType] = useState<"image" | "video" | null>(
    null
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = (result: any) => {
    setResourceType(result.info.resource_type);
    onChange(result.info.secure_url);
  };
  const assetType = detectCloudinaryAssetType(value);
  return (
    <div className="space-y-2">
      {title && (
        <div>
          <h1>{title}</h1>
        </div>
      )}
      <div className="flex gap-x-4">
        <div className="mb-4 flex items-center gap-4">
          {value.length > 0 ? (
            <div key={value} className="relative">
              <div className="z-10 absolute top-3 right-1.5">
                <Button
                  onClick={() => {
                    setResourceType(null);
                    onRemove(value);
                  }}
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="rounded-full hover:!bg-red-400"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              {assetType === "video" ? (
                <video
                  src={value}
                  width={300}
                  height={200}
                  controls
                  className="object-cover rounded-md min-w-[340px] max-w-[340px] h-52"
                />
              ) : (
                <Image
                  width={300}
                  height={200}
                  className="object-cover rounded-md min-w-[340px] max-w-[340px] h-52"
                  alt="Uploaded Media"
                  src={value}
                />
              )}
            </div>
          ) : (
            <div>
              <Image
                src={PlaceholderImg}
                alt="Placeholder"
                width={300}
                height={200}
                className="object-cover rounded-md min-w-[340px] max-w-[340px] h-52"
              />
            </div>
          )}
        </div>
        <div>
          <p>{description}</p>
          <CldUploadWidget onSuccess={onUpload} uploadPreset="ufb48euh">
            {({ open }) => {
              const onClick = () => open();
              return (
                <button
                  type="button"
                  className="flex items-center font-medium text-[17px] h-10 mt-4 px-3 text-white bg-gradient-to-t from-blue-400 to-blue-300 hover:to-blue-400 border-none shadow-lg rounded-md hover:shadow-md active:shadow-sm cursor-pointer"
                  disabled={disabled}
                  onClick={onClick}
                >
                  <svg
                    viewBox="0 0 640 512"
                    fill="white"
                    height="1em"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                  </svg>
                  <span>{value ? "Update" : "Upload"} Media</span>
                </button>
              );
            }}
          </CldUploadWidget>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
