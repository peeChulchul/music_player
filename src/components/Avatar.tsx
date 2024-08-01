import React from "react";

interface IavaterProps {
  src?: string | null;
}

const Avatar = ({ src }: IavaterProps) => {
  return (
    <img
      src={
        src
          ? `${src}?${Math.random()}`
          : "https://smydpnzfrremvfutiaro.supabase.co/storage/v1/object/public/image/default/default_avatar.png"
      }
      className="rounded-full object-cover"
      draggable={false}
    />
  );
};

export default Avatar;
