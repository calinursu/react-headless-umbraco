import ContentLoader from "components/cms/ContentLoader";
import Layout from "components/common/Layout";
import { getContent } from "lib/api/umbraco-api-server";
import { GetStaticPaths, GetStaticProps } from "next";
import Error from "pages/_error";
import { ParsedUrlQuery } from "querystring";
import { IContent } from "types/cms";
import { IFetchError } from "types/main";
import { IPageProps } from "types/page";

interface Props extends IPageProps {
  errorCode: number | null;
}

const CatchAllContent = ({ content, errorCode, layoutData }: Props) => {
  const contentFields = content.fields?.find(
    (field) => field.alias === "blockContent"
  );

  if (errorCode) {
    return <Error layoutData={layoutData} statusCode={errorCode} />;
  }
  return (
    <Layout
      breadcrumbData={content.breadcrumb}
      layoutData={layoutData}
      pageType={content.system?.contentType}
      title={content.head?.title}
    >
      <ContentLoader
        contentBlocks={contentFields?.value}
        pageType={content.system?.contentType}
      ></ContentLoader>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { content } = params as ParsedUrlQuery;
  const contentUrl = (content as string[]).join("/");
  const contentResponse = await getContent(contentUrl);

  if ((contentResponse as PromiseRejectedResult).reason) {
    return {
      notFound: true,
    };
  }

  const contentData = (contentResponse as PromiseFulfilledResult<IContent>)
    .value;
  const errorCode = (contentData as unknown as IFetchError)?.errorCode || null;

  if (errorCode === 404) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: contentData,
      errorCode,
    },
    revalidate: 60,
  };
};

export default CatchAllContent;
