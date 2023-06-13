import React from 'react';
import CmsTeaser from '.';

export default {
  title: 'Components/Teaser',
  component: CmsTeaser,
};

const TestData = {
  type: 'teaserModuleBlockType',
  value: [
    {
      alias: 'header',
      value: 'Header',
    },
    {
      alias: 'paragraph',
      value: 'Paragraph',
    },
    {
      alias: 'primaryImage',
      value: {
        alt: 'Welder',
        url: 'https://webapp-we-shop-umbraco-dailycore-publisher.azurewebsites.net/media/r0fiziit/welder.png?mode=crop&quality=90&height=656&width=1200&left=0.09&top=0.17682926829268292',
      },
    },
    {
      alias: 'button',
    },
  ],
  settings: [
    {
      alias: 'backgroundColor',
      value: '222,226,230',
    },
    {
      alias: 'gradientColor',
      value: '0,0,0',
    },
    {
      alias: 'headerSize',
      value: '2',
    },
    {
      alias: 'textColor',
      value: '50,76,89',
    },
  ],
};

export const First = () => <CmsTeaser content={TestData as any} width={'50%'} />;
