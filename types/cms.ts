// Umbraco CMS modules and matching React components
export enum contentComponentsMap {
  "teaserModuleLayoutBlockType" = "TeaserWrapper",
}

// Page types defined in Umbraco
export enum umbracoPageTypes {
  "cartPageType",
  "contentPageType",
  "fourOhFour",
}

export interface IProperty {
  alias?: string;
  type?: string;
  value: any;
}
