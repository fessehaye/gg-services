const axios = require("axios");
require("dotenv").config();

exports.handler = async function http(req) {
  try {
    const eventSlug = req.pathParameters.slug;
    const API = process.env.CHALLONGE_API;

    const matchResponse = await axios.get(
      `https://api.challonge.com/v1/tournaments/${eventSlug}/participants.json?api_key=${API}`
    );

    const body = JSON.stringify(matchResponse.data);
    return {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }, // CORS requirement
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
