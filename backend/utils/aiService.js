const axios = require("axios");

exports.askAI = async (text) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    return "Error from AI";
  }
};