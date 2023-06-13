import dynamic from "next/dynamic";
import { contentComponentsMap, IProperty, umbracoPageTypes } from "types/cms";

const componentList = {
  TeaserWrapper: dynamic(() => import(`../teaser/CmsTeaserWrapper`)),
};

type Props = {
  contentBlocks: IProperty[];
  pageType: keyof typeof umbracoPageTypes;
};

type ContentComponentStrings = keyof typeof contentComponentsMap;

const ContentLoader = ({ contentBlocks, pageType }: Props) => {
  return (
    <>
      {contentBlocks
        ? contentBlocks.map((contentBlock, i) => {
            const contentBlockName =
              contentBlock.type as ContentComponentStrings;
            const component = contentComponentsMap[contentBlockName];

            // Load component dynamically if it recognized the "component"
            const ContentComponent = component
              ? componentList[component]
              : (null as any);

            return (
              <div key={i}>
                {component ? (
                  <ContentComponent
                    content={contentBlock}
                    pageType={pageType}
                  />
                ) : (
                  // TODO: Fall back output for unknown content block types – should not be outputted
                  <p>{contentBlock.type}</p>
                )}
              </div>
            );
          })
        : null}
    </>
  );
};

export default ContentLoader;
