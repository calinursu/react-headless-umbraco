import ContentLoader from 'components/cms/ContentLoader';
import Layout from 'components/common/Layout';
import { host } from 'constants/apiRoutes';
import { DENMARK_LANGUAGE_CODE, MAIN_TRANSLATIONS_NS } from 'constants/main';
import serverFetch from 'lib/api/server-fetch';
import { getCombinedNavData, getContent } from 'lib/api/umbraco-api-server';
import { GetStaticProps } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IContent } from 'types/cms';
import { IFetchError, isFetchErrorResponse } from 'types/main';
import { ILayout, IPageProps } from 'types/page';
import { TrackingEventTopic } from 'types/tracking';
import useTracking from 'utils/hooks/useTracking';

type Props = IPageProps;

const FourOhFour = ({ content, layoutData }: Props) => {
  const eventTracker = useTracking();
  const router = useRouter();
  const secret = router.asPath.indexOf('secret') > -1;
  const [defaultContent, setDefaultContent] = useState<IContent>(content);
  const contentFields = defaultContent.fields?.find((field) => field.alias === 'blockContent');

  useEffect(() => {
    eventTracker.send(TrackingEventTopic.PAGE_ERROR, {
      action: 'Page Error',
      value: {
        errorCode: 404,
      },
    });
  }, []);

  useEffect(() => {
    if (!secret) {
      return;
    }

    const fetchContent = async () => {
      const response: IContent | null = await getContent(router.asPath);

      if (!response || isFetchErrorResponse(response)) {
        return;
      }

      setDefaultContent(response);
    };

    fetchContent();
  }, [secret]);

  return (
    <>
      <Layout
        breadcrumbData={defaultContent.breadcrumb}
        layoutData={layoutData}
        pageType={defaultContent.system.contentType}
        title={defaultContent.head?.title}
      >
        <ContentLoader
          contentBlocks={contentFields?.value}
          pageType={defaultContent.system.contentType}
        ></ContentLoader>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const [contentResponse, layoutDataResponse, translationsResponse] = await Promise.allSettled([
    serverFetch(`${host}/api/error-pages/not-found`),
    getCombinedNavData(),
    serverSideTranslations(locale || DENMARK_LANGUAGE_CODE, [MAIN_TRANSLATIONS_NS]),
  ]);

  const content = (contentResponse as PromiseFulfilledResult<IContent>).value;
  const translations = (translationsResponse as PromiseFulfilledResult<SSRConfig>).value || {};
  const layoutData = (layoutDataResponse as PromiseFulfilledResult<ILayout>).value || {};
  const errorCode = (content as unknown as IFetchError)?.errorCode || null;

  if (errorCode === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...translations,
      content,
      layoutData,
    },
    revalidate: 20,
  };
};

export default FourOhFour;
