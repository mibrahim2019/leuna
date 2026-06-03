import { Img } from '../components';

export interface TemplateImageProps {
  assetBaseUrl: string;
  className?: string;
  staticAsset: string;
  alt?: string;
}

export const TemplateImage = ({
  assetBaseUrl,
  className,
  staticAsset,
  alt = 'Leuna',
}: TemplateImageProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return <Img className={className} src={getAssetUrl(`/static/${staticAsset}`)} alt={alt} />;
};

export default TemplateImage;
