// Data Source - GraphQL queries and mutations for Shopify Admin API

export const GET_METAOBJECT_DEFINITIONS = `#graphql
  query GetMetaobjectDefinitions {
    metaobjectDefinitions(first: 50) {
      nodes {
        id
        name
        type
        fieldDefinitions {
          key
          name
          type { name }
          required
        }
      }
    }
  }
`;

export const GET_METAOBJECTS_BY_TYPE = `#graphql
  query GetMetaobjectsByType($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          reference {
            ... on MediaImage {
              id
              image { url altText }
            }
            ... on Collection {
              id
              handle
              title
              image { url }
            }
            ... on Product {
              id
              handle
              title
            }
          }
          references(first: 10) {
            nodes {
              ... on MediaImage {
                id
                image { url }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_METAOBJECT_DEFINITION = `#graphql
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        type
        name
      }
      userErrors {
        field
        message
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
        fields {
          key
          value
        }
      }
      userErrors {
        field
        message
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
      }
    }
  }
`;

export const GET_SHOP_INFO = `#graphql
  query GetShopInfo {
    shop {
      name
      email
      primaryDomain {
        url
        host
      }
      myshopifyDomain
    }
  }
`;

export const GET_COLLECTIONS = `#graphql
  query GetCollections {
    collections(first: 100) {
      nodes {
        id
        title
        handle
        productsCount {
          count
        }
      }
    }
  }
`;

export const GET_LOCATIONS = `#graphql
  query GetLocations {
    locations(first: 50) {
      nodes {
        id
        name
        address {
          formatted
        }
      }
    }
  }
`;
