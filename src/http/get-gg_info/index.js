// HTTP function
require("cross-fetch/polyfill");
const ApolloClient = require("apollo-boost").default;
const gql = require("apollo-boost").gql;
require("dotenv").config();

exports.handler = async function http(req) {
  try {
    const GET_EVENT_COUNT = gql `
      query eventQuery($slug: String) {
        event(slug: $slug) {
          sets(sortType: STANDARD, perPage: 20) {
            pageInfo {
              total
              totalPages
            }
          }
        }
      }
    `;

    const client = new ApolloClient({
      uri: "https://api.smash.gg/gql/alpha",
      request: operation => {
        operation.setContext({
          headers: {
            authorization: `Bearer ${process.env.GG_API}`
          }
        });
      }
    });
    const tournamentSlug = req.queryStringParameters.slug;

    const eventInfo = await client.query({
      query: GET_EVENT_COUNT,
      variables: {
        slug: tournamentSlug
      }
    });

    const body = JSON.stringify(eventInfo.data);

    return {
      headers: {
        "cache-control": "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0"
      },
      statusCode: 200,
      body
    };
  } catch (error) {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }, // CORS requirement
      statusCode: 300,
      body: '{"Error":"No Event Data Available"}'
    };
  }
};
