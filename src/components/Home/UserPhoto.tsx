import { Image, IImageProps } from "native-base";

type UserPhotoProps = IImageProps & {
  size: number;
};

export function UserPhoto({ size, ...rest }: UserPhotoProps) {
  return (
    <Image
      w={size}
      h={size}
      rounded={"full"}
      borderWidth={1}
      borderColor={"gray.400"}
      {...rest}
    />
  );
}
