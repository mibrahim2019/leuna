import { Column, Img, Row, Section } from '../components';

export interface TemplateDocumentImageProps {
  assetBaseUrl: string;
  className?: string;
}

export const TemplateDocumentImage = ({ assetBaseUrl, className }: TemplateDocumentImageProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Section
      className={`mb-8 rounded-[20px] border border-solid border-[#eceff1] bg-[#f9fafb] px-6 py-8 ${
        className ?? ''
      }`}
    >
      <Row className="table-fixed">
        <Column />

        <Column>
          <Img className="mx-auto h-36 w-auto" src={getAssetUrl('/static/document.png')} alt="Sign" />
        </Column>

        <Column />
      </Row>
    </Section>
  );
};

export default TemplateDocumentImage;
