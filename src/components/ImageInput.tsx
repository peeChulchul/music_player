import React, { useEffect, useRef, useState } from "react";

interface IimageInput {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  imagePreview: string;
  setImagePreview?: React.Dispatch<React.SetStateAction<string>>;
}

function ImageInput({ imagePreview, setFile, setImagePreview }: IimageInput) {
  const [preview, setPreview] = useState<string>(() => {
    if (imagePreview.startsWith("data:image")) {
      return `${imagePreview}`;
    } else if (imagePreview.startsWith("https://")) {
      return `${imagePreview}?${Math.random()}`;
    }
    return imagePreview;
  });

  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    refreshImage();
  }, []);

  const refreshImage = () => {
    if (imageRef.current) {
      const originalSrc = imageRef.current.src;
      imageRef.current.src = "";
      setTimeout(() => {
        imageRef.current!.src = originalSrc;
      }, 0);
    }
  };

  useEffect(() => {
    setPreview(imagePreview);
  }, [imagePreview]);

  const ImageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreview = reader.result as string;
        setPreview(newPreview);
        setImagePreview?.(newPreview);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <button className="relative rounded-full border w-full h-full overflow-hidden">
      <input
        type="file"
        accept="image/*"
        className="absolute z-0 inset-0 opacity-0 cursor-pointer"
        onChange={ImageChangeHandler}
      />
      <img
        ref={imageRef}
        src={preview as string}
        className="rounded-full z-0 object-cover"
        draggable={false}
      />
    </button>
  );
}

export default ImageInput;
