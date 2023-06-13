import cn from 'clsx';
import { IContentComponent, IContentValues } from 'types/cms';
import useMedia from 'use-media';
import { getButtonComponentData, getComponentSetting, getContentComponent } from 'utils/content-utils';

import CmsButton from 'components/cms/CmsButton';
import Heading from 'components/ui/Heading';
import { headingLevel } from 'components/ui/Heading/Heading';
import Image from 'components/ui/Image';
import Text from 'components/ui/Text';

import { breakpoints, maxWidth } from 'styles/theme';
import s from './CmsTeaser.module.scss';

type Props = {
  className?: string;
  content: IContentComponent;
  style?: React.CSSProperties;
  width: string;
};

const CmsTeaser = ({ className, content, width }: Props) => {
  const winBelowLarge = useMedia(maxWidth(breakpoints.large));

  const backgroundColor = getComponentSetting(content, 'backgroundColor')?.value;
  const gradientColor = getComponentSetting(content, 'gradientColor')?.value;
  const headerLevel = getComponentSetting(content, 'headerSize')?.value || 2;
  const textColor = getComponentSetting(content, 'textColor')?.value;

  const primaryImage = getContentComponent(content, 'primaryImage')?.value as IContentValues;
  const mobileImage = getContentComponent(content, 'mobileImage')?.value as IContentValues;

  const header = getContentComponent(content, 'header');
  const paragraph = getContentComponent(content, 'paragraph');
  const button = getButtonComponentData(content, 'button');

  return (
    <div
      className={cn(s.wrapper, className)}
      style={{
        width: width || '100%',
        ...(backgroundColor && { backgroundColor: `rgb(${backgroundColor})` }),
      }}
    >
      <div className={s.inner}>
        {primaryImage ? (
          <Image
            className={s.image}
            imageProps={{
              alt: winBelowLarge && mobileImage ? mobileImage?.alt : primaryImage.alt,
              layout: 'fill',
              objectFit: 'cover',
              src: winBelowLarge && mobileImage ? mobileImage?.url : primaryImage?.url,
            }}
          />
        ) : null}

        {gradientColor ? (
          <div
            className={s.gradient}
            style={{
              backgroundImage: `linear-gradient(90deg, 
              rgba(${gradientColor}, 0.3) 0, 
              rgba(${gradientColor}, 0) 100%)`,
            }}
          ></div>
        ) : null}

        <div
          className={s.infoContainer}
          style={
            backgroundColor
              ? {
                  backgroundColor: `rgba(${backgroundColor}, 0.9)`,
                }
              : {}
          }
        >
          <Heading
            as={headerLevel as headingLevel}
            className={s.header}
            level={2}
            style={
              textColor
                ? {
                    color: `rgb(${textColor})`,
                  }
                : {}
            }
          >
            {header?.value}
          </Heading>

          {paragraph ? (
            <Text
              className={s.paragraph}
              style={
                textColor
                  ? {
                      color: `rgb(${textColor})`,
                    }
                  : {}
              }
              tag="p"
            >
              {paragraph.value}
            </Text>
          ) : null}

          {button?.url ? (
            <div className={s.buttonWrapper}>
              <CmsButton content={button} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CmsTeaser;
