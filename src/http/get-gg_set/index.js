// HTTP function
require("cross-fetch/polyfill");
const ApolloClient = require("apollo-boost").default;
const gql = require("apollo-boost").gql;
require("dotenv").config();

exports.handler = async function http(req) {
  try {
    const GET_EVENT_SETS = gql`
      query eventQuery($slug: String, $page: Int) {
        event(slug: $slug) {
          sets(sortType: STANDARD, perPage: 20, page: $page) {
            nodes {
              phaseGroupId
              fullRoundText
              slots {
                entrant {
                  name
                }
              }
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

    const eventInfo = await client.query({
      query: GET_EVENT_SETS,
      variables: {
        slug: req.queryStringParameters.slug,
        page: parseInt(req.queryStringParameters.page) || 1
      }
    });

    const body = JSON.stringify(eventInfo.data);

    return {
      headers: {
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0"
      },
      statusCode: 200,
      body
    };
  } catch (error) {
    console.log(error);
    return {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }, // CORS requirement
      statusCode: 300,
      body: '{"Error":"No Event Data Available"}'
    };
  }
};
