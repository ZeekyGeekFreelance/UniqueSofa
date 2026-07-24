export const SITE_CONTENT_QUERY = `
{
  "siteSettings": *[_type == "siteSettings" && _id == "site-settings-v1"][0]{
    brandName, brandShortName, brandSupportLabel,
    "brandLogoUrl": brandLogo.asset->url,
    phoneDisplay, phoneRaw, phoneHref,
    email, emailHref, whatsappHref, city, intro,
    brands,
    stats[]{ value, label },
    stores[]{ name, type, address, city, mapsUrl },
    specializations[]{ title, summary, items },
    navItems[]{ href, label },
    headerCtaLabel,
    homeWhyEyebrow, homeWhyTitle, homeWhyDescription,
    homeFeaturedRangesEyebrow, homeFeaturedRangesTitle, homeFeaturedRangesDescription,
    homeFeaturedProductsEyebrow, homeFeaturedProductsTitle, homeFeaturedProductsDescription,
    homeBrandsEyebrow, homeBrandsTitle, homeBrandsDescription,
    heroHappyCustomersCount, heroHappyCustomersLabel,
    heroFloatingCardTitle,
    "heroFloatingCardImage": heroFloatingCardImage.asset->url,
    "heroMedia": heroMedia[]{
      eyebrow, title, description,
      "image": image.asset->url
    },
    productsHeroEyebrow, productsHeroTitle, productsHeroSubtitle,
    productsSummaryTitle, productsSummaryDescription,
    productsNoResultEyebrow, productsNoResultTitle, productsNoResultDescription, productsNoResultResetLabel,
    productsFilterFamilyLabel, productsFilterRangeLabel, productsFilterBrandLabel,
    aboutHeroEyebrow, aboutHeroTitle, aboutHeroSubtitle,
    aboutPrimaryCtaLabel, aboutSecondaryCtaLabel,
    aboutModelEyebrow, aboutModelTitle, aboutModelDescription,
    aboutBrandsEyebrow, aboutBrandsTitle, aboutBrandsDescription,
    contactHeroEyebrow, contactHeroTitle, contactHeroSubtitle,
    contactQuickContactEyebrow,
    contactWhatsappTitle, contactWhatsappDescription,
    contactEnquiryEyebrow, contactEnquiryTitle, contactEnquiryDescription,
    contactEnquirySentTitle, contactEnquirySentDescription, contactEnquirySubmitLabel,
    contactBusinessHoursWeekday, contactBusinessHoursSunday,
    footerNavigateTitle, footerStoresTitle, footerContactTitle, footerBottomCaption,
    "featuredCategoryIds": featuredCategories[]->{
      "id": coalesce(id, slug.current)
    },
    "featuredProductIds": featuredProducts[]->{
      "id": coalesce(id, _id)
    }
  },
  "categories": *[_type == "category" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, title asc){
      "id": coalesce(id, slug.current),
      "slug": slug.current,
      code, title, subtitle, summary, badge, accent, tone, family, items,
      "images": coalesce(images[].asset->url, [])
    },
  "products": *[_type == "product" && coalesce(isPublished, true) == true]
    | order(coalesce(sortOrder, 999) asc, _updatedAt desc){
      "id": coalesce(id, _id),
      "slug": coalesce(slug.current, _id),
      name, brand, badge,
      "categoryId": coalesce(category->id, category->slug.current, category._ref),
      "categoryTitle": coalesce(category->title, category->name, ""),
      "family": coalesce(category->family, family),
      type, summary, description, features,
      specs[]{ label, value },
      tags,
      "images": images[].asset->url
    }
}
`;
