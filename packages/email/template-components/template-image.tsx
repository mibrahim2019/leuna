import { Img } from '../components';

export interface TemplateImageProps {
  assetBaseUrl: string;
  className?: string;
  staticAsset: string;
  alt?: string;
}

/** Busts cached email-client images when static branding assets change. */
const STATIC_ASSET_VERSION = '2';

export const TemplateImage = ({
  assetBaseUrl,
  className,
  staticAsset,
  alt = 'Leuna',
}: TemplateImageProps) => {
  const getAssetUrl = (path: string) => {
    const url = new URL(path, assetBaseUrl);
    url.searchParams.set('v', STATIC_ASSET_VERSION);

    return url.toString();
  };

  return <Img className={className} src={getAssetUrl(`/static/${staticAsset}`)} alt={alt} />;
};

export default TemplateImage;
