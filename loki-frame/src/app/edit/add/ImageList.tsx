import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ImagePreview from "../components/ImagePreview";
import {
  CSSProperties,
  Dispatch,
  FC,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useTransition,
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
  let listRef = useRef<List>(null);

  useEffect(() => {
    setTimeout(() => setShowPhotos(true), 300);
  }, []);

  useEffect(() => {
    let list = listRef.current
    if (currentIndex > furthest) {
      setFurthest(currentIndex);
      return () => {
        list?.scrollToItem(currentIndex + 1, "end");
      }
    }
  }, [currentIndex, furthest]);

  if (!showPhotos) {
    return null;
  }
  return (
    <AutoSizer>
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
          ref={listRef}
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

const innerElementType = forwardRef<any, any>(function InnerElementType(
  { style, ...rest },
  ref
) {
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
