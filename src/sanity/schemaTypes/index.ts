import categoryType from "./categoryType";
import contactDetailsType from "./contactDetailsType";
import homepageCuratorTypes from "./homepageCuratorType";
import mapLocationType from "./mapLocationType";
import productType from "./productType";
import siteSettingsType from "./siteSettingsType";

export const schemaTypes = [
  siteSettingsType,
  contactDetailsType,
  mapLocationType,
  ...homepageCuratorTypes,
  categoryType,
  productType,
];

