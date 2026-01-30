// GraphQL queries and mutations for metaobjects

export const GET_METAOBJECT_DEFINITIONS = `#graphql
  query GetMetaobjectDefinitions {
    metaobjectDefinitions(first: 50) {
      nodes {
        id
        name
        type
        fieldDefinitions {
          name
          key
          type {
            name
          }
          required
        }
      }
    }
  }
`;

export const GET_METAOBJECTS_BY_TYPE = `#graphql
  query GetMetaobjectsByType($type: String!, $first: Int = 50) {
    metaobjects(type: $type, first: $first) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          reference {
            ... on Collection {
              id
              title
              handle
            }
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
          }
        }
        updatedAt
      }
    }
  }
`;

export const CREATE_METAOBJECT_DEFINITION = `#graphql
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        name
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const CREATE_METAOBJECT = `#graphql
  mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject {
        id
        handle
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const UPDATE_METAOBJECT = `#graphql
  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject {
        id
        handle
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const DELETE_METAOBJECT = `#graphql
  mutation DeleteMetaobject($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const GET_COLLECTIONS = `#graphql
  query GetCollections($first: Int = 50) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
        productsCount {
          count
        }
      }
    }
  }
`;

export const GET_SHOP_INFO = `#graphql
  query GetShopInfo {
    shop {
      id
      name
      email
      myshopifyDomain
      primaryDomain {
        url
      }
    }
  }
`;
