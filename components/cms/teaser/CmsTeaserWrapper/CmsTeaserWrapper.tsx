import cn from 'clsx';
import useMedia from 'use-media';
import { IContentComponent, umbracoPageTypes } from 'types/cms';

import Heading from 'components/ui/Heading';
import Teaser from '../CmsTeaser';
import Text from 'components/ui/Text';

import { breakpoints, maxWidth } from 'styles/theme';
import s from './CmsTeaserWrapper.module.scss';

type Props = {
  content: IContentComponent;
  pageType: keyof typeof umbracoPageTypes;
};

type UmbracoPageTypes = keyof typeof umbracoPageTypes;

const MARGIN_BETWEEN_PX = 20;

const CmsTeaserWrapper = ({ content, pageType }: Props) => {
  const winBelowLarge = useMedia(maxWidth(breakpoints.large));

  const isContentPage = umbracoPageTypes[pageType as UmbracoPageTypes] === umbracoPageTypes.contentPageType;

  const maxItemsPerRow = isContentPage ? 2 : 3;

  const blockContent = content.value.find((field) => field.alias === 'blockContent')?.value as IContentComponent[];

  const itemsPerRow = blockContent.length >= maxItemsPerRow ? maxItemsPerRow : blockContent.length;

  const totalRows = Math.ceil(blockContent.length / itemsPerRow);

  const header = content.value.find((field) => field.alias === 'header')?.value;
  const paragraph = content.value.find((field) => field.alias === 'paragraph')?.value;

  return (
    <>
      <div className={s.headerWrapper}>
        {header ? <Heading level={2}>{header}</Heading> : null}
        {paragraph ? (
          <Text color="dark" tag="p">
            {paragraph}
          </Text>
        ) : null}
      </div>
      <div className={s.wrapper}>
        {blockContent.length
          ? blockContent.map((teaser, i: number) => {
              return (
                <Teaser
                  className={cn({
                    [s.noMarginBottom]: !winBelowLarge && Math.ceil((i + 1) / itemsPerRow) === totalRows, // Targeting items that fall in the last row
                  })}
                  content={teaser}
                  key={i}
                  width={
                    blockContent.length > 1
                      ? `calc((100% / ${itemsPerRow}) - ${(MARGIN_BETWEEN_PX * (itemsPerRow - 1)) / itemsPerRow}px)`
                      : ''
                  }
                />
              );
            })
          : null}
      </div>
    </>
  );
};

export default CmsTeaserWrapper;
