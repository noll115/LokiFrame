import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ImagePreview from "../components/ImagePreview";
import {
  CSSProperties,
  Dispatch,
  FC,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";
import { PhotoData } from "./page";

let PADDING_SIZE = 4;

interface Props {
  currentIndex: number;
  setCurrentIndex: Dispatch<number>;
  images: PhotoData[];
}

const ImageList: FC<Props> = ({ currentIndex, setCurrentIndex, images }) => {
  let [showPhotos, setShowPhotos] = useState(false);
  let [furthest, setFurthest] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowPhotos(true), 300);
  }, []);

  useEffect(() => {
    if (currentIndex > furthest) {
      setFurthest(currentIndex);
    }
  }, [currentIndex <= furthest]);

  if (!showPhotos) {
    return null;
  }
  return (
    <AutoSizer className="size-full">
      {({ height, width }) => (
        <List
          itemCount={furthest + 1}
          innerElementType={innerElementType}
          itemSize={width / 3.9}
          height={height}
          width={width}
          itemData={{
            setCurrentIndex,
            currentIndex,
            images,
          }}
          layout="horizontal"
        >
          {ImageSelect}
        </List>
      )}
    </AutoSizer>
  );
};

interface ImageSelectProps {
  data: {
    setCurrentIndex: Dispatch<number>;
    images: PhotoData[];
    currentIndex: number;
  };
  style: CSSProperties;
  index: number;
}

const ImageSelect: FC<ImageSelectProps> = ({ style, index, data }) => {
  let { setCurrentIndex, images, currentIndex } = data;
  let onImageClick = () => {
    setCurrentIndex(index);
  };
  let image = images[index];
  return (
    <ImageSelector
      style={style}
      selected={index === currentIndex}
      key={image.file.name}
      photoData={image}
      onClick={onImageClick}
    />
  );
};

const innerElementType = forwardRef<any, any>(({ style, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        paddingLeft: PADDING_SIZE,
      }}
      {...rest}
    />
  );
});

interface IDProps {
  photoData: PhotoData;
  onClick: (photoData: PhotoData) => void;
  style: any;
  selected: boolean;
}
const ImageSelector: FC<IDProps> = ({
  photoData,
  onClick,
  style,
  selected,
}) => {
  const onImageClick = () => {
    onClick(photoData);
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        ...style,
        left: style.left + PADDING_SIZE,
        width: style.width - PADDING_SIZE,
      }}
      onClick={!selected ? onImageClick : undefined}
    >
      <ImagePreview imageUrl={photoData.dataUrl} />
    </div>
  );
};

export default ImageList;
