const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "", { variables }: Record<string, any> = {}) {
  const headers = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  // WPGraphQL Plugin must be enabled
  const res = await fetch(API_URL, {
    headers,
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json.data;
}

export async function getPreviewPost(id, idType = "DATABASE_ID") {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    }
  );
  return data.post;
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.posts;
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.posts;
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug;
  const isDraft = isSamePost && postPreview?.status === "draft";
  const isRevision = isSamePost && postPreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
            }
          }
        }
        `
            : ""
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    }
  );

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node;

    if (revision) Object.assign(data.post, revision);
    delete data.post.revisions;
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop();

  return data;
}

// FOR TESTING, DELETE LATER
// export async function getPageAndMorePages(slug, preview, previewData) {
//   const pagePreview = preview && previewData?.page;
//   // The slug may be the id of an unpublished page
//   const isId = Number.isInteger(Number(slug));
//   const isSamePage = isId
//     ? Number(slug) === pagePreview.id
//     : slug === pagePreview.slug;
//   const isDraft = isSamePage && pagePreview?.status === "draft";
//   const isRevision = isSamePage && pagePreview?.status === "publish";
//   const data = await fetchAPI(
//     `
//     fragment PageFields on Page {
//       title
//       slug
//       date
//       featuredImage {
//         node {
//           sourceUrl
//         }
//       }
//     }
//     query PageBySlug($id: ID!, $idType: PageIdType!) {
//       page(id: $id, idType: $idType) {
//         ...PageFields
//         content
//         ${
//           // Only some of the fields of a revision are considered as there are some inconsistencies
//           isRevision
//             ? `
//         revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
//           edges {
//             node {
//               title
//               excerpt
//               content
//             }
//           }
//         }
//         `
//             : ""
//         }
//       }
//       pages(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
//         edges {
//           node {
//             ...PageFields
//           }
//         }
//       }
//     }
//   `,
//     {
//       variables: {
//         id: isDraft ? pagePreview.id : slug,
//         idType: isDraft ? "DATABASE_ID" : "URI",
//       },
//     }
//   );

//   // Draft pages may not have an slug
//   if (isDraft) data.page.slug = pagePreview.id;
//   // Apply a revision (changes in a published page)
//   if (isRevision && data.page.revisions) {
//     const revision = data.page.revisions.edges[0]?.node;

//     if (revision) Object.assign(data.page, revision);
//     delete data.page.revisions;
//   }

//   // Filter out the main page
//   data.pages.edges = data.pages.edges.filter(({ node }) => node.slug !== slug);
//   // If there are still 3 pages, remove the last one
//   if (data.pages.edges.length > 2) data.pages.edges.pop();

//   return data;
// }

export async function getRestaurantAndMoreRestaurants(
  slug,
  preview,
  previewData
) {
  const restaurantPreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === restaurantPreview.id
    : slug === restaurantPreview.slug;
  const isDraft = isSamePost && restaurantPreview?.status === "draft";
  const isRevision = isSamePost && restaurantPreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment RestaurantFields on Restaurant {
      id
      slug
      content
      title
      uri
      featuredImage {
        node {
          altText
          caption
          id
          mediaItemUrl
        }
      }
      restaurantFields {
        shortSummary
        pairings
        fourthCourse
        signatureCocktails
        girlsNightOut
        liveEntertainment
        stella
        newRestaurant
        jamesBeard
        dressForTheOccasion
        restaurantAddress
        website
        openTable
        openTableLink
        menu {
          mediaItemUrl
        }
        restaurantLogo{
          id
          altText
          caption
          mediaItemUrl
        }
      }
      advertisements {
        bottomAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
        midAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
        topAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
      }
      cuisines {
        edges {
          node {
            id
            name
          }
        }
      }
      diningSelections {
        edges {
          node {
            id
            name
          }
        }
      }
      weeksParticipating {
        edges {
          node {
            name
            id
          }
        }
      }
      locations {
        edges {
          node {
            id
            name
          }
        }
      }
      ownerships {
        edges {
          node {
            id
            name
          }
        }
      }
      weeksParticipating {
        edges {
          node {
            name
            id
          }
        }
      }
      curatedCollections {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    query RestaurantBySlug($id: ID!, $idType: RestaurantIdType!) {
      restaurant(id: $id, idType: $idType){
        ...RestaurantFields
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
            }
          }
        }
        `
            : ""
        }
      }
      restaurants(first: 1000, where: { orderby: { field: DATE, order: DESC } }){
        edges{
          node {
            ...RestaurantFields
          }
        }
      }
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? restaurantPreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "SLUG",
      },
    }
  );

  // Draft restaurants may not have an slug
  if (isDraft) data.restaurant.slug = restaurantPreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.restaurant.revisions) {
    const revision = data.restaurant.revisions.edges[0]?.node;

    if (revision) Object.assign(data.restaurant, revision);
    delete data.restaurant.revisions;
  }

  // Filter out the main post
  data.restaurants.edges = data.restaurants.edges.filter(
    ({ node }) => node.slug !== slug
  );
  // If there are still 3 restaurants, remove the last one
  // if (data.restaurants.edges.length > 2) data.restaurants.edges.pop();

  return data;
}

export async function getPageAndMorePages(slug, preview, previewData) {
  const pagePreview = preview && previewData?.post;
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug));
  const isSamePost = isId
    ? Number(slug) === pagePreview.id
    : slug === pagePreview.slug;
  const isDraft = isSamePost && pagePreview?.status === "draft";
  const isRevision = isSamePost && pagePreview?.status === "publish";
  const data = await fetchAPI(
    `
    fragment PageFields on Page {
      id
      slug
      content
      title
      uri
      featuredImage {
        node {
          altText
          caption
          id
          mediaItemUrl
        }
      }
      pageFields {
        summary
        heroVideoUrl
        heroImage {
          mediaItemUrl
        }
      }
      galleryFields {
        staffGallery {
          mediaItemUrl
          caption
          altText
          description
        }
      }
      advertisements {
        bottomAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
        midAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
        topAd {
          ... on Advertisement {
            id
            title
            uri
            adsFields {
              largeBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              smallBanner{
                id
                altText
                caption
                mediaItemUrl
              }
              link
            }
          }
        }
      }
    }
    query PageBySlug($id: ID!, $idType: PageIdType!) {
      page(id: $id, idType: $idType){
        ...PageFields
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
            }
          }
        }
        `
            : ""
        }
      }
      pages(first: 1000, where: { orderby: { field: DATE, order: DESC } }){
        edges{
          node {
            ...PageFields
          }
        }
      }
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? pagePreview.id : slug,
        idType: isDraft ? "DATABASE_ID" : "URI",
      },
    }
  );

  // Draft restaurants may not have an slug
  if (isDraft) data.page.slug = pagePreview.id;
  // Apply a revision (changes in a published post)
  if (isRevision && data.page.revisions) {
    const revision = data.page.revisions.edges[0]?.node;

    if (revision) Object.assign(data.restaurant, revision);
    delete data.page.revisions;
  }

  // Filter out the main post
  data.pages.edges = data.pages.edges.filter(({ node }) => node.slug !== slug);
  // If there are still 3 oages, remove the last one
  // if (data.pages.edges.length > 2) data.pages.edges.pop();

  return data;
}

export async function getAllRestaurantsWithSlug() {
  const data = await fetchAPI(`
    {
      restaurants(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.restaurants;
}

export async function getAllPagesWithSlug() {
  const data = await fetchAPI(`
    {
      pages(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return data?.pages;
}

export async function getHomePageData(preview) {
  const data = await fetchAPI(
    `
    {
      nodeByUri(uri: "/") {
        ... on Page {
          id
          title
          content
          homepageFields {
            featureSlider {
              text
              slideMeta {
                link {
                  target
                  title
                  url
                }
                headline
                background {
                  altText
                  id
                  mediaItemUrl
                  caption
                }
              }
            }
            homepageCarousel {
              ... on Restaurant {
                id
                title
                restaurantFields {
                  shortSummary
                }
                locations {
                  edges {
                    node {
                      name
                    }
                  }
                }
                featuredImage {
                  node {
                    altText
                    id
                    mediaItemUrl
                  }
                }
                slug
                contentTypeName
              }
            }
            charities {
              charityName
              charityDescription
              link
              charityLogo {
                altText
                id
                mediaItemUrl
              }
            }
            sponsors {
              ... on Sponsor {
                id
                title
                featuredImage {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
          }
          advertisements {
            bottomAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
            midAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
            topAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
          }
          pageFields {
            summary
            relatedPages {
              ... on Page {
                id
                title
                slug
                featuredImage {
                  node {
                    altText
                    id
                    mediaItemUrl
                  }
                }
                pageFields{
                  summary
                }
              }
            }
          }
        }
      }
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data;
}


export async function getUberPageData(preview) {
  const data = await fetchAPI(
    `
    {
      nodeByUri(uri: "/uber-eats-week") {
        ... on Page {
          id
          title
          content
          uberEatsWeekFields{
            uberEatsFeaturedLinks{
              thumbnail{
                altText
                id
                mediaItemUrl
                caption
              }
              title
              description
              link
            }
          }
          homepageFields {
            featureSlider {
              text
              slideMeta {
                link {
                  target
                  title
                  url
                }
                headline
                background {
                  altText
                  id
                  mediaItemUrl
                  caption
                }
              }
            }
            homepageCarousel {
              ... on Restaurant {
                id
                title
                restaurantFields {
                  shortSummary
                }
                locations {
                  edges {
                    node {
                      name
                    }
                  }
                }
                featuredImage {
                  node {
                    altText
                    id
                    mediaItemUrl
                  }
                }
                slug
                contentTypeName
              }
            }
            charities {
              charityName
              charityDescription
              link
              charityLogo {
                altText
                id
                mediaItemUrl
              }
            }
            sponsors {
              ... on Sponsor {
                id
                title
                featuredImage {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
          }
          advertisements {
            bottomAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
            midAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
            topAd {
              ... on Advertisement {
                id
                title
                uri
                adsFields {
                  largeBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  smallBanner{
                    id
                    altText
                    caption
                    mediaItemUrl
                  }
                  link
                }
              }
            }
          }
          pageFields {
            summary
            relatedPages {
              ... on Page {
                id
                title
                slug
                featuredImage {
                  node {
                    altText
                    id
                    mediaItemUrl
                  }
                }
                pageFields{
                  summary
                }
              }
            }
          }
        }
      }
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data;
}


export async function getFooterMenu() {
  const data = await fetchAPI(
    `
    {
      menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `
  );
  return data?.menus.nodes[0];
}

export async function getMainMenu() {
  const data = await fetchAPI(
    `
    {
      menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `
  );
  return data?.menus.nodes[0];
}

export async function getSocialMenu() {
  const data = await fetchAPI(
    `
    {
      menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `
  );

  return data?.menus.nodes[0];
}

export async function getMenuData() {
  const data = await fetchAPI(
    `
    {
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `
  );
  return data;
}

export async function getRestaurantFilterObjects(preview) {
  const data = await fetchAPI(
    `
    {
      restaurants(first: 10000) {
        edges {
          node {
            id
            slug
            title
            uri
            featuredImage {
              node {
                mediaItemUrl
                altText
              }
            }
            restaurantFields {
              shortSummary
              pairings
              fourthCourse
              signatureCocktails
              girlsNightOut
              liveEntertainment
              stella
              newRestaurant
              jamesBeard
              dressForTheOccasion
              restaurantAddress
              longitude
              latitude
              website
              openTable
              openTableLink
              menu {
                mediaItemUrl
              }
              restaurantLogo{
                id
                altText
                caption
                mediaItemUrl
              }
            }
            cuisines {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
            diningSelections {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
            locations {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
            weeksParticipating {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
            curatedCollections {
              edges {
                node {
                  id
                  name
                  slug
                }
              }
            }
          }
        }
      }
      cuisines(first: 1000) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      diningSelections(first: 1000) {
        edges {
          node {
            id
            name
            slug
            categoryAds {
              categoryAd {
                ... on Advertisement {
                  id
                  adsFields {
                    link
                    largeBanner {
                      altText
                      id
                      mediaItemUrl
                    }
                    smallBanner {
                      altText
                      mediaItemUrl
                      id
                    }
                  }
                }
              }
              categoryImg {
                altText
                mediaItemUrl
              }
            }
          }
        }
      }
      locations(first: 1000) {
        edges {
          node {
            id
            name
            slug
            categoryAds {
              categoryAd {
                ... on Advertisement {
                  id
                  adsFields {
                    link
                    largeBanner {
                      altText
                      id
                      mediaItemUrl
                    }
                    smallBanner {
                      altText
                      mediaItemUrl
                      id
                    }
                  }
                }
              }
              categoryImg {
                altText
                mediaItemUrl
              }
            }
          }
        }
      }
      weeksParticipating(first: 1000) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      curatedCollections(first: 1000) {
        edges {
          node {
            id
            name
            slug
            categoryAds {
              categoryAd {
                ... on Advertisement {
                  id
                  adsFields {
                    link
                    largeBanner {
                      altText
                      id
                      mediaItemUrl
                    }
                    smallBanner {
                      altText
                      mediaItemUrl
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
      mainMenu: menus(where: {slug: "main-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      },
      socialMenu: menus(where: {slug: "social-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
      footerMenu: menus(where: {slug: "footer-menu"}) {
        nodes {
          id
          name
          slug
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
    `
  );
  return data;
}
